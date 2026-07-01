import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Capture from './components/Capture';
import Buffer from './components/Buffer';
import Archive from './components/Archive';
import { useEntries } from './hooks/useEntries';

function Nav() {
  const { pendingEntries } = useEntries();
  const count = pendingEntries.length;
  const location = useLocation();

  return (
    <nav style={{
      display: 'flex',
      background: 'transparent',
      flexShrink: 0,
    }}>
      {[
        { to: '/', label: 'Capture' },
        { to: '/buffer', label: 'Buffer', count },
        { to: '/archive', label: 'Archive' },
      ].map(({ to, label, count: c }) => {
        const isActive = to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '10px 0',
              textDecoration: 'none',
              fontSize: 13,
              letterSpacing: '-0.01em',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.15s ease',
            }}
          >
            {label}
            {c != null && c > 0 && (
              <span style={{
                fontSize: 11,
                color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
              }}>
                {c}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function FocusOnMount() {
  useEffect(() => {
    window.focus();
  }, []);
  return null;
}

function EscHandler() {
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === 'Escape') {
        if (window.__TAURI__) {
          const { invoke } = await import('@tauri-apps/api/core');
          invoke('hide_window');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <FocusOnMount />
      <EscHandler />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        width: 'calc(100vw - 20px)',
        height: 'calc(100vh - 20px)',
        borderRadius: '22px',
        overflow: 'hidden',
        overflowY: 'hidden',
        background: '#1C1C1E',
        fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
      }}>
        <Nav />
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Capture />} />
            <Route path="/buffer" element={<Buffer />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
