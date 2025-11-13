'use client';
import * as React from 'react';

export function Modal({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode; actions?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-black/80 p-5">
        {title && <div className="text-lg font-semibold mb-2">{title}</div>}
        <div className="text-sm opacity-90">{children}</div>
        {actions && <div className="mt-4 flex gap-2 justify-end">{actions}</div>}
      </div>
    </div>
  );
}
