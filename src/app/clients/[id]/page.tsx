'use client';

import { useState, useEffect } from 'react';
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
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { ExportSummaryButton } from '@/components/ExportSummaryButton';

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

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityForm, setActivityForm] = useState({
    type: 'call',
    outcome: 'interested',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function fetchClient() {
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
    }
    fetchClient();
  }, [clientId]);

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

  const handleLogActivity = async () => {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          ...activityForm,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Activity logged successfully');
        setActivityModalOpen(false);
        // Refresh client data
        const clientRes = await fetch(`/api/clients/${clientId}`);
        const clientJson = await clientRes.json();
        if (clientJson.success) {
          setClient(clientJson.data);
        }
      }
    } catch {
      toast.error('Failed to log activity');
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
          <Dialog open={activityModalOpen} onOpenChange={setActivityModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Activity</DialogTitle>
                <DialogDescription>
                  Record an interaction with {client.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Activity Type</label>
                  <Select
                    value={activityForm.type}
                    onValueChange={(value) => setActivityForm({ ...activityForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Outcome</label>
                  <Select
                    value={activityForm.outcome}
                    onValueChange={(value) => setActivityForm({ ...activityForm, outcome: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="invested">Invested</SelectItem>
                      <SelectItem value="follow_up">Need Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    placeholder="Add notes about this interaction..."
                    value={activityForm.notes}
                    onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActivityModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLogActivity}>Save Activity</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                        <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">
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
                            <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
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
