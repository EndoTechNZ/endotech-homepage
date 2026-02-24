require("dotenv").config();
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "zGjIP4SZlMnY9m93k97r"; // Hope - clear, relatable, and charismatic

if (!API_KEY) {
  console.error("Error: ELEVENLABS_API_KEY environment variable is required");
  console.error("Usage: ELEVENLABS_API_KEY=sk_xxx npm run narration");
  process.exit(1);
}

const narrationSegments = [
  {
    id: "intro",
    text: "Introducing TransformX. Rotary endodontic files engineered for predictable outcomes.",
  },
  {
    id: "problem",
    text: "Reduce the unexpected in endodontics.",
  },
  {
    id: "technology",
    text: "Avatar Tip technology enables centered apical progression, minimizing ledging, transportation, and perforation risk.",
  },
  {
    id: "products",
    text: "Choose from ET TransformX for EdgeTaper users, PT TransformX for ProTaper workflows, or pair with iRoot bioceramic sealer.",
  },
  {
    id: "benefits-1",
    text: "Get to length predictably.",
  },
  {
    id: "benefits-2",
    text: "Same technique, better results.",
  },
  {
    id: "benefits-3",
    text: "Reduced separation risk.",
  },
  {
    id: "cta-ready",
    text: "Ready to elevate your endo?",
  },
  {
    id: "cta-contact",
    text: "Contact EndoTech today.",
  },
];

async function generateNarration(segment) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: segment.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "assets",
    `narration-${segment.id}.mp3`
  );

  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  const targetId = process.argv[2];

  const segments = targetId
    ? narrationSegments.filter(s => s.id === targetId)
    : narrationSegments;

  if (targetId && segments.length === 0) {
    console.error(`Unknown segment: ${targetId}`);
    console.log("Available:", narrationSegments.map(s => s.id).join(", "));
    process.exit(1);
  }

  console.log(`Generating narration with ElevenLabs...${targetId ? ` (${targetId} only)` : ""}\n`);

  for (const segment of segments) {
    console.log(`Processing: ${segment.id}`);
    try {
      await generateNarration(segment);
    } catch (error) {
      console.error(`Error generating ${segment.id}:`, error.message);
    }
  }

  console.log("\nDone!");
}

main();
