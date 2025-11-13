import * as React from 'react';

type Variant = 'default' | 'outline';
type Size = 'sm' | 'md';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
const variants: Record<Variant, string> = {
  default: 'bg-white text-black hover:bg-white/90 ring-white/40 ring-offset-black',
  outline: 'border border-white/20 hover:bg-white/5 ring-white/20 ring-offset-black',
};
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

export function Button({ className = '', variant = 'outline', size = 'md', ...props }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  return <button className={cls} {...props} />;
}
