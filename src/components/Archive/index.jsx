import { useEntries } from '../../hooks/useEntries';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Archive() {
  const { doneEntries, deleteEntry } = useEntries();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '16px 24px 10px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
          Archive
        </span>
      </div>

      {/* Entry list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {doneEntries.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>
              nothing here yet
            </span>
          </div>
        ) : (
          doneEntries.map((entry, i) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '14px 8px',
                borderTop: i === 0 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
                borderBottom: '0.5px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 9,
                  color: entry.action_type === 'execute' ? '#8ECBA8' : 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  {entry.action_type}
                </div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.01em',
                }}>
                  {entry.summary}
                </div>
                {entry.done_at && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', marginTop: 4 }}>
                    {formatDate(entry.done_at)}
                  </div>
                )}
              </div>

              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start' }}>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.18)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
