import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export interface TTSCallbacks {
  onBoundary?: (wordIndex: number) => void;
  onEnd: () => void;
}

function getLangCode(language: string): string {
  switch (language) {
    case 'en': return 'en-US';
    case 'ms': return 'ms-MY';
    case 'id': return 'id-ID';
    case 'tl': return 'fil-PH';
    default: return 'en-US';
  }
}

async function speakNative(text: string, language: string, callbacks: TTSCallbacks) {
  const words = text.trim().split(/\s+/);
  const wordsPerMinute = 140; // approximate speech rate at 0.9x
  const msPerWord = (60 * 1000) / wordsPerMinute;

  // Start timer-based word highlighting
  let wordIndex = 0;
  const interval = setInterval(() => {
    if (wordIndex < words.length) {
      callbacks.onBoundary?.(wordIndex);
      wordIndex++;
    } else {
      clearInterval(interval);
    }
  }, msPerWord);

  try {
    await TextToSpeech.speak({
      text,
      lang: getLangCode(language),
      rate: 0.9,
    });
  } finally {
    clearInterval(interval);
    callbacks.onEnd();
  }
}

function speakWeb(text: string, language: string, callbacks: TTSCallbacks) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLangCode(language);
  utterance.rate = 0.9;

  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      const textBefore = text.substring(0, event.charIndex);
      const wordsBefore = textBefore.trim().split(/\s+/);
      const index = textBefore.trim() === '' ? 0 : wordsBefore.length;
      callbacks.onBoundary?.(index);
    }
  };

  utterance.onend = () => {
    callbacks.onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function speak(text: string, language: string, callbacks: TTSCallbacks) {
  if (Capacitor.isNativePlatform()) {
    speakNative(text, language, callbacks);
  } else {
    speakWeb(text, language, callbacks);
  }
}

export async function stopSpeaking() {
  if (Capacitor.isNativePlatform()) {
    await TextToSpeech.stop();
  } else {
    window.speechSynthesis.cancel();
  }
}
