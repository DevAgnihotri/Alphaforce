'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sparkles,
  Brain,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Target,
  ArrowRight,
  Users,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface OllamaStatus {
  status: 'connected' | 'disconnected' | 'error';
  ollama: boolean;
  model: string;
  modelAvailable: boolean;
  hasExactModel?: boolean;
  ollamaVersion?: string | null;
  message: string;
  availableModels?: string[];
}

interface SalesforceOpportunity {
  id: string;
  client_id: string;
  clientName: string;
  investment_type: string;
  amount: number;
  predicted_fit: number;
  probability: number;
  status: 'open' | 'won' | 'lost';
  created_date: string;
}

interface OpportunitySummary {
  total: number;
  open: number;
  won: number;
  lost: number;
  totalValue: number;
  avgProbability: number;
}

export default function AlphaDeskPage() {
  const [opportunities, setOpportunities] = useState<SalesforceOpportunity[]>([]);
  const [summary, setSummary] = useState<OpportunitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [checkingOllama, setCheckingOllama] = useState(true);

  const checkOllamaStatus = async () => {
    setCheckingOllama(true);
    try {
      const res = await fetch('/api/alphadesk/status');
      const data = await res.json();
      setOllamaStatus(data);
    } catch {
      setOllamaStatus({
        status: 'disconnected',
        ollama: false,
        model: 'unknown',
        modelAvailable: false,
        message: 'Failed to check Ollama status',
      });
    } finally {
      setCheckingOllama(false);
    }
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alphadesk/opportunities');
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data.opportunities);
        setSummary(data.data.summary);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    checkOllamaStatus();
  }, []);

  return (
    <div>
      <Header title="AlphaDesk" subtitle="Powered by DeepSeek AI" />
      
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <Card className="bg-linear-to-br from-purple-900 via-indigo-600 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">AlphaDesk AI</h2>
                <p className="text-white/80">
                  View Salesforce opportunities and access AI insights from each client&apos;s profile page
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        className={`cursor-pointer transition-colors ${
                          checkingOllama 
                            ? 'bg-white/20 text-white hover:bg-white/30' 
                            : ollamaStatus?.status === 'connected' && ollamaStatus?.modelAvailable
                              ? 'bg-green-500/80 text-white hover:bg-green-500'
                              : ollamaStatus?.status === 'connected'
                                ? 'bg-yellow-500/80 text-white hover:bg-yellow-500'
                                : 'bg-red-500/80 text-white hover:bg-red-500'
                        }`}
                        onClick={checkOllamaStatus}
                      >
                        {checkingOllama ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : ollamaStatus?.status === 'connected' && ollamaStatus?.modelAvailable ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : ollamaStatus?.status === 'connected' ? (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {checkingOllama 
                          ? 'Checking...' 
                          : ollamaStatus?.status === 'connected' && ollamaStatus?.modelAvailable
                            ? 'Ollama Active'
                            : ollamaStatus?.status === 'connected'
                              ? 'Model Missing'
                              : 'Ollama Offline'
                        }
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="text-sm">
                        <p className="font-semibold mb-1">
                          {ollamaStatus?.status === 'connected' ? '✅ Connected' : '❌ Disconnected'}
                        </p>
                        <p className="text-muted-foreground">{ollamaStatus?.message}</p>
                        {ollamaStatus?.ollamaVersion && (
                          <p className="mt-1 text-xs">Ollama v{ollamaStatus.ollamaVersion}</p>
                        )}
                        {ollamaStatus?.status === 'connected' && (
                          <p className="text-xs">
                            Model: <span className={ollamaStatus.modelAvailable ? 'text-green-600' : 'text-red-500'}>
                              {ollamaStatus.model} {ollamaStatus.modelAvailable ? '✓' : '✗'}
                            </span>
                          </p>
                        )}
                        {ollamaStatus?.status === 'disconnected' && (
                          <p className="mt-1 text-xs font-mono bg-muted p-1 rounded">ollama serve</p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">Click to refresh</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button asChild variant="secondary">
                  <Link href="/clients">
                    <Users className="h-4 w-4 mr-2" />
                    View Clients
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ollama Status Alert - Show when offline or model missing */}
        {!checkingOllama && ollamaStatus && (ollamaStatus.status === 'disconnected' || !ollamaStatus.modelAvailable) && (
          <Card className={`border ${ollamaStatus.status === 'disconnected' ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {ollamaStatus.status === 'disconnected' ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <div className="flex-1">
                  <p className={ollamaStatus.status === 'disconnected' ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'}>
                    <span className="font-semibold">
                      {ollamaStatus.status === 'disconnected' ? 'Ollama Not Running: ' : 'DeepSeek Model Missing: '}
                    </span>
                    {ollamaStatus.status === 'disconnected' 
                      ? 'AI features require Ollama. Start it with: '
                      : 'Install the required model with: '
                    }
                    <code className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded font-mono text-sm">
                      {ollamaStatus.status === 'disconnected' ? 'ollama serve' : `ollama pull ${ollamaStatus.model}`}
                    </code>
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={checkOllamaStatus}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Recheck
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <p className="text-purple-800">
                <span className="font-semibold">Tip:</span> Click on any client to access their profile and use AI-powered features like Call Script Generator, Email Drafts, and Opportunity Insights.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Opportunities</p>
                    <p className="text-2xl font-bold">{summary.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold">${summary.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Probability</p>
                    <p className="text-2xl font-bold">{summary.avgProbability}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Open Opportunities</p>
                    <p className="text-2xl font-bold">{summary.open}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Opportunities Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Salesforce Opportunities</CardTitle>
                <CardDescription>Investment opportunities available for clients</CardDescription>
              </div>
              <Button variant="outline" onClick={fetchOpportunities} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Investment Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Fit Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No opportunities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    opportunities.map((opp) => (
                      <TableRow key={opp.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{opp.clientName}</TableCell>
                        <TableCell>{opp.investment_type}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${opp.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              opp.probability > 70
                                ? 'border-green-500 text-green-600'
                                : opp.probability > 50
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-gray-500 text-gray-600'
                            }
                          >
                            {opp.probability}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{opp.predicted_fit}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              opp.status === 'open'
                                ? 'bg-blue-100 text-blue-700'
                                : opp.status === 'won'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {opp.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {new Date(opp.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/clients/${opp.client_id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
