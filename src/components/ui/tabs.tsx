'use client';
import * as React from 'react';

type Tab = { id: string; label: string; content: React.ReactNode };

export function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = React.useState<string>(defaultTab ?? tabs[0]?.id);

  return (
    <div className="grid gap-3">
      <div className="flex border-b border-white/15">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`px-3 py-2 text-sm -mb-px border-b-2 transition-colors ${active === t.id ? 'border-white text-white' : 'border-transparent text-white/70 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.map(t => (
          <div key={t.id} className={active === t.id ? 'block' : 'hidden'}>
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
