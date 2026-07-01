import Dexie from 'dexie';

export const db = new Dexie('pocket');

db.version(1).stores({
  entries: 'id, created_at, action_type, status, done_at',
});

export async function addEntry(entryData) {
  const entry = {
    ...entryData,
    id: crypto.randomUUID(),
    created_at: Date.now(),
    status: 'pending',
    done_at: null,
  };
  await db.entries.add(entry);
  return entry;
}

export async function getPendingEntries() {
  return db.entries
    .where('status')
    .equals('pending')
    .reverse()
    .sortBy('created_at');
}

export async function getDoneEntries() {
  return db.entries
    .where('status')
    .equals('done')
    .reverse()
    .sortBy('done_at');
}

export async function markDone(id) {
  await db.entries.update(id, { status: 'done', done_at: Date.now() });
}

export async function deleteEntry(id) {
  await db.entries.delete(id);
}
