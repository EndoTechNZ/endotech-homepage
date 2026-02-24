const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const FPS = 30;
const PADDING_FRAMES = 30;
const CTA_END_PAUSE = 90;

const scenes = [
  { id: "intro", name: "IntroScene" },
  { id: "problem", name: "ProblemScene" },
  { id: "technology", name: "TechnologyScene" },
  { id: "products", name: "ProductsScene" },
  { id: "benefits", name: "BenefitsScene", subNarrations: ["benefits-1", "benefits-2", "benefits-3"] },
  { id: "cta", name: "CTAScene", subNarrations: ["cta-ready", "cta-contact"] },
];

function getAudioDuration(filePath) {
  try {
    const result = execSync(
      `ffprobe -i "${filePath}" -show_entries format=duration -v quiet -of csv="p=0"`,
      { encoding: "utf-8" }
    );
    return parseFloat(result.trim());
  } catch (error) {
    console.error(`Error getting duration for ${filePath}:`, error.message);
    return 5;
  }
}

function main() {
  console.log("Generating timing config...\n");

  const assetsDir = path.join(__dirname, "..", "public", "assets");
  const config = {
    fps: FPS,
    scenes: [],
    narrations: [],
    totalFrames: 0,
  };

  let currentFrame = 0;

  for (const scene of scenes) {
    const sceneConfig = {
      id: scene.id,
      name: scene.name,
      startFrame: currentFrame,
    };

    if (scene.subNarrations) {
      // Scene with multiple narrations
      // CTA starts immediately, others have 20 frame delay
      let subFrame = scene.id === "cta" ? currentFrame : currentFrame + 20;
      let totalDuration = 0;

      for (const subId of scene.subNarrations) {
        const audioPath = path.join(assetsDir, `narration-${subId}.mp3`);
        const duration = getAudioDuration(audioPath);
        const frames = Math.ceil(duration * FPS);

        config.narrations.push({
          id: subId,
          file: `narration-${subId}.mp3`,
          startFrame: subFrame,
          durationFrames: frames,
        });

        totalDuration += duration;
        subFrame += frames + 10;
      }

      sceneConfig.durationFrames = Math.ceil(totalDuration * FPS) + PADDING_FRAMES + (scene.subNarrations.length - 1) * 10;

      // Add extra freeze time for CTA scene
      if (scene.id === "cta") {
        sceneConfig.durationFrames += CTA_END_PAUSE;
      }
    } else {
      // Single narration scene
      const audioPath = path.join(assetsDir, `narration-${scene.id}.mp3`);
      const duration = getAudioDuration(audioPath);
      const frames = Math.ceil(duration * FPS);

      config.narrations.push({
        id: scene.id,
        file: `narration-${scene.id}.mp3`,
        startFrame: currentFrame + 20,
        durationFrames: frames,
      });

      sceneConfig.durationFrames = frames + PADDING_FRAMES;
    }

    config.scenes.push(sceneConfig);
    currentFrame += sceneConfig.durationFrames;
  }

  config.totalFrames = currentFrame;
  config.totalSeconds = currentFrame / FPS;

  // Calculate music offset (music is ~181.5s)
  const musicDuration = 181.5;
  config.musicStartFrom = Math.round((musicDuration - config.totalSeconds) * FPS);

  // Write config
  const configPath = path.join(__dirname, "..", "src", "timing.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log("Timing config:");
  console.log(`  Total: ${config.totalFrames} frames (${config.totalSeconds.toFixed(1)}s)`);
  console.log(`  Scenes: ${config.scenes.length}`);
  console.log(`  Narrations: ${config.narrations.length}`);
  console.log(`  Music offset: ${config.musicStartFrom} frames`);
  console.log(`\nSaved: ${configPath}`);
}

main();
