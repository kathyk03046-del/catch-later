import { useEntries } from '../../hooks/useEntries';

export default function Buffer() {
  const { pendingEntries, markDone, deleteEntry } = useEntries();

  const sorted = [...pendingEntries].sort((a, b) => {
    const typeOrder = { execute: 0, keep: 1, unprocessed: 2 };
    const byType = (typeOrder[a.action_type] ?? 2) - (typeOrder[b.action_type] ?? 2);
    return byType !== 0 ? byType : b.created_at - a.created_at;
  });

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
          Buffer
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          {pendingEntries.length} {pendingEntries.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Entry list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {sorted.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.25)' }}>
              all clear
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)' }}>
              nothing pending
            </span>
          </div>
        ) : (
          sorted.map((entry, i) => (
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
                  color: entry.action_type === 'execute' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.01em',
                }}>
                  {entry.action_type === 'execute' ? entry.next_action : entry.summary}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
                flexShrink: 0,
              }}>
                <button
                  onClick={() => markDone(entry.id)}
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 100,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Done
                </button>
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
