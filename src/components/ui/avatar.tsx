import * as React from 'react';

function initialsFrom(nameOrHandle?: string) {
  if (!nameOrHandle) return '?';
  const s = nameOrHandle.replace(/[^\p{L}\p{N} ]+/gu, ' ').trim();
  if (!s) return '?';
  const parts = s.split(/\s+/).slice(0, 2);
  const chars = parts.map(p => p[0]?.toUpperCase()).join('');
  return chars || s[0].toUpperCase();
}

export function Avatar({ name, size = 32, className = '' }: { name?: string; size?: number; className?: string }) {
  const text = initialsFrom(name);
  const style: React.CSSProperties = { width: size, height: size };
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-sm font-semibold ${className}`}
      style={style}
      aria-label={name}
      title={name}
    >
      {text}
    </div>
  );
}
