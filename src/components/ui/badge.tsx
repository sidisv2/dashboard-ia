import * as React from 'react';

type Variant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';

const variants: Record<Variant, string> = {
  default: 'bg-white text-black',
  secondary: 'bg-white/10 text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-black',
  destructive: 'bg-red-500 text-white',
  outline: 'border border-white/20 text-white',
};

export function Badge({ className = '', variant = 'secondary', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
