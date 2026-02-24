const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "public", "assets");

// Analyze audio levels
function analyzeAudio(filePath) {
  try {
    const result = execSync(
      `ffmpeg -i "${filePath}" -af "volumedetect" -f null - 2>&1`,
      { encoding: "utf-8" }
    );

    const meanMatch = result.match(/mean_volume: ([-\d.]+) dB/);
    const maxMatch = result.match(/max_volume: ([-\d.]+) dB/);

    return {
      mean: meanMatch ? parseFloat(meanMatch[1]) : null,
      max: maxMatch ? parseFloat(maxMatch[1]) : null,
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return { mean: null, max: null };
  }
}

// Process narration: normalize + compress for consistent levels
function processNarration(inputPath, outputPath) {
  console.log(`  Processing: ${path.basename(inputPath)}`);

  // Audio filter chain:
  // 1. highpass at 80Hz to remove rumble
  // 2. compressor to even out dynamics
  // 3. loudnorm to normalize to -20 LUFS (quieter voice)
  const filterChain = [
    "highpass=f=80",
    "acompressor=threshold=-20dB:ratio=4:attack=5:release=50",
    "loudnorm=I=-20:TP=-1.5:LRA=11",
  ].join(",");

  try {
    execSync(
      `ffmpeg -y -i "${inputPath}" -af "${filterChain}" "${outputPath}"`,
      { stdio: "pipe" }
    );
    return true;
  } catch (error) {
    console.error(`  Error processing ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

// Process music: compress to max, then reduce 33% below voice
function processMusic(inputPath, outputPath) {
  console.log(`  Processing music: compress + normalize, then -4dB for voice headroom...`);

  // Compress and normalize music to be present but not overpowering
  // Voice is at -20 LUFS, music at -18 LUFS (slightly quieter)
  const filterChain = [
    "acompressor=threshold=-15dB:ratio=3:attack=20:release=250",
    "loudnorm=I=-18:TP=-1:LRA=11",
  ].join(",");

  try {
    execSync(
      `ffmpeg -y -i "${inputPath}" -af "${filterChain}" -b:a 192k "${outputPath}"`,
      { stdio: "pipe" }
    );
    return true;
  } catch (error) {
    console.error(`  Error processing music:`, error.message);
    // Fallback: just adjust volume without complex filters
    console.log(`  Trying simpler volume adjustment...`);
    try {
      execSync(
        `ffmpeg -y -i "${inputPath}" -af "volume=1.5,volume=-4dB" -b:a 192k "${outputPath}"`,
        { stdio: "pipe" }
      );
      return true;
    } catch (e) {
      console.error(`  Fallback also failed:`, e.message);
      return false;
    }
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Audio Analysis & Processing");
  console.log("=".repeat(60));

  // Analyze current levels
  console.log("\n1. Analyzing current audio levels...\n");

  const narrationFiles = fs.readdirSync(assetsDir)
    .filter(f => f.startsWith("narration-") && f.endsWith(".mp3"));

  console.log("Narration files:");
  for (const file of narrationFiles) {
    const filePath = path.join(assetsDir, file);
    const levels = analyzeAudio(filePath);
    console.log(`  ${file}: mean=${levels.mean?.toFixed(1)}dB, max=${levels.max?.toFixed(1)}dB`);
  }

  const musicPath = path.join(assetsDir, "music.mp3");
  if (fs.existsSync(musicPath)) {
    const musicLevels = analyzeAudio(musicPath);
    console.log(`\nMusic file:`);
    console.log(`  music.mp3: mean=${musicLevels.mean?.toFixed(1)}dB, max=${musicLevels.max?.toFixed(1)}dB`);
  }

  // Process audio
  console.log("\n2. Processing narration (compress + normalize)...\n");

  // Backup originals
  const backupDir = path.join(assetsDir, "originals");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (const file of narrationFiles) {
    const inputPath = path.join(assetsDir, file);
    const backupPath = path.join(backupDir, file);
    const tempPath = path.join(assetsDir, `temp_${file}`);

    // Backup original if not already backed up
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
    }

    // Process to temp file then replace
    if (processNarration(inputPath, tempPath)) {
      fs.renameSync(tempPath, inputPath);
    }
  }

  // Process music
  console.log("\n3. Processing music (EQ pocket + level reduction)...\n");

  if (fs.existsSync(musicPath)) {
    const musicBackupPath = path.join(backupDir, "music.mp3");
    const tempMusicPath = path.join(assetsDir, "temp_music.mp3");

    if (!fs.existsSync(musicBackupPath)) {
      fs.copyFileSync(musicPath, musicBackupPath);
    }

    if (processMusic(musicPath, tempMusicPath)) {
      fs.renameSync(tempMusicPath, musicPath);
    }
  }

  // Analyze new levels
  console.log("\n4. Verifying processed audio levels...\n");

  console.log("Processed narration:");
  for (const file of narrationFiles) {
    const filePath = path.join(assetsDir, file);
    const levels = analyzeAudio(filePath);
    console.log(`  ${file}: mean=${levels.mean?.toFixed(1)}dB, max=${levels.max?.toFixed(1)}dB`);
  }

  if (fs.existsSync(musicPath)) {
    const musicLevels = analyzeAudio(musicPath);
    console.log(`\nProcessed music:`);
    console.log(`  music.mp3: mean=${musicLevels.mean?.toFixed(1)}dB, max=${musicLevels.max?.toFixed(1)}dB`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("Done! Originals backed up to public/assets/originals/");
  console.log("=".repeat(60));
}

main();
