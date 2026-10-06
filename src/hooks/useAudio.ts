// src/hooks/useAudio.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { getStaticAudioUrl } from '../utils/audioMap';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopNarration = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // Ignore
      }
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, [stopNarration]);

  const playAudioUrl = useCallback(
    (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        stopNarration();
        try {
          const audio = new Audio(url);
          audioRef.current = audio;
          setIsPlaying(true);

          audio.onended = () => {
            setIsPlaying(false);
            audioRef.current = null;
            resolve(true);
          };

          audio.onerror = () => {
            setIsPlaying(false);
            audioRef.current = null;
            resolve(false);
          };

          const p = audio.play();
          if (p !== undefined) {
            p.catch(() => {
              setIsPlaying(false);
              audioRef.current = null;
              resolve(false);
            });
          }
        } catch {
          setIsPlaying(false);
          resolve(false);
        }
      });
    },
    [stopNarration]
  );

  const narrateText = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/___/g, 'blank')
        .replace(/<[^>]*>/g, '')
        .trim();

      if (!cleanText) return false;

      // 1. Check pre-generated ElevenLabs offline MP3 audio map first!
      const staticUrl = getStaticAudioUrl(cleanText);
      if (staticUrl) {
        const ok = await playAudioUrl(staticUrl);
        if (ok) return true;
      }

      // 2. Native Offline Web Speech Synthesis fallback
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return new Promise((resolve) => {
          stopNarration();

          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const preferredVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Natural') ||
                  v.name.includes('Google') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Zira') ||
                  v.name.includes('Karen'))
            ) || voices.find((v) => v.lang.startsWith('en'));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          utterance.onend = () => {
            setIsPlaying(false);
            resolve(true);
          };

          utterance.onerror = () => {
            setIsPlaying(false);
            resolve(false);
          };

          setIsPlaying(true);
          window.speechSynthesis.speak(utterance);
        });
      }

      return false;
    },
    [playAudioUrl, stopNarration]
  );

  const narrate = useCallback(
    async (segments: string | string[], enabled = true) => {
      if (!enabled) return;
      if (typeof segments === 'string') {
        await narrateText(segments);
      } else if (Array.isArray(segments)) {
        for (const seg of segments) {
          if (seg) {
            const ok = await narrateText(seg);
            if (!ok) break;
          }
        }
      }
    },
    [narrateText]
  );

  return {
    isPlaying,
    narrate,
    playAudioUrl,
    stopNarration,
  };
}
