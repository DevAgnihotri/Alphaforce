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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Loader2, Sparkles, Send } from 'lucide-react';

interface EmailComposerProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
  onEmailSent?: () => void;
  trigger?: React.ReactNode;
  // Context for AI-generated emails
  context?: {
    riskProfile?: string;
    portfolioValue?: number;
    investments?: string[];
    lastContact?: string;
    lifecycleStage?: string;
    conversionProbability?: number;
  };
}

export function EmailComposer({
  clientId,
  clientName,
  clientEmail,
  onEmailSent,
  trigger,
  context,
}: EmailComposerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    to: clientEmail,
    subject: '',
    body: '',
  });

  const resetForm = () => {
    setForm({
      to: clientEmail,
      subject: '',
      body: '',
    });
  };

  const handleGenerateWithAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a professional follow-up email to ${clientName}`,
          type: 'email_draft',
          context: {
            clientName,
            ...context,
          },
        }),
      });

      const json = await res.json();
      
      if (json.success) {
        // Parse subject from AI response if it includes "Subject:"
        const response = json.data.response;
        const subjectMatch = response.match(/Subject:\s*(.+?)(?:\n|$)/i);
        
        if (subjectMatch) {
          setForm({
            ...form,
            subject: subjectMatch[1].trim(),
            body: response.replace(/Subject:\s*.+?\n\n?/i, '').trim(),
          });
        } else {
          setForm({
            ...form,
            subject: `Following Up - ${clientName}`,
            body: response,
          });
        }
        
        if (json.demo) {
          toast.info('AI Demo Mode - Start Ollama for live AI generation');
        } else {
          toast.success('Email draft generated with AI!');
        }
      } else {
        toast.error(json.error || 'Failed to generate email');
      }
    } catch {
      toast.error('Failed to connect to AI service');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!form.to || !form.subject || !form.body) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: form.to,
          subject: form.subject,
          body: form.body,
          clientName,
          clientId,
        }),
      });

      const json = await res.json();
      
      if (json.success) {
        // Also log this as an activity
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            type: 'email',
            outcome: 'follow_up',
            notes: `Email sent: "${form.subject}"`,
            date: new Date().toISOString().split('T')[0],
          }),
        });

        if (json.demo) {
          toast.success('Email logged (Demo mode - configure SMTP for real sending)');
        } else {
          toast.success('Email sent successfully!');
        }
        
        resetForm();
        setOpen(false);
        onEmailSent?.();
      } else {
        toast.error(json.error || 'Failed to send email');
      }
    } catch {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Compose Email to {clientName}
          </DialogTitle>
          <DialogDescription>
            Send a personalized email to your client. Use AI to generate a draft!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* AI Generate Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-dashed border-2 hover:border-purple-400 hover:bg-purple-50"
            onClick={handleGenerateWithAI}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-purple-600" />
            )}
            {aiLoading ? 'Generating with AI...' : 'Generate Email with AI'}
          </Button>

          {/* To */}
          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              placeholder="client@email.com"
            />
          </div>

          {/* Subject */}
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Enter email subject..."
            />
          </div>

          {/* Body */}
          <div className="grid gap-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write your email message..."
              rows={8}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={loading || !form.to || !form.subject || !form.body}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
