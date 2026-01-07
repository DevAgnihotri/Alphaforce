'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  TrendingUp,
  MessageSquare,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { EmailComposer } from './EmailComposer';
import { AIInsights } from './AIInsights';
import { ActivityLogger } from './ActivityLogger';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  risk_profile: string;
  portfolio_value: number;
  conversion_probability: number;
  lifecycle_stage: string;
  last_contact: string;
  daysSinceContact: number;
  interests: string[];
}

interface ClientQuickViewProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete?: () => void;
}

export function ClientQuickView({ 
  client, 
  open, 
  onOpenChange,
  onActionComplete 
}: ClientQuickViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!client) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">{client.name}</SheetTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/clients/${client.id}`}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Full Profile
              </Link>
            </Button>
          </div>
          <SheetDescription className="flex items-center gap-2 flex-wrap">
            <Badge className={getRiskColor(client.risk_profile)}>
              {client.risk_profile} risk
            </Badge>
            <Badge variant="outline" className="capitalize">
              {client.lifecycle_stage}
            </Badge>
            <Badge variant="outline" className={
              client.daysSinceContact > 14 ? 'border-red-300 text-red-600' :
              client.daysSinceContact > 7 ? 'border-yellow-300 text-yellow-600' :
              'border-green-300 text-green-600'
            }>
              {client.daysSinceContact}d ago
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <DollarSign className="h-4 w-4" />
              Portfolio
            </div>
            <p className="text-lg font-semibold mt-1 dark:text-white">
              {formatCurrency(client.portfolio_value)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <TrendingUp className="h-4 w-4" />
              Conversion
            </div>
            <p className="text-lg font-semibold mt-1 dark:text-white">
              {client.conversion_probability}%
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4" />
            {client.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="h-4 w-4" />
            {client.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            Last contact: {client.last_contact}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <ActivityLogger
              clientId={client.id}
              clientName={client.name}
              defaultType="call"
              onActivityLogged={() => {
                onActionComplete?.();
              }}
              trigger={
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Phone className="h-4 w-4 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Log Call</div>
                    <div className="text-xs text-gray-500">Record interaction</div>
                  </div>
                </Button>
              }
            />
            <EmailComposer
              clientId={client.id}
              clientName={client.name}
              clientEmail={client.email}
              onEmailSent={() => {
                onActionComplete?.();
              }}
              context={{
                riskProfile: client.risk_profile,
                portfolioValue: client.portfolio_value,
                conversionProbability: client.conversion_probability,
              }}
              trigger={
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Send Email</div>
                    <div className="text-xs text-gray-500">AI-assisted</div>
                  </div>
                </Button>
              }
            />
            <AIInsights
              clientId={client.id}
              clientName={client.name}
              context={{
                riskProfile: client.risk_profile,
                portfolioValue: client.portfolio_value,
                conversionProbability: client.conversion_probability,
              }}
              trigger={
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">AI Insights</div>
                    <div className="text-xs text-gray-500">Get suggestions</div>
                  </div>
                </Button>
              }
            />
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" asChild>
              <Link href={`/clients/${client.id}`}>
                <FileText className="h-4 w-4 text-orange-600" />
                <div className="text-left">
                  <div className="font-medium">Full Profile</div>
                  <div className="text-xs text-gray-500">View details</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Interests */}
        {client.interests && client.interests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {client.interests.map((interest, i) => (
                <Badge key={i} variant="secondary" className="text-xs capitalize">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
