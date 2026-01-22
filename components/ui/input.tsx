



































'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, value, defaultValue, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    
    
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
      ...props
    };
    if (typeof value !== 'undefined') {
      inputProps.value = value as any;
    } else if (typeof defaultValue !== 'undefined') {
      inputProps.defaultValue = defaultValue as any;
    }

    
    React.useEffect(() => {
      const el = inputRef.current;
      if (!el) return;

      const preventScroll = (e: WheelEvent) => {
        if (document.activeElement === el) {
          e.preventDefault();
        }
      };

      el.addEventListener('wheel', preventScroll, { passive: false });
      return () => {
        el.removeEventListener('wheel', preventScroll);
      };
    }, []);

    
    
    
    
    
    React.useEffect(() => {
      const el = inputRef.current;
      if (!el) return;
      try {
        if (el.hasAttribute('fdprocessedid'))
          el.removeAttribute('fdprocessedid');
      } catch (e) {
        
      }
    }, []);

    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
            icon ? 'pl-1' : '',
            type === 'number' ? 'no-spinner' : '',
            className
          )}
          onKeyDown={(e) => {
            if (
              type === 'number' &&
              (e.key === 'ArrowUp' || e.key === 'ArrowDown')
            ) {
              e.preventDefault(); 
            }
          }}
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node;
          }}
          {...inputProps}
          
          
          
          suppressHydrationWarning
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
