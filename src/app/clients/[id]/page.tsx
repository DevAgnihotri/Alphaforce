'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Brain,
  Mic,
  Send,
  Copy,
  Check,
  Download,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ExportSummaryButton } from '@/components/ExportSummaryButton';
import { ActivityLogger } from '@/components/ActivityLogger';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  income: number;
  risk_profile: 'low' | 'medium' | 'high';
  portfolio_value: number;
  total_investments: number;
  lifecycle_stage: string;
  last_contact: string;
  daysSinceContact: number;
  conversion_probability: number;
  interests: string[];
  preferred_contact: string;
  activities: {
    id: string;
    type: string;
    date: string;
    outcome: string;
    notes: string;
  }[];
  portfolio: {
    investment_id: string;
    investment_name: string;
    investment_type: string;
    amount_invested: number;
    current_value: number;
    performance: number;
  }[];
  opportunities: {
    id: string;
    investment_type: string;
    amount: number;
    probability: number;
    status: string;
  }[];
}

interface Prediction {
  investment_id: string;
  investment_name: string;
  confidence: number;
  reason: string;
}

interface AIResponse {
  type: string;
  clientId: string;
  clientName: string;
  response: string;
  generatedAt: string;
}

const callPurposeOptions = [
  { value: 'follow_up', label: 'Follow-up & Relationship Building' },
  { value: 'portfolio_review', label: 'Portfolio Review' },
  { value: 'new_opportunity', label: 'Present New Opportunity' },
  { value: 'rebalancing', label: 'Portfolio Rebalancing Discussion' },
  { value: 'concern_address', label: 'Address Concerns' },
  { value: 'milestone', label: 'Celebrate Milestone' },
  { value: 'reengagement', label: 'Re-engagement Call' },
];

const emailPurposeOptions = [
  { value: 'check_in', label: 'General Check-in' },
  { value: 'portfolio_update', label: 'Portfolio Performance Update' },
  { value: 'new_opportunity', label: 'New Investment Opportunity' },
  { value: 'meeting_request', label: 'Meeting Request' },
  { value: 'follow_up', label: 'Follow-up After Call' },
  { value: 'market_update', label: 'Market Update & Insights' },
  { value: 'thank_you', label: 'Thank You / Appreciation' },
  { value: 'reengagement', label: 'Re-engagement' },
];

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Insights state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [callPurpose, setCallPurpose] = useState('follow_up');
  const [emailPurpose, setEmailPurpose] = useState('check_in');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const json = await res.json();
      if (json.success) {
        setClient(json.data);
      } else {
        setError('Client not found');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const fetchPredictions = async () => {
    setPredictionsLoading(true);
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId }),
      });
      const json = await res.json();
      if (json.success) {
        setPredictions(json.data.recommendations);
        toast.success('Predictions refreshed successfully');
      }
    } catch {
      toast.error('Failed to generate predictions');
    } finally {
      setPredictionsLoading(false);
    }
  };

  // AI Insight generation function
  const generateAIInsight = async (type: 'opportunity_insight' | 'call_script' | 'email_draft') => {
    if (!client) return;
    
    setAiLoading(true);
    setAiResponse(null);
    
    try {
      const res = await fetch('/api/alphadesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          clientId: client.id,
          context: {
            callPurpose: type === 'call_script' ? callPurpose : undefined,
            emailPurpose: type === 'email_draft' ? emailPurpose : undefined,
            additionalNotes,
          },
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.data);
        toast.success('AI insight generated successfully');
      }
    } catch {
      toast.error('Failed to generate AI insight');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAI = async () => {
    if (aiResponse?.response) {
      await navigator.clipboard.writeText(aiResponse.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    }
  };

  const handleDownloadAI = () => {
    if (aiResponse?.response && client) {
      const blob = new Blob([aiResponse.response], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${client.name.replace(' ', '-')}-${aiResponse.type}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Generate talking points based on client data
  const getTalkingPoints = (client: ClientDetail) => {
    const points: string[] = [];
    
    if (client.daysSinceContact > 7) {
      points.push(`Follow up on previous conversation from ${client.last_contact}`);
    }
    
    if (client.interests.includes('technology')) {
      points.push('Discuss recent tech sector performance and growth opportunities');
    }
    
    if (client.risk_profile === 'high') {
      points.push('Review high-growth investment options matching risk appetite');
    } else if (client.risk_profile === 'low') {
      points.push('Focus on stable, fixed-income options for capital preservation');
    }
    
    if (client.portfolio.length > 0) {
      const topPerformer = client.portfolio.reduce((a, b) => 
        a.performance > b.performance ? a : b
      );
      points.push(`Highlight strong performance of ${topPerformer.investment_name} (+${topPerformer.performance}%)`);
    }
    
    if (client.conversion_probability > 70) {
      points.push('Present specific investment proposal - high conversion likelihood');
    }
    
    if (client.interests.includes('dividends') || client.interests.includes('income')) {
      points.push('Discuss dividend-paying investments for regular income');
    }

    return points.length > 0 ? points : ['Schedule introductory portfolio review', 'Discuss investment goals and timeline', 'Assess risk tolerance and preferences'];
  };

  if (loading) {
    return (
      <div>
        <Header title="Client Details" subtitle="Loading..." />
        <div className="p-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div>
        <Header title="Client Details" subtitle="Error" />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Client not found'}</AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link href="/clients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const talkingPoints = getTalkingPoints(client);

  return (
    <div>
      <Header title={client.name} subtitle="Client Summary" />
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button variant="outline" asChild>
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Link>
        </Button>

        {/* Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black">{client.name}</h2>
                  <div className="flex items-center gap-4 text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getRiskBadgeVariant(client.risk_profile)} className="text-sm">
                  {client.risk_profile} risk
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  {client.lifecycle_stage}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={
                    client.daysSinceContact > 14 
                      ? 'bg-red-100 text-red-700 border-red-200' 
                      : client.daysSinceContact > 7 
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : 'bg-green-100 text-green-700 border-green-200'
                  }
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {client.daysSinceContact} days since contact
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Portfolio Value</p>
                  <p className="text-xl font-bold">{formatCurrency(client.portfolio_value)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Investments</p>
                  <p className="text-xl font-bold">{client.total_investments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversion Probability</p>
                  <p className="text-xl font-bold">{client.conversion_probability}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual Income</p>
                  <p className="text-xl font-bold">{formatCurrency(client.income)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <ActivityLogger
            clientId={client.id}
            clientName={client.name}
            onActivityLogged={fetchClient}
          />

          <Button variant="outline" onClick={fetchPredictions} disabled={predictionsLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${predictionsLoading ? 'animate-spin' : ''}`} />
            Generate Predictions
          </Button>

          <ExportSummaryButton 
            client={{
              id: client.id,
              name: client.name,
              email: client.email,
              phone: client.phone,
              age: client.age,
              income: client.income,
              risk_profile: client.risk_profile,
              portfolio_value: client.portfolio_value,
              total_investments: client.total_investments,
              conversion_probability: client.conversion_probability,
              interests: client.interests,
              last_contact: client.last_contact,
              daysSinceContact: client.daysSinceContact,
              lifecycle_stage: client.lifecycle_stage,
              activities: client.activities,
              portfolio: client.portfolio,
            }}
            predictions={predictions}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-insights" className="gap-1">
              <Brain className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Talking Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Talking Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {talkingPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Client Interests */}
              <Card>
                <CardHeader>
                  <CardTitle>Interests & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Investment Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {client.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Preferred Contact Method</p>
                    <Badge variant="outline" className="capitalize">
                      {client.preferred_contact}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Age</p>
                    <span className="text-black font-medium">{client.age} years old</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No activities recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      client.activities.slice(0, 5).map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.date}</TableCell>
                          <TableCell className="capitalize">{activity.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                activity.outcome === 'interested'
                                  ? 'border-green-500 text-green-600'
                                  : activity.outcome === 'invested'
                                  ? 'bg-green-50 border-green-600 text-green-700'
                                  : activity.outcome === 'not_interested'
                                  ? 'border-red-500 text-red-600'
                                  : 'border-yellow-500 text-yellow-600'
                              }
                            >
                              {activity.outcome.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500">{activity.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-4">
            {/* AI Hero */}
            <Card className="bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AlphaDesk AI for {client.name}</h3>
                    <p className="text-white/80 text-sm">Generate personalized insights, call scripts, and emails</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Powered by Ollama
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Generation Options */}
              <div className="space-y-4">
                {/* Opportunity Insight Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      Quick Opportunity Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Get AI-powered analysis on the best investment opportunities for this client based on their profile.
                    </p>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => generateAIInsight('opportunity_insight')}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles className="h-4 w-4" /> Generate Insight</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Call Script Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mic className="h-5 w-5 text-blue-500" />
                      Call Script Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Call Purpose</Label>
                      <Select value={callPurpose} onValueChange={setCallPurpose}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {callPurposeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => generateAIInsight('call_script')}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                      ) : (
                        <><Phone className="h-4 w-4" /> Generate Call Script</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Email Draft Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Send className="h-5 w-5 text-green-500" />
                      Email Draft Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Purpose</Label>
                      <Select value={emailPurpose} onValueChange={setEmailPurpose}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emailPurposeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => generateAIInsight('email_draft')}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Drafting...</>
                      ) : (
                        <><Mail className="h-4 w-4" /> Generate Email Draft</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Additional Notes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Additional Context</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add any specific context, recent conversations, or notes..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - AI Response */}
              <div>
                {aiLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">AI is thinking...</h3>
                      <p className="text-gray-500">Generating personalized content for {client.name}</p>
                    </CardContent>
                  </Card>
                )}

                {!aiLoading && !aiResponse && (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Generate</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Select an option on the left to generate AI-powered content tailored for {client.name}.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {!aiLoading && aiResponse && (
                  <Card className="border-2 border-purple-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-purple-700">
                          <Sparkles className="h-5 w-5" />
                          {aiResponse.type === 'opportunity_insight' ? 'Opportunity Insight' :
                           aiResponse.type === 'call_script' ? 'Call Script' : 'Email Draft'}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleCopyAI} className="gap-1">
                            {copied ? (
                              <><Check className="h-4 w-4 text-green-600" /> Copied!</>
                            ) : (
                              <><Copy className="h-4 w-4" /> Copy</>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleDownloadAI} className="gap-1">
                            <Download className="h-4 w-4" /> Download
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Generated at {new Date(aiResponse.generatedAt).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 max-h-125 overflow-y-auto">
                        <ReactMarkdown>{aiResponse.response}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Client Quick Stats for AI */}
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Client Profile Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Risk Profile</span>
                        <Badge variant="outline" className={
                          client.risk_profile === 'high' ? 'border-red-500 text-red-600' :
                          client.risk_profile === 'medium' ? 'border-yellow-500 text-yellow-600' :
                          'border-green-500 text-green-600'
                        }>
                          {client.risk_profile}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Conversion</span>
                        <span className="font-medium">{client.conversion_probability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Portfolio</span>
                        <span className="font-medium">{formatCurrency(client.portfolio_value)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Days Inactive</span>
                        <span className={`font-medium ${client.daysSinceContact > 14 ? 'text-red-600' : ''}`}>
                          {client.daysSinceContact}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Interests: </span>
                        <span className="font-medium capitalize">{client.interests.join(', ')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Current Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount Invested</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.portfolio.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No investments in portfolio
                        </TableCell>
                      </TableRow>
                    ) : (
                      client.portfolio.map((holding, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{holding.investment_name}</TableCell>
                          <TableCell className="capitalize">{holding.investment_type.replace('_', ' ')}</TableCell>
                          <TableCell>{formatCurrency(holding.amount_invested)}</TableCell>
                          <TableCell>{formatCurrency(holding.current_value)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                holding.performance > 10
                                  ? 'bg-green-50 border-green-500 text-green-600'
                                  : holding.performance > 0
                                  ? 'border-green-500 text-green-600'
                                  : 'border-red-500 text-red-600'
                              }
                            >
                              {holding.performance > 0 ? '+' : ''}{holding.performance}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>All Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No activities recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      client.activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.date}</TableCell>
                          <TableCell className="capitalize">{activity.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                activity.outcome === 'interested'
                                  ? 'border-green-500 text-green-600'
                                  : activity.outcome === 'invested'
                                  ? 'bg-green-50 border-green-600 text-green-700'
                                  : activity.outcome === 'not_interested'
                                  ? 'border-red-500 text-red-600'
                                  : 'border-yellow-500 text-yellow-600'
                              }
                            >
                              {activity.outcome.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500">{activity.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ML Investment Recommendations</CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchPredictions} disabled={predictionsLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${predictionsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {predictions.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No predictions generated yet</p>
                    <Button onClick={fetchPredictions} disabled={predictionsLoading}>
                      Generate Predictions
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predictions.map((prediction, index) => (
                      <div
                        key={prediction.investment_id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </span>
                            <h4 className="font-semibold text-black">{prediction.investment_name}</h4>
                          </div>
                          <Badge
                            className={
                              prediction.confidence > 70
                                ? 'bg-green-600'
                                : prediction.confidence > 50
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                            }
                          >
                            {prediction.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-gray-600 ml-11">{prediction.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
