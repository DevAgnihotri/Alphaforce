'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
  { keys: ['⌘', 'H'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['⌘', '⇧', 'C'], description: 'Go to Clients', category: 'Navigation' },
  { keys: ['⌘', '⇧', 'T'], description: 'Go to Tasks', category: 'Navigation' },
  { keys: ['⌘', '⇧', 'A'], description: 'Go to Analytics', category: 'Navigation' },
  // Actions
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Help' },
  { keys: ['Esc'], description: 'Close dialog / modal', category: 'General' },
];

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-keyboard-shortcuts', handleOpen);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        // Check if not in an input
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-keyboard-shortcuts', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const categories = [...new Set(shortcuts.map(s => s.category))];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate quickly through AlphaForce
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                {category}
              </h4>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, j) => (
                          <Kbd key={j}>{key}</Kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
