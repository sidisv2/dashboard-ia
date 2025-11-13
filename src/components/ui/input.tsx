import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className={`relative ${className}`}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full h-10 rounded-xl bg-transparent border border-white/20 px-3 text-sm outline-none placeholder:opacity-60 focus:border-white/40 ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
