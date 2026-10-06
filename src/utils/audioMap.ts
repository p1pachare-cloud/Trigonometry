// src/utils/audioMap.ts
// Pre-generated ElevenLabs offline MP3 audio map for Trigonometry (Sky Surveyors)
export const AUDIO_MAP: Record<string, string> = {
  // Story Panels - Level 1
  'The Meridian Express rolls to a stop': '/audio/story-1-1.mp3',
  'As ancient stories tell, the philosopher Thales': '/audio/story-1-2.mp3',
  'Later in the afternoon, the sun dips': '/audio/story-1-3.mp3',
  'In Alexandria, Eratosthenes realized': '/audio/story-1-4.mp3',
  'Aboard the train, Mei names the three sacred ratios': '/audio/story-1-5.mp3',
  'Theo unlatches the brass clinometer': '/audio/story-1-6.mp3',

  // Story Panels - Level 2
  'In ancient India, the astronomer Aryabhata': '/audio/story-2-1.mp3',
  'Calculating ratios for different planetary spheres': '/audio/story-2-2.mp3',
  'Ira watches the rotating beam sweep': '/audio/story-2-3.mp3',
  'Mateo traces the words thousand-year journey': '/audio/story-2-4.mp3',
  'Degrees are arbitrary human divisions': '/audio/story-2-5.mp3',
  'Theo links the unit circle directly to Pythagoras': '/audio/story-2-6.mp3',

  // Story Panels - Level 3
  'At the Kerala school of mathematics': '/audio/story-3-1.mp3',
  'A ship navigates through dense fog': '/audio/story-3-2.mp3',
  'Kofi drops a vertical altitude': '/audio/story-3-3.mp3',
  'When the angle between two known sides': '/audio/story-3-4.mp3',
  'Mei blends musical chords on an audio synthesizer': '/audio/story-3-5.mp3',
  'Theo turns to you with his telescope gleaming': '/audio/story-3-6.mp3',

  // Wonder Hooks
  'Nobody can climb to the top of this pyramid': '/audio/wonder-level-1.mp3',
  'Triangles only bend up to ninety degrees': '/audio/wonder-level-2.mp3',
  'Most real-world triangles in surveying': '/audio/wonder-level-3.mp3',

  // Mascot and Feedback
  'Brilliant! Your trigonometric calculation': '/audio/correct.mp3',
  'Not quite. Check your ratios': '/audio/incorrect.mp3',
  'Welcome to the Celestial Vault': '/audio/boss-intro.mp3',
  'Outstanding work, Sky Engineer': '/audio/victory.mp3',
  'Triumph! You unlocked the secret': '/audio/fanfare.mp3',
  'What a journey across the skies today': '/audio/reflect.mp3',

  // Station Intros
  'The Shadow Lab': '/audio/station_1A.mp3',
  'Side Namer and Ratio Builder': '/audio/station_1B.mp3',
  'Special Angle Forge': '/audio/station_1C.mp3',
  'The Unit Circle Explorer': '/audio/station_2A.mp3',
  'Radian Ribbon Track': '/audio/station_2B.mp3',
  'Pythagorean Identity Forge': '/audio/station_2C.mp3',
  'Law of Sines Navigator': '/audio/station_3A.mp3',
  'Law of Cosines Engineering': '/audio/station_3B.mp3',
  'Harmonic Wave Synthesizer': '/audio/station_3C.mp3',
};

/**
 * Returns the pre-generated offline MP3 audio path if matching text is found
 */
export function getStaticAudioUrl(text: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const [key, path] of Object.entries(AUDIO_MAP)) {
    if (lower.includes(key.toLowerCase())) {
      return path;
    }
  }
  return null;
}
