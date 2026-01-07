'use client';

import { useTheme } from './ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Sun className={cn(
        'h-4 w-4 transition-all duration-300',
        theme === 'dark' ? 'text-gray-500' : 'text-yellow-500'
      )} />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-gray-300"
        aria-label="Toggle dark mode"
      />
      <Moon className={cn(
        'h-4 w-4 transition-all duration-300',
        theme === 'dark' ? 'text-blue-400' : 'text-gray-400'
      )} />
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
    </div>
  );
}
