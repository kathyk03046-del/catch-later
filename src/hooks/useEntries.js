import { useState, useEffect, useCallback } from 'react';
import {
  getPendingEntries,
  getDoneEntries,
  addEntry as dbAddEntry,
  markDone as dbMarkDone,
  deleteEntry as dbDeleteEntry,
} from '../services/db';

export function useEntries() {
  const [pendingEntries, setPendingEntries] = useState([]);
  const [doneEntries, setDoneEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [pending, done] = await Promise.all([
        getPendingEntries(),
        getDoneEntries(),
      ]);
      setPendingEntries(pending);
      setDoneEntries(done);
    } catch (err) {
      setError(err.message ?? 'Failed to load entries');
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  async function addEntry(entryData) {
    try {
      await dbAddEntry(entryData);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Failed to add entry');
    }
  }

  async function markDone(id) {
    try {
      await dbMarkDone(id);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Failed to mark done');
    }
  }

  async function deleteEntry(id) {
    try {
      await dbDeleteEntry(id);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Failed to delete entry');
    }
  }

  return { pendingEntries, doneEntries, addEntry, markDone, deleteEntry, loading, error };
}
