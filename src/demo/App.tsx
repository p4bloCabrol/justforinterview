import { useState } from 'react';

// Demo: una sección por componente. Agregá la tuya cuando el componente pase su DoD.
const COMPONENTS = [
  'Button', 'TextField', 'Switch', 'Tabs', 'Accordion',
  'Modal', 'Tooltip', 'Toast', 'Combobox', 'VirtualList',
] as const;

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="jfi-root" data-theme={theme} style={{ minHeight: '100vh', background: 'var(--bg)', padding: 'var(--space-8)' }}>
      <header className="jfi-row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0, font: '600 32px/36px var(--font-sans)', letterSpacing: '-0.02em' }}>JustForInterviews DS</h1>
        {/* Reemplazalo por tu <Switch> cuando lo tengas */}
        <button type="button" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
          Tema: {theme}
        </button>
      </header>
      <ol className="jfi-stack" style={{ paddingLeft: 'var(--space-4)', color: 'var(--text-muted)' }}>
        {COMPONENTS.map(name => (
          <li key={name}>{name} — pendiente</li>
        ))}
      </ol>
    </div>
  );
}
