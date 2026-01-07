import * as React from 'react';
import { cn } from '@/lib/utils';

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
