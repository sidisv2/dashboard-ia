'use client';
import * as React from 'react';

type Toast = { id: number; title: string; variant?: 'default' | 'success' | 'error' };

type ToastContextValue = {
  show: (title: string, variant?: Toast['variant']) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const show = React.useCallback((title: string, variant: Toast['variant'] = 'default') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 right-4 z-50 grid gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-4 py-2 text-sm shadow ${
              t.variant === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                : t.variant === 'error'
                ? 'border-red-500/40 bg-red-500/15 text-red-200'
                : 'border-white/20 bg-white/10 text-white'
            }`}
          >
            {t.title}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
