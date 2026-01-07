'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(customShortcuts?: ShortcutAction[]) {
  const router = useRouter();

  const defaultShortcuts: ShortcutAction[] = [
    { key: 'k', ctrl: true, action: () => {
      // Trigger global search (Command palette)
      const event = new CustomEvent('open-command-palette');
      window.dispatchEvent(event);
    }, description: 'Open command palette' },
    { key: 'h', ctrl: true, action: () => router.push('/'), description: 'Go to Dashboard' },
    { key: 'c', ctrl: true, shift: true, action: () => router.push('/clients'), description: 'Go to Clients' },
    { key: 't', ctrl: true, shift: true, action: () => router.push('/tasks'), description: 'Go to Tasks' },
    { key: 'a', ctrl: true, shift: true, action: () => router.push('/analytics'), description: 'Go to Analytics' },
  ];

  const shortcuts = [...defaultShortcuts, ...(customShortcuts || [])];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement).isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

// Keyboard shortcuts help display
export function getShortcutDisplay(shortcut: ShortcutAction): string {
  const parts: string[] = [];
  if (shortcut.ctrl) parts.push('⌘');
  if (shortcut.shift) parts.push('⇧');
  if (shortcut.alt) parts.push('⌥');
  parts.push(shortcut.key.toUpperCase());
  return parts.join('');
}
