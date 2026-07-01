import { SYSTEM_PROMPT } from './prompt.js';

/**
 * @typedef {{ summary: string, action_type: 'execute'|'keep'|'unprocessed', next_action: string|null }} ProcessedEntry
 */

/** @returns {ProcessedEntry} */
function fallback(transcript) {
  return { summary: transcript, action_type: 'unprocessed', next_action: null };
}

/** @param {string} transcript @returns {Promise<ProcessedEntry>} */
export async function processTranscript(transcript) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: transcript }],
      }),
    });

    if (!response.ok) return fallback(transcript);

    const data = await response.json();
    const text = data?.content?.[0]?.text;
    if (!text) return fallback(transcript);

    const parsed = JSON.parse(text);
    if (!parsed.summary || !parsed.action_type) return fallback(transcript);

    return {
      summary: parsed.summary,
      action_type: parsed.action_type,
      next_action: parsed.next_action ?? null,
    };
  } catch {
    return fallback(transcript);
  }
}
