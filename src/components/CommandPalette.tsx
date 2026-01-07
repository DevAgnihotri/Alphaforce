'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Home,
  Users,
  ListTodo,
  BarChart3,
  Search,
  Moon,
  Sun,
  Mail,
  Phone,
  Sparkles,
  FileText,
  Settings,
  Keyboard,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Client {
  id: string;
  name: string;
  email: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Listen for custom event to open palette
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch clients for search
  const fetchClients = useCallback(async () => {
    if (clients.length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      const json = await res.json();
      if (json.success) {
        setClients(json.data);
      }
    } catch {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [clients.length]);

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open, fetchClients]);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search clients..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/clients'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Clients</span>
            <CommandShortcut>⌘⇧C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/tasks'))}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Tasks</span>
            <CommandShortcut>⌘⇧T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/analytics'))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
            <CommandShortcut>⌘⇧A</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(toggleTheme)}>
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            const event = new CustomEvent('open-keyboard-shortcuts');
            window.dispatchEvent(event);
          })}>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard Shortcuts</span>
            <CommandShortcut>?</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Clients */}
        <CommandGroup heading="Clients">
          {loading ? (
            <CommandItem disabled>
              <Search className="mr-2 h-4 w-4 animate-pulse" />
              <span>Loading clients...</span>
            </CommandItem>
          ) : (
            clients.slice(0, 5).map((client) => (
              <CommandItem
                key={client.id}
                value={client.name}
                onSelect={() => runCommand(() => router.push(`/clients/${client.id}`))}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>{client.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{client.email}</span>
              </CommandItem>
            ))
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* Tools */}
        <CommandGroup heading="Tools">
          <CommandItem onSelect={() => runCommand(() => {
            const event = new CustomEvent('open-email-composer');
            window.dispatchEvent(event);
          })}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Compose Email</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            const event = new CustomEvent('open-ai-insights');
            window.dispatchEvent(event);
          })}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Insights</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            const event = new CustomEvent('export-report');
            window.dispatchEvent(event);
          })}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Export Report</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
