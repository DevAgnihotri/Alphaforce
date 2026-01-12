'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Phone, Mail, Users, Loader2 } from 'lucide-react';

interface ActivityLoggerProps {
  clientId: string;
  clientName: string;
  onActivityLogged?: () => void;
  trigger?: React.ReactNode;
  defaultType?: 'call' | 'email' | 'meeting';
}

const activityTypes = [
  { value: 'call', label: 'Phone Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Users },
];

const outcomeOptions = [
  { value: 'interested', label: 'Interested', color: 'text-green-600' },
  { value: 'not_interested', label: 'Not Interested', color: 'text-red-600' },
  { value: 'invested', label: 'Invested', color: 'text-blue-600' },
  { value: 'follow_up', label: 'Needs Follow-up', color: 'text-yellow-600' },
];

export function ActivityLogger({
  clientId,
  clientName,
  onActivityLogged,
  trigger,
  defaultType = 'call',
}: ActivityLoggerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: defaultType,
    outcome: 'interested',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setForm({
      type: defaultType,
      outcome: 'interested',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          type: form.type,
          outcome: form.outcome,
          notes: form.notes,
          date: form.date,
        }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success('Activity logged successfully', {
          description: `${form.type.charAt(0).toUpperCase() + form.type.slice(1)} with ${clientName} recorded.`,
        });
        setOpen(false);
        resetForm();
        onActivityLogged?.();
      } else {
        toast.error('Failed to log activity', {
          description: json.error || 'Please try again.',
        });
      }
    } catch {
      toast.error('Connection error', {
        description: 'Failed to connect to server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedType = activityTypes.find((t) => t.value === form.type);
  const TypeIcon = selectedType?.icon || Phone;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5" />
              Log New Activity
            </DialogTitle>
            <DialogDescription>
              Record an interaction with {clientName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Activity Type */}
            <div className="grid gap-2">
              <Label htmlFor="type">Activity Type</Label>
              <Select
                value={form.type}
                onValueChange={(value: 'call' | 'email' | 'meeting') => setForm({ ...form, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Outcome */}
            <div className="grid gap-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select
                value={form.outcome}
                onValueChange={(value: 'interested' | 'not_interested' | 'invested' | 'follow_up') => setForm({ ...form, outcome: value })}
              >
                <SelectTrigger id="outcome">
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  {outcomeOptions.map((outcome) => (
                    <SelectItem key={outcome.value} value={outcome.value}>
                      <span className={outcome.color}>{outcome.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this interaction..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Activity'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
