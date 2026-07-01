# catch-later

A thought buffer for macOS. When something worth remembering surfaces mid-task — hold Space, say it, get back to what you were doing. Review when you're free.

**Platform:** macOS · **Model:** GPT-4o + Whisper · **License:** MIT

---

## The problem

Interesting thoughts surface at the worst times. The cost of capturing them is context-switching. The cost of not capturing them is losing them.

Most note apps solve the wrong problem. They optimize for organization, not for the moment of capture.

---

## How it works

`Cmd+Shift+M` — window appears, wherever you are
`Hold Space` — speak your thought
`Release` — Whisper transcribes, GPT-4o processes it into a structured entry
`Esc` — window disappears, you're back

When you're free, open Buffer. Every entry has a decision: Done or Delete. The end state is an empty buffer, not an organized archive.

---

## Key decisions

**Two action types only**
`execute` — there is a clear next action.
`keep` — everything else: ideas, references, things to think about later.

**Agent processes, user decides**
AI summarizes and classifies. Every entry still requires a human decision. Automation that bypasses judgment is a design failure, not a feature.

**Local only**
Data lives in IndexedDB. No account, no sync, no server. Your thoughts stay on your machine.

---

## Install

The fastest way — send your coding agent this repo and say **"install this"**:

```
https://github.com/kathyk03046-del/catch-later
```

Your agent will handle Rust, Node, dependencies, and ask you for your OpenAI API key.

---

## Manual setup

**You'll need:**
- Node.js 18+
- Rust — [rustup.rs](https://rustup.rs)
- An OpenAI API key with credits — [platform.openai.com](https://platform.openai.com)

```bash
git clone https://github.com/kathyk03046-del/catch-later
cd catch-later
npm install
```

Create `.env`:

```
VITE_OPENAI_API_KEY=your_key_here
```

```bash
npx tauri dev
```

**One-time permission:**
System Settings → Privacy & Security → Accessibility → `+` → navigate to `src-tauri/target/debug/app` → toggle on.

This is required for the global shortcut to work from any app.

---

## Stack

React + Vite · Tauri 2 · OpenAI Whisper · OpenAI GPT-4o · Dexie.js

---

## Status

Dev mode. Core loop is functional. No packaged release yet.
