import { Capacitor } from '@capacitor/core';
import { SpeechRecognition as CapSpeechRecognition } from '@capacitor-community/speech-recognition';

export interface SpeechRecognitionCallbacks {
  onStart: () => void;
  onEnd: () => void;
  onError: () => void;
  onResult: (transcript: string) => void;
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

async function startNativeSpeechRecognition(language: string, callbacks: SpeechRecognitionCallbacks) {
  const { available } = await CapSpeechRecognition.available();
  if (!available) {
    alert('Speech recognition is not available on this device.');
    return;
  }

  const permResult = await CapSpeechRecognition.requestPermissions();
  if (permResult.speechRecognition !== 'granted') {
    alert('Microphone permission is required for voice input.');
    return;
  }

  callbacks.onStart();

  try {
    const result = await CapSpeechRecognition.start({
      language: getLangCode(language),
      popup: false,
      partialResults: false,
    });

    if (result.matches && result.matches.length > 0) {
      callbacks.onResult(result.matches[0]);
    }
  } catch {
    callbacks.onError();
  } finally {
    callbacks.onEnd();
  }
}

function startWebSpeechRecognition(language: string, callbacks: SpeechRecognitionCallbacks) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech recognition is not supported in your browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = getLangCode(language);
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => callbacks.onStart();
  recognition.onend = () => callbacks.onEnd();
  recognition.onerror = () => callbacks.onError();
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    callbacks.onResult(transcript);
  };

  recognition.start();
}

export function startSpeechRecognition(language: string, callbacks: SpeechRecognitionCallbacks) {
  if (Capacitor.isNativePlatform()) {
    startNativeSpeechRecognition(language, callbacks);
  } else {
    startWebSpeechRecognition(language, callbacks);
  }
}
