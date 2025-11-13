"use client";
import * as React from "react";

const KEY = "demo_actions_used";

export function useDemoLimit() {
  const max = Number(process.env.NEXT_PUBLIC_DEMO_MAX || 3);
  const [used, setUsed] = React.useState(0);
  const remaining = Math.max(0, max - used);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUsed(Number(raw) || 0);
    } catch {}
  }, []);

  const consume = React.useCallback((n = 1) => {
    setUsed((u) => {
      const next = u + n;
      try { localStorage.setItem(KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const reset = React.useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setUsed(0);
  }, []);

  return { max, used, remaining, consume, reset };
}
