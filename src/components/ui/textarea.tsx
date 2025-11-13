import * as React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', rows = 5, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full rounded-xl bg-transparent border border-white/20 p-3 text-sm outline-none placeholder:opacity-60 focus:border-white/40 ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
