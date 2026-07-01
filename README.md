# Pocket

A thought buffer with voice capture. Speak a thought, let AI process it, review when you're free.

**Version:** 1.0.0-mvp  
**License:** MIT

---

## The Problem

Interesting thoughts surface at the worst times — mid-task, mid-video, mid-conversation. The cost of capturing them is context-switching. The cost of not capturing them is losing them.

Most note apps solve the wrong problem. They optimize for organization, not for the moment of capture.

---

## What Pocket Does

One tap to record. Claude processes the transcript into a structured entry. When you have time, open the buffer, decide what to do with each item, mark it done.

The core loop: **capture → process → review → clear.**

---

## Key Design Decisions

**Thought buffer, not note-taking app**  
Pocket has no folders, no tags, no search. It holds thoughts temporarily until you decide what to do with them. The end state is an empty buffer, not an organized archive.

**Two action types only**  
`execute` — there is a clear next action.  
`keep` — everything else: ideas, references, things to think about later.  
A third category (think vs. reference) was considered and rejected — both map to the same user behavior: leave it for later.

**Agent processes, user decides**  
The AI summarizes and classifies but does not act. Every entry requires a human decision: Done, Skip, or Delete. Removing this confirmation step would eliminate the cognitive value of the review session.

**Local storage, no backend**  
Data lives in IndexedDB. No account, no sync, no server. For a single-user thought buffer, this is sufficient. Cloud sync is a future decision, not an MVP requirement.

**Layered architecture**  

```
agent/      → Claude API only. No UI, no DB awareness.
services/   → IndexedDB only. No agent awareness.
hooks/      → Bridge between services and components.
components/ → UI only. No direct DB or API calls.
```

Each layer has one job. Changes in one layer do not propagate to others.

---

## Stack

- React + Vite
- Claude API (claude-sonnet-4-6) for transcript processing
- Dexie.js for IndexedDB
- Web Speech API for voice capture

---

## Running Locally

```bash
git clone https://github.com/kathyk03046-del/pocket-app
cd pocket-app
npm install
```

Create a `.env` file:

```
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```


```bash
npm run dev
```

Requires a Chromium-based browser for Web Speech API support.

---

## Status

MVP. Core loop is functional. Known limitations:

- Voice recognition accuracy degrades with mixed-language input
- No cross-device sync
- No export
