'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  FileText,
  ExternalLink,
  Eye,
  Copy,
  Star,
  StarOff,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ClientActionsProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
  onLogActivity?: (type: 'call' | 'email' | 'meeting') => void;
  onQuickView?: () => void;
  onEmailCompose?: () => void;
  onAIInsights?: () => void;
}

export function ClientActions({
  clientId,
  clientName,
  clientEmail,
  onLogActivity,
  onQuickView,
  onEmailCompose,
  onAIInsights,
}: ClientActionsProps) {
  const [starred, setStarred] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(clientEmail);
    toast.success('Email copied to clipboard');
  };

  const toggleStar = () => {
    setStarred(!starred);
    toast.success(starred ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{clientName}</p>
            <p className="text-xs leading-none text-muted-foreground">{clientEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Quick View */}
        <DropdownMenuItem onClick={onQuickView}>
          <Eye className="mr-2 h-4 w-4" />
          Quick View
          <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/clients/${clientId}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Full Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Log Activity Sub-menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Clock className="mr-2 h-4 w-4" />
            Log Activity
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onLogActivity?.('call')}>
                <Phone className="mr-2 h-4 w-4 text-green-600" />
                Log Call
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogActivity?.('email')}>
                <Mail className="mr-2 h-4 w-4 text-blue-600" />
                Log Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogActivity?.('meeting')}>
                <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                Log Meeting
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Communication */}
        <DropdownMenuItem onClick={onEmailCompose}>
          <Mail className="mr-2 h-4 w-4" />
          Compose Email
        </DropdownMenuItem>

        <DropdownMenuItem onClick={copyEmail}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Email
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* AI & Analysis */}
        <DropdownMenuItem onClick={onAIInsights}>
          <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
          AI Insights
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/clients/${clientId}#predictions`}>
            <TrendingUp className="mr-2 h-4 w-4" />
            View Predictions
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/clients/${clientId}#portfolio`}>
            <FileText className="mr-2 h-4 w-4" />
            View Portfolio
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Favorite */}
        <DropdownMenuItem onClick={toggleStar}>
          {starred ? (
            <>
              <StarOff className="mr-2 h-4 w-4 text-yellow-500" />
              Remove from Favorites
            </>
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" />
              Add to Favorites
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
