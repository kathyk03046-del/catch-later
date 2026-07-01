import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Capture from './components/Capture';
import Buffer from './components/Buffer';
import Archive from './components/Archive';

const navItems = [
  { to: '/', label: 'Capture' },
  { to: '/buffer', label: 'Buffer' },
  { to: '/archive', label: 'Archive' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', maxWidth: 480, margin: '0 auto' }}>
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
          <Routes>
            <Route path="/" element={<Capture />} />
            <Route path="/buffer" element={<Buffer />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>

        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            borderTop: '1px solid #e2e8f0',
            background: '#fff',
          }}
        >
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              style={({ isActive }) => ({
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                textDecoration: 'none',
                fontSize: 14,
                color: isActive ? '#2d3748' : '#a0aec0',
                fontWeight: isActive ? 700 : 400,
                borderTop: isActive ? '2px solid #2d3748' : '2px solid transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  );
}
