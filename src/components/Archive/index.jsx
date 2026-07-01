import { useEntries } from '../../hooks/useEntries';

const badgeColor = { execute: '#c05621', keep: '#2b6cb0', unprocessed: '#718096' };

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Archive() {
  const { doneEntries, deleteEntry } = useEntries();

  if (doneEntries.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#718096', padding: 32 }}>
        nothing here yet
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px 16px' }}>
      {doneEntries.map((entry) => (
        <div
          key={entry.id}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 16,
            background: '#f7fafc',
            opacity: 0.85,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: '#fff',
                background: badgeColor[entry.action_type] ?? '#718096',
                borderRadius: 4,
                padding: '2px 6px',
                flexShrink: 0,
              }}
            >
              {entry.action_type}
            </span>
            <span style={{ fontSize: 15 }}>{entry.summary}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#a0aec0' }}>
              {entry.done_at ? formatDate(entry.done_at) : '—'}
            </span>
            <button
              onClick={() => deleteEntry(entry.id)}
              style={{
                fontSize: 13,
                padding: '4px 12px',
                border: 'none',
                borderRadius: 6,
                background: '#fff5f5',
                color: '#c53030',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
