'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Loader2, Lightbulb, MessageSquare, TrendingUp, FileText, Copy, Check } from 'lucide-react';
import { notifyAIInsight } from '@/lib/notifications';

interface AIInsightsProps {
  clientId: string;
  clientName: string;
  context?: {
    riskProfile?: string;
    portfolioValue?: number;
    investments?: string[];
    lastContact?: string;
    lifecycleStage?: string;
    conversionProbability?: number;
  };
  trigger?: React.ReactNode;
}

type InsightType = 'talking_points' | 'client_insights' | 'investment_advice';

const insightTypes = [
  { 
    value: 'talking_points' as InsightType, 
    label: 'Talking Points', 
    icon: MessageSquare,
    description: 'Generate conversation starters for your next call'
  },
  { 
    value: 'client_insights' as InsightType, 
    label: 'Client Analysis', 
    icon: Lightbulb,
    description: 'Get AI-powered insights about this client'
  },
  { 
    value: 'investment_advice' as InsightType, 
    label: 'Investment Ideas', 
    icon: TrendingUp,
    description: 'Personalized investment recommendations'
  },
];

export function AIInsights({
  clientName,
  context,
  trigger,
}: AIInsightsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insightType, setInsightType] = useState<InsightType>('talking_points');
  const [response, setResponse] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: getPromptForType(insightType, clientName),
          type: insightType,
          context: {
            clientName,
            ...context,
          },
        }),
      });

      const json = await res.json();
      
      if (json.success) {
        setResponse(json.data.response);
        setIsDemo(json.demo || false);
        
        // Add notification for AI insight
        const typeLabel = insightTypes.find(t => t.value === insightType)?.label || 'Insights';
        notifyAIInsight(`${typeLabel} generated for ${clientName}`);
        
        if (json.demo) {
          toast.info('AI Demo Mode - Start Ollama for live AI generation');
        }
      } else {
        toast.error(json.error || 'Failed to generate insights');
      }
    } catch {
      toast.error('Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPromptForType = (type: InsightType, name: string): string => {
    switch (type) {
      case 'talking_points':
        return `Generate personalized talking points for my next call with ${name}`;
      case 'client_insights':
        return `Analyze the client profile and provide strategic insights for ${name}`;
      case 'investment_advice':
        return `Suggest investment opportunities suitable for ${name} based on their profile`;
      default:
        return `Provide insights for ${name}`;
    }
  };

  const selectedType = insightTypes.find(t => t.value === insightType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI Insights
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-175 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Insights for {clientName}
          </DialogTitle>
          <DialogDescription>
            Generate AI-powered insights, talking points, and recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
          {/* Insight Type Selector */}
          <div className="grid gap-2">
            <Label>What would you like to generate?</Label>
            <Select
              value={insightType}
              onValueChange={(value: InsightType) => {
                setInsightType(value);
                setResponse(null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {insightTypes.map((type) => {
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
            {selectedType && (
              <p className="text-sm text-gray-500">{selectedType.description}</p>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="gap-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? 'Generating...' : 'Generate with AI'}
          </Button>

          {/* Response Display */}
          {response && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Generated Content</span>
                  {isDemo && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Demo Mode
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-4 border">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            </div>
          )}

          {/* Context Info */}
          {context && Object.keys(context).length > 0 && !response && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Available Context for AI:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                {context.riskProfile && (
                  <div>Risk: {context.riskProfile}</div>
                )}
                {context.portfolioValue && (
                  <div>Portfolio: ${context.portfolioValue.toLocaleString()}</div>
                )}
                {context.lifecycleStage && (
                  <div>Stage: {context.lifecycleStage}</div>
                )}
                {context.conversionProbability && (
                  <div>Conversion: {context.conversionProbability}%</div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
