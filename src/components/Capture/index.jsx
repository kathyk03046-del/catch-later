import { useState, useEffect, useRef } from 'react';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import { useEntries } from '../../hooks/useEntries';
import { processTranscript } from '../../agent/processor';

const BAR_DELAYS = ['0s', '0.18s', '0.09s', '0.27s', '0.14s'];

export default function Capture() {
  const { isRecording, transcript, startRecording, stopRecording, clearTranscript, error: voiceError } = useVoiceCapture();
  const { addEntry } = useEntries();
  const [processing, setProcessing] = useState(false);
  const spaceDownRef = useRef(false);

  const animDuration = isRecording ? '2.8s' : '5.5s';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        e.stopPropagation();
        if (!spaceDownRef.current && !processing) {
          spaceDownRef.current = true;
          startRecording();
        }
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        if (spaceDownRef.current) {
          spaceDownRef.current = false;
          handleStop();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [processing, startRecording]);

  async function handleStop() {
    if (!isRecording) return;
    setProcessing(true);
    try {
      const text = await stopRecording();
      if (!text.trim()) return;
      const result = await processTranscript(text);
      await addEntry({
        raw_transcript: text,
        summary: result.summary,
        action_type: result.action_type,
        next_action: result.next_action,
      });
      clearTranscript();
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div
      onMouseDown={startRecording}
      onMouseUp={handleStop}
      onTouchStart={startRecording}
      onTouchEnd={handleStop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Glow layers — centered via absolute + transform */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(238,234,222,0.18) 0%, rgba(200,196,186,0.06) 45%, transparent 68%)',
        filter: 'blur(36px)',
        '--breath-lo': isRecording ? '0.55' : '0.38',
        '--breath-hi': isRecording ? '0.85' : '0.55',
        animation: `${isRecording ? 'breatheFast' : 'breathe'} ${animDuration} ease-in-out infinite`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 130,
        height: 130,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(252,248,238,0.22) 0%, transparent 75%)',
        filter: 'blur(18px)',
        '--breath-lo': isRecording ? '0.40' : '0.22',
        '--breath-hi': isRecording ? '0.65' : '0.38',
        animation: `${isRecording ? 'breatheFast' : 'breathe'} ${animDuration} ease-in-out infinite`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,253,246,0.45) 0%, transparent 80%)',
        filter: 'blur(6px)',
        '--breath-lo': isRecording ? '0.50' : '0.35',
        '--breath-hi': isRecording ? '0.80' : '0.55',
        animation: `${isRecording ? 'breatheFast' : 'breathe'} ${animDuration} ease-in-out infinite`,
        pointerEvents: 'none',
      }} />

      {/* Waveform bars — recording only */}
      {isRecording && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          pointerEvents: 'none',
        }}>
          {BAR_DELAYS.map((delay, i) => (
            <div key={i} style={{
              width: 2.5,
              height: 16,
              borderRadius: 2,
              background: 'rgba(255,252,245,0.85)',
              transformOrigin: 'center',
              animation: `barBounce ${0.55 + i * 0.07}s ease-in-out ${delay} infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Idle state */}
      {!isRecording && !processing && (
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}>
          {voiceError && voiceError !== 'not supported' ? (
            <span style={{
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(255,100,100,0.7)',
              textAlign: 'center',
              letterSpacing: '-0.01em',
            }}>
              {voiceError}
            </span>
          ) : (
            <>
              <span style={{
                fontSize: 14,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.01em',
              }}>
                {voiceError === 'not supported' ? 'voice not supported' : "what's on your mind"}
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 16,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '-0.01em',
              }}>
                hold{' '}
                <span style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  padding: '2px 9px',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.6,
                }}>
                  space
                </span>
                {' '}to capture
              </span>
            </>
          )}
        </div>
      )}

      {/* Processing state */}
      {processing && (
        <span style={{
          position: 'absolute',
          bottom: 28,
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.15em',
          textTransform: 'lowercase',
          animation: 'processingPulse 1.8s ease-in-out infinite',
          pointerEvents: 'none',
        }}>
          processing
        </span>
      )}
    </div>
  );
}
