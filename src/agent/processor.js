import { SYSTEM_PROMPT } from './prompt.js';

export async function processTranscript(transcript) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 256,
        temperature: 0,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: transcript }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    try {
      return JSON.parse(text);
    } catch {
      return {
        summary: transcript,
        action_type: 'unprocessed',
        next_action: null
      };
    }
  } catch {
    return {
      summary: transcript,
      action_type: 'unprocessed',
      next_action: null
    };
  }
}
