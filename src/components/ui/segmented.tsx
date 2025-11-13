'use client';
import * as React from 'react';

type Option = { label: string; value: string };

type SegmentedProps = {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

export function Segmented({ options, value, onChange, className = '' }: SegmentedProps) {
  return (
    <div className={`inline-flex items-center rounded-xl border border-white/20 p-0.5 bg-white/5 ${className}`} role="tablist">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`px-3 h-9 text-sm rounded-lg transition-colors ${active ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default Segmented;
