import { useState, useRef } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function useVoiceCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(
    SpeechRecognition ? null : 'not supported'
  );
  const recognitionRef = useRef(null);

  function startRecording() {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let full = '';
      for (const result of event.results) {
        full += result[0].transcript;
      }
      setTranscript(full);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      setError(event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopRecording() {
    recognitionRef.current?.stop();
  }

  function clearTranscript() {
    setTranscript('');
  }

  return { isRecording, transcript, startRecording, stopRecording, clearTranscript, error };
}
