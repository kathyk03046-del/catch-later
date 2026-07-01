import { useState, useEffect } from 'react';
import { useEntries } from '../../hooks/useEntries';

const badgeColor = { execute: '#c05621', keep: '#2b6cb0', unprocessed: '#718096' };

export default function Buffer() {
  const { pendingEntries, markDone, deleteEntry } = useEntries();
  const [order, setOrder] = useState([]);

  useEffect(() => {
    setOrder(pendingEntries.map((e) => e.id));
  }, [pendingEntries]);

  const entryMap = Object.fromEntries(pendingEntries.map((e) => [e.id, e]));
  const visible = order.filter((id) => entryMap[id]);

  function handleSkip(id) {
    setOrder((prev) => {
      const next = prev.filter((x) => x !== id);
      next.push(id);
      return next;
    });
  }

  if (pendingEntries.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#718096', padding: 32 }}>
        all clear
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px 16px' }}>
      {visible.map((id) => {
        const entry = entryMap[id];
        return (
          <div
            key={id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 16,
              background: '#fff',
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

            {entry.next_action && (
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#4a5568' }}>
                → {entry.next_action}
              </p>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => markDone(id)} style={btnStyle('#276749', '#fff')}>Done</button>
              <button onClick={() => handleSkip(id)} style={btnStyle('#e2e8f0', '#2d3748')}>Skip</button>
              <button onClick={() => deleteEntry(id)} style={btnStyle('#fff5f5', '#c53030')}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    fontSize: 13,
    padding: '4px 12px',
    border: 'none',
    borderRadius: 6,
    background: bg,
    color,
    cursor: 'pointer',
  };
}
