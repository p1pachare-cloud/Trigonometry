// scripts/generate_audio.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

let envKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
if (!envKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
  if (match) envKey = match[1].trim();
}

const API_KEY = envKey || process.env.ELEVENLABS_API_KEY || '';
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel - Clear, engaging educator voice
const MODEL_ID = 'eleven_turbo_v2_5';

const audioDir = path.join(__dirname, '../public/audio');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

export const AUDIO_ITEMS = [
  // --- LEVEL 1 STORY PANELS ---
  {
    file: 'story-1-1.mp3',
    text: 'The Meridian Express rolls to a stop before the Great Pyramid of Giza. Nobody can climb this ancient wonder with a measuring tape. Apprentice surveyors, Theo has your first mission.',
  },
  {
    file: 'story-1-2.mp3',
    text: 'As ancient stories tell, the philosopher Thales planted his staff in the desert sand. He did not climb. He waited until his own shadow was exactly as long as his staff.',
  },
  {
    file: 'story-1-3.mp3',
    text: 'Later in the afternoon, the sun dips. Kofi measures a two-meter rod casting a three-point-five meter shadow. Ira notices: the triangle made by the staff has the exact same shape as the giant triangle made by the pyramid.',
  },
  {
    file: 'story-1-4.mp3',
    text: 'In Alexandria, Eratosthenes realized that shadows cast in two distant cities revealed the curvature of the world. With simple angles and footsteps, humanity measured the circumference of the Earth.',
  },
  {
    file: 'story-1-5.mp3',
    text: 'Aboard the train, Mei names the three sacred ratios: opposite over hypotenuse, adjacent over hypotenuse, and opposite over adjacent. Theo stamps them with their true names: Sine, Cosine, and Tangent.',
  },
  {
    file: 'story-1-6.mp3',
    text: 'Theo unlatches the brass clinometer. Give me an angle and a single baseline distance, and together we will measure anything tall.',
  },

  // --- LEVEL 2 STORY PANELS ---
  {
    file: 'story-2-1.mp3',
    text: 'In ancient India, the astronomer Aryabhata mapped the heavens using bowstrings called jya. Instead of flat triangles, he placed angles inside circles.',
  },
  {
    file: 'story-2-2.mp3',
    text: 'Calculating ratios for different planetary spheres was tedious. Aryabhata simplified everything by setting the circles radius to exactly one. The Unit Circle was born.',
  },
  {
    file: 'story-2-3.mp3',
    text: 'Ira watches the rotating beam sweep past ninety degrees. A right triangle cannot have an angle of one hundred and twenty degrees, but a circle can! The horizontal position is cosine; the vertical position is sine.',
  },
  {
    file: 'story-2-4.mp3',
    text: 'Mateo traces the words thousand-year journey. The Sanskrit word jya traveled to Arabic as jiba, was translated into Latin as sinus meaning a fold or bay, and finally became our English word: Sine.',
  },
  {
    file: 'story-2-5.mp3',
    text: 'Degrees are arbitrary human divisions. Kofi wraps the circles own radius along its curved rim. Walking exactly one radius marks one radian. Walking pi radians turns a perfect half-circle.',
  },
  {
    file: 'story-2-6.mp3',
    text: 'Theo links the unit circle directly to Pythagoras. Because the hypotenuse is always one, sine squared plus cosine squared must always equal one. We are ready to map the full circle!',
  },

  // --- LEVEL 3 STORY PANELS ---
  {
    file: 'story-3-1.mp3',
    text: 'At the Kerala school of mathematics, Mādhava discovered that sine and cosine could be computed to infinite decimal precision using infinite series, centuries before European calculus.',
  },
  {
    file: 'story-3-2.mp3',
    text: 'A ship navigates through dense fog between two distant lighthouses. The triangle formed with the coastline has no right angle. SOH-CAH-TOA alone cannot save them.',
  },
  {
    file: 'story-3-3.mp3',
    text: 'Kofi drops a vertical altitude down the center. By sharing a common height between two right triangles, the Law of Sines is revealed: every side divided by the sine of its opposite angle is perfectly equal.',
  },
  {
    file: 'story-3-4.mp3',
    text: 'When the angle between two known sides is not ninety degrees, Pythagoras needs an adjustment. The Law of Cosines applies a smooth correction term, handling any triangle in the universe.',
  },
  {
    file: 'story-3-5.mp3',
    text: 'Mei blends musical chords on an audio synthesizer. Combining two pure sine waves creates complex harmonics, governed by the compound angle formulas that power wireless communication.',
  },
  {
    file: 'story-3-6.mp3',
    text: 'Theo turns to you with his telescope gleaming: You have mastered shadows and conquered the unit circle. Now, prove your identities and build the world. Welcome, Sky Engineer!',
  },

  // --- WONDER HOOKS ---
  {
    file: 'wonder-level-1.mp3',
    text: 'Nobody can climb to the top of this pyramid with a measuring tape. Yet over twenty-five hundred years ago, a traveller calculated its exact height without leaving the ground. How?',
  },
  {
    file: 'wonder-level-2.mp3',
    text: 'Triangles only bend up to ninety degrees. But real waves and celestial bodies spin forever in complete loops. How can triangle ratios map an endless rotating circle?',
  },
  {
    file: 'wonder-level-3.mp3',
    text: 'Most real-world triangles in surveying and navigation have no right angle. What happens when right-angle trigonometry meets the real curved world?',
  },

  // --- MASCOT SOUND & FEEDBACK ---
  {
    file: 'correct.mp3',
    text: 'Brilliant! Your trigonometric calculation is spot on!',
  },
  {
    file: 'incorrect.mp3',
    text: 'Not quite. Check your ratios and give it another try!',
  },
  {
    file: 'boss-intro.mp3',
    text: 'Welcome to the Celestial Vault. Prove your mastery of shadows, the unit circle, and oblique triangles!',
  },
  {
    file: 'victory.mp3',
    text: 'Outstanding work, Sky Engineer! You have conquered the Trigonometry Vault!',
  },
  {
    file: 'fanfare.mp3',
    text: 'Triumph! You unlocked the secret of the celestial skies!',
  },
  {
    file: 'reflect.mp3',
    text: 'What a journey across the skies today! Can you explain why sine squared plus cosine squared always equals one?',
  },

  // --- STATIONS AUDIO ---
  {
    file: 'station_1A.mp3',
    text: 'The Shadow Lab. Discover how angle tilt controls the ratio of height to shadow.',
  },
  {
    file: 'station_1B.mp3',
    text: 'Side Namer and Ratio Builder. Master Hypotenuse, Opposite, and Adjacent relative to angle theta.',
  },
  {
    file: 'station_1C.mp3',
    text: 'Special Angle Forge. Derive exact radical values for thirty, forty-five, and sixty degrees without a calculator.',
  },
  {
    file: 'station_2A.mp3',
    text: 'The Unit Circle Explorer. Watch sine and cosine trace horizontal and vertical coordinates on the circle.',
  },
  {
    file: 'station_2B.mp3',
    text: 'Radian Ribbon Track. Wrap the circle radius along its rim to measure angles in radians.',
  },
  {
    file: 'station_2C.mp3',
    text: 'Pythagorean Identity Forge. Prove that sine squared plus cosine squared always equals one.',
  },
  {
    file: 'station_3A.mp3',
    text: 'Law of Sines Navigator. Solve oblique triangles when right angles disappear in the open sea.',
  },
  {
    file: 'station_3B.mp3',
    text: 'Law of Cosines Engineering. Adjust Pythagoras for triangles of any angle in the universe.',
  },
  {
    file: 'station_3C.mp3',
    text: 'Harmonic Wave Synthesizer. Blend sine waves to explore compound angle formulas that power wireless communication.',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAllAudio() {
  console.log(`Starting generation of ${AUDIO_ITEMS.length} ElevenLabs offline MP3 audio files...`);
  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < AUDIO_ITEMS.length; i++) {
    const item = AUDIO_ITEMS[i];
    const outPath = path.join(audioDir, item.file);

    // Skip if already generated and non-empty
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
      console.log(`[${i + 1}/${AUDIO_ITEMS.length}] Already exists: ${item.file} (${fs.statSync(outPath).size} bytes)`);
      skippedCount++;
      continue;
    }

    console.log(`[${i + 1}/${AUDIO_ITEMS.length}] Generating ${item.file}...`);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: item.text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`FAILED ${item.file} [${response.status}]: ${errText}`);
        failedCount++;
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(outPath, buffer);
      console.log(`✓ Saved ${item.file} (${buffer.length} bytes)`);
      successCount++;

      // Polite delay between API calls
      await sleep(350);
    } catch (err) {
      console.error(`ERROR generating ${item.file}:`, err.message);
      failedCount++;
    }
  }

  console.log('\n--- Generation Summary ---');
  console.log(`Successfully generated: ${successCount}`);
  console.log(`Previously existed: ${skippedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Total files in ${audioDir}: ${fs.readdirSync(audioDir).length}`);
}

generateAllAudio();
