import { useState } from 'react';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import { useEntries } from '../../hooks/useEntries';
import { processTranscript } from '../../agent/processor';

export default function Capture() {
  const { isRecording, transcript, startRecording, stopRecording, clearTranscript, error: voiceError } = useVoiceCapture();
  const { addEntry } = useEntries();
  const [processing, setProcessing] = useState(false);
  const [flashError, setFlashError] = useState(null);

  async function handleStop() {
    stopRecording();
    if (!transcript.trim()) return;

    setProcessing(true);
    try {
      const result = await processTranscript(transcript);
      await addEntry({
        raw_transcript: transcript,
        summary: result.summary,
        action_type: result.action_type,
        next_action: result.next_action,
      });
      clearTranscript();
    } catch (err) {
      setFlashError('Something went wrong. Try again.');
      setTimeout(() => setFlashError(null), 3000);
    } finally {
      setProcessing(false);
    }
  }

  const buttonLabel = isRecording ? '■ Stop' : processing ? '...' : '● Record';

  return (
    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
      <button
        onMouseDown={startRecording}
        onMouseUp={handleStop}
        onTouchStart={startRecording}
        onTouchEnd={handleStop}
        disabled={processing || voiceError === 'not supported'}
        style={{
          fontSize: 24,
          padding: '24px 48px',
          borderRadius: 12,
          border: 'none',
          background: isRecording ? '#e53e3e' : '#2d3748',
          color: '#fff',
          cursor: processing ? 'default' : 'pointer',
          userSelect: 'none',
        }}
      >
        {buttonLabel}
      </button>

      {voiceError === 'not supported' && (
        <p style={{ color: '#e53e3e', marginTop: 12 }}>
          Voice capture is not supported in this browser.
        </p>
      )}

      {isRecording && transcript && (
        <p style={{ marginTop: 20, color: '#4a5568', fontStyle: 'italic' }}>
          {transcript}
        </p>
      )}

      {processing && (
        <p style={{ marginTop: 20, color: '#718096' }}>processing...</p>
      )}

      {flashError && (
        <p style={{ marginTop: 12, color: '#e53e3e' }}>{flashError}</p>
      )}
    </div>
  );
}
