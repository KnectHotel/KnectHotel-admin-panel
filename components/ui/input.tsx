// import * as React from 'react';
// import { cn } from '@/lib/utils';

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   icon?: React.ReactNode;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, icon, ...props }, ref) => {
//     return (
//       <div className="relative w-full">
//         {icon && (
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
//             {icon}
//           </div>
//         )}
//         <input
//           type={type}
//           className={cn(
//             'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
//             icon ? 'pl-1' : '', // Add left padding if icon exists
//             className
//           )}
//           ref={ref}
//           {...props}
//         />
//       </div>
//     );
//   }
// );

// Input.displayName = 'Input';

// export { Input };

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

    // Normalize controlled vs uncontrolled input props to avoid
    // SSR/client mismatches when `value` is undefined.
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
      ...props
    };
    if (typeof value !== 'undefined') {
      inputProps.value = value as any;
    } else if (typeof defaultValue !== 'undefined') {
      inputProps.defaultValue = defaultValue as any;
    }

    // Prevent scrolling the input value (e.g., with mouse wheel)
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

    // Remove any stray `fdprocessedid` attributes that some browser
    // extensions may inject into inputs before React hydrates. Those
    // attributes can cause hydration mismatches because they don't
    // exist on the React-rendered element. Removing them on mount
    // makes the client DOM match React's expectations.
    React.useEffect(() => {
      const el = inputRef.current;
      if (!el) return;
      try {
        if (el.hasAttribute('fdprocessedid'))
          el.removeAttribute('fdprocessedid');
      } catch (e) {
        // ignore
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
              e.preventDefault(); // prevent arrow keys from changing value
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
          // Suppress hydration warnings for attributes that may be
          // injected/removed by browser extensions or other client-side
          // mutations that are outside our control.
          suppressHydrationWarning
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
