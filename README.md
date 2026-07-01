# catch-later

A voice-first thought buffer for macOS. Speak a thought, let AI process it, review when you're free.

**Platform:** macOS only  
**Mode:** Local dev — no binary release yet  
**License:** MIT

---

## The Problem

Interesting thoughts surface at the worst times — mid-task, mid-video, mid-conversation. The cost of capturing them is context-switching. The cost of not capturing them is losing them.

Most note apps solve the wrong problem. They optimize for organization, not for the moment of capture.

---

## What catch-later Does

Hold Space to record. GPT-4o processes the transcript into a structured entry. When you have time, open the buffer, decide what to do with each item, mark it done.

The core loop: **capture → process → review → clear.**

---

## Key Design Decisions

**Thought buffer, not note-taking app**  
catch-later has no folders, no tags, no search. It holds thoughts temporarily until you decide what to do with them. The end state is an empty buffer, not an organized archive.

**Two action types only**  
`execute` — there is a clear next action.  
`keep` — everything else: ideas, references, things to think about later.

**Agent processes, user decides**  
The AI summarizes and classifies but does not act. Every entry requires a human decision: Done or Delete.

**Local storage, no backend**  
Data lives in IndexedDB. No account, no sync, no server.

---

## Stack

- React + Vite + Tauri 2
- OpenAI Whisper (voice transcription)
- OpenAI GPT-4o (transcript processing)
- Dexie.js (IndexedDB)

---

## Running Locally

### Prerequisites

- Node.js 18+
- Rust + Cargo — install from [rustup.rs](https://rustup.rs)
- Xcode Command Line Tools (`xcode-select --install`)

### Setup

```bash
git clone https://github.com/kathyk03046-del/catch-later
cd catch-later
npm install
```

Create a `.env` file with your own OpenAI API key:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

Get a key at [platform.openai.com](https://platform.openai.com). The app uses Whisper and GPT-4o — make sure your account has credits.

```bash
npx tauri dev
```

### Accessibility Permission (required)

The global shortcut (`Cmd+Shift+M`) requires Accessibility access. After first launch:

1. Go to **System Settings → Privacy & Security → Accessibility**
2. Click `+` and navigate to `src-tauri/target/debug/app`
3. Add it and toggle it on

> Note: every time the app recompiles, macOS may revoke this permission. If the shortcut stops working, re-toggle it in Accessibility settings.

---

## Shortcuts

| Key | Action |
|-----|--------|
| `Cmd+Shift+M` | Show / hide the window (global, works from any app) |
| `Space` (hold) | Start recording |
| `Space` (release) | Stop recording and process |
| `Esc` | Hide the window |

---

## Troubleshooting

**Shortcut doesn't work from other apps**  
Check Accessibility permission (see above). After recompile, you may need to re-toggle it.

**"OpenAI quota exceeded — check billing"**  
Your API key is out of credits. Add credits at [platform.openai.com/settings/billing](https://platform.openai.com/settings/billing).

**Window appears behind Dock**  
Known issue in dev mode — Dock height is estimated. Will be fixed in packaged release.

---

## Status

Dev mode only. Core loop is functional.

Known limitations:
- Global shortcut requires manual Accessibility permission after each recompile
- No cross-device sync
- No export
- macOS only
