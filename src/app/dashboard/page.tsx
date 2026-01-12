'use client';

import { Header } from '@/components/Header';
import { SalesforceSync } from '@/components/SalesforceSync';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip as UITooltip,
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
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  AlertTriangle,
  Clock,
  UserX,
  ArrowRight,
  BarChart3,
  Activity,
  Eye,
  Info,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  CheckCircle2,
  TrendingUp as TrendingUpIcon,
  Star,
  Award,
  Sparkles,
  Heart,
  ThumbsUp,
  Gift,
  Zap,
  Trophy,
  PartyPopper,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';
import { clients as salesforceClients, activities as salesforceActivities } from '@/data/mockData';

// Helper function to calculate days since last contact
const calculateDaysSince = (dateStr: string): number => {
  const today = new Date('2026-01-12'); // Current date
  const lastContact = new Date(dateStr);
  const diffTime = today.getTime() - lastContact.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Alert detail interfaces
interface AlertClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
  daysInactive: number;
  portfolioValue: number;
  riskProfile: 'low' | 'medium' | 'high';
}

// ============ DERIVED DATA FROM SALESFORCE MOCK DATA ============

// Urgent Follow-ups: clients not contacted in 14+ days (from Salesforce data)
const urgentFollowupClients: AlertClient[] = salesforceClients
  .filter(client => calculateDaysSince(client.last_contact) >= 14)
  .map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    lastContact: client.last_contact,
    daysInactive: calculateDaysSince(client.last_contact),
    portfolioValue: client.portfolio_value,
    riskProfile: client.risk_profile,
  }))
  .sort((a, b) => b.daysInactive - a.daysInactive);

// Inactive Clients: not contacted in 30+ days (from Salesforce data)
const inactiveClients: AlertClient[] = salesforceClients
  .filter(client => calculateDaysSince(client.last_contact) >= 30)
  .map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    lastContact: client.last_contact,
    daysInactive: calculateDaysSince(client.last_contact),
    portfolioValue: client.portfolio_value,
    riskProfile: client.risk_profile,
  }))
  .sort((a, b) => b.daysInactive - a.daysInactive);

// High-Risk Portfolio Clients (from Salesforce data)
const highRiskClients: AlertClient[] = salesforceClients
  .filter(client => client.risk_profile === 'high')
  .map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    lastContact: client.last_contact,
    daysInactive: calculateDaysSince(client.last_contact),
    portfolioValue: client.portfolio_value,
    riskProfile: client.risk_profile,
  }));

// ============ POSITIVE DATA - Healthy & Top Performing Clients ============

interface HealthyClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
  daysSinceContact: number;
  portfolioValue: number;
  portfolioGrowth: number;
  riskProfile: 'low' | 'medium' | 'high';
  satisfaction: number;
  investmentsCount: number;
}

interface TopPerformer {
  id: string;
  name: string;
  email: string;
  portfolioValue: number;
  ytdReturn: number;
  totalGains: number;
  investmentTypes: string[];
  clientSince: string;
}

interface RecentSuccess {
  id: string;
  clientName: string;
  clientId: string;
  type: 'new_investment' | 'goal_reached' | 'referral' | 'portfolio_milestone';
  description: string;
  amount?: number;
  date: string;
}

// Healthy & Engaged Clients: recently contacted (within 14 days) with good conversion probability
// Using actual Salesforce mock data
const healthyClients: HealthyClient[] = salesforceClients
  .filter(client => calculateDaysSince(client.last_contact) <= 14 && client.conversion_probability >= 75)
  .map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    lastContact: client.last_contact,
    daysSinceContact: calculateDaysSince(client.last_contact),
    portfolioValue: client.portfolio_value,
    portfolioGrowth: Math.round((client.conversion_probability / 5) * 10) / 10, // Derived growth metric
    riskProfile: client.risk_profile,
    satisfaction: client.conversion_probability,
    investmentsCount: client.total_investments,
  }))
  .sort((a, b) => a.daysSinceContact - b.daysSinceContact);

// Top Performing Clients: highest portfolio values (from Salesforce data)
const topPerformers: TopPerformer[] = salesforceClients
  .filter(client => client.lifecycle_stage === 'customer')
  .sort((a, b) => b.portfolio_value - a.portfolio_value)
  .slice(0, 8)
  .map((client, index) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    portfolioValue: client.portfolio_value,
    ytdReturn: Math.round((15 + (client.conversion_probability / 10)) * 10) / 10, // Derived YTD return
    totalGains: Math.round(client.portfolio_value * 0.15), // Estimated gains
    investmentTypes: client.interests.slice(0, 3).map(i => i.charAt(0).toUpperCase() + i.slice(1)),
    // Deterministic date based on index to avoid hydration mismatch
    clientSince: `202${index % 4}-${String((index % 12) + 1).padStart(2, '0')}-15`,
  }));

// Recent Successes & Milestones - derived from recent activities in Salesforce data
const recentSuccesses: RecentSuccess[] = salesforceActivities
  .filter(act => act.outcome === 'invested' || act.outcome === 'interested')
  .slice(0, 8)
  .map((act, index) => {
    const client = salesforceClients.find(c => c.id === act.client_id);
    const successTypes: ('new_investment' | 'goal_reached' | 'referral' | 'portfolio_milestone')[] = 
      ['new_investment', 'goal_reached', 'referral', 'portfolio_milestone'];
    return {
      id: `success_${String(index + 1).padStart(3, '0')}`,
      clientName: client?.name || 'Unknown Client',
      clientId: act.client_id,
      type: successTypes[index % 4],
      description: act.notes,
      amount: client ? Math.round(client.portfolio_value * 0.1) : undefined,
      date: act.date,
    };
  });

interface DashboardData {
  metrics: {
    totalClients: number;
    activeOpportunities: number;
    conversionRate: number;
    avgPortfolioValue: number;
    totalAUM: number;
  };
  recentActivities: {
    id: string;
    client_id: string;
    clientName: string;
    type: string;
    date: string;
    outcome: string;
    notes: string;
  }[];
  topOpportunities: {
    id: string;
    client_id: string;
    clientName: string;
    investment_type: string;
    amount: number;
    probability: number;
  }[];
  alerts: {
    inactiveClients: number;
    highRiskClients: number;
    urgentFollowups: number;
  };
  monthlyPerformance: {
    month: string;
    aum: number;
  }[];
  lifecycleDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  riskDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard-stats');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Overview of your performance" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Overview of your performance" />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div>
      <Header title="Dashboard" subtitle="Overview of your performance" />
      
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div data-tour="metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Total Clients</p>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>All leads and accounts in your portfolio</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-2xl font-bold text-black">{data.metrics.totalClients}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Active Opportunities</p>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open investment opportunities being pursued</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-2xl font-bold text-black">{data.metrics.activeOpportunities}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of leads converted to customers</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-2xl font-bold text-black">{data.metrics.conversionRate}%</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">Total AUM</p>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Assets Under Management - total portfolio value</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-2xl font-bold text-black">{formatCurrency(data.metrics.totalAUM)}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(data.alerts.inactiveClients > 0 || data.alerts.urgentFollowups > 0 || data.alerts.highRiskClients > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Urgent Follow-ups Dialog */}
            {data.alerts.urgentFollowups > 0 && (
              <Dialog>
                <Alert className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Clock className="h-4 w-4 mt-0.5 text-yellow-600" />
                    <div>
                      <AlertTitle className="text-yellow-800">Urgent Follow-ups</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        {data.alerts.urgentFollowups} clients haven&apos;t been contacted in 14+ days
                      </AlertDescription>
                    </div>
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 shrink-0">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                </Alert>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-yellow-700">
                      <Clock className="h-5 w-5" />
                      Urgent Follow-ups
                    </DialogTitle>
                    <DialogDescription>
                      Clients who haven&apos;t been contacted in 14+ days. Consider reaching out soon to maintain engagement.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-auto flex-1 -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Days Inactive</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Portfolio Value</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {urgentFollowupClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-gray-500">{client.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={client.daysInactive > 30 ? "destructive" : "secondary"}>
                                {client.daysInactive} days
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{client.lastContact}</TableCell>
                            <TableCell className="font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.portfolioValue)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                client.riskProfile === 'high' ? 'border-red-500 text-red-600' :
                                client.riskProfile === 'medium' ? 'border-yellow-500 text-yellow-600' :
                                'border-green-500 text-green-600'
                              }>
                                {client.riskProfile}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Call">
                                  <Phone className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Email">
                                  <Mail className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Profile">
                                  <Link href={`/clients/${client.id}`}>
                                    <ExternalLink className="h-4 w-4 text-gray-600" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Inactive Clients Dialog */}
            {data.alerts.inactiveClients > 0 && (
              <Dialog>
                <Alert className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <UserX className="h-4 w-4 mt-0.5 text-red-600" />
                    <div>
                      <AlertTitle className="text-red-800">Inactive Clients</AlertTitle>
                      <AlertDescription className="text-red-700">
                        {data.alerts.inactiveClients} clients inactive for 30+ days
                      </AlertDescription>
                    </div>
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 shrink-0">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                </Alert>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-700">
                      <UserX className="h-5 w-5" />
                      Inactive Clients
                    </DialogTitle>
                    <DialogDescription>
                      Clients with no activity for 30+ days. These accounts may be at risk of churning.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-auto flex-1 -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Days Inactive</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Portfolio Value</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inactiveClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-gray-500">{client.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">
                                {client.daysInactive} days
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{client.lastContact}</TableCell>
                            <TableCell className="font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.portfolioValue)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                client.riskProfile === 'high' ? 'border-red-500 text-red-600' :
                                client.riskProfile === 'medium' ? 'border-yellow-500 text-yellow-600' :
                                'border-green-500 text-green-600'
                              }>
                                {client.riskProfile}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Call">
                                  <Phone className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Email">
                                  <Mail className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Schedule Meeting">
                                  <Calendar className="h-4 w-4 text-purple-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Profile">
                                  <Link href={`/clients/${client.id}`}>
                                    <ExternalLink className="h-4 w-4 text-gray-600" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* High-Risk Portfolios Dialog */}
            {data.alerts.highRiskClients > 0 && (
              <Dialog>
                <Alert className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-600" />
                    <div>
                      <AlertTitle className="text-orange-800">High-Risk Portfolios</AlertTitle>
                      <AlertDescription className="text-orange-700">
                        {data.alerts.highRiskClients} clients with high-risk profiles
                      </AlertDescription>
                    </div>
                  </div>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 shrink-0">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                </Alert>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                      High-Risk Portfolios
                    </DialogTitle>
                    <DialogDescription>
                      Clients with aggressive investment profiles. Monitor closely for market volatility impact.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-auto flex-1 -mx-6 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-orange-700">Total High-Risk AUM</p>
                          <p className="text-2xl font-bold text-orange-800">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                              highRiskClients.reduce((sum, c) => sum + c.portfolioValue, 0)
                            )}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4">
                          <p className="text-sm text-orange-700">Avg Portfolio Size</p>
                          <p className="text-2xl font-bold text-orange-800">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                              highRiskClients.reduce((sum, c) => sum + c.portfolioValue, 0) / highRiskClients.length
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Portfolio Value</TableHead>
                          <TableHead>Last Contact</TableHead>
                          <TableHead>Days Since Contact</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {highRiskClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-gray-500">{client.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-orange-700">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.portfolioValue)}
                            </TableCell>
                            <TableCell className="text-gray-600">{client.lastContact}</TableCell>
                            <TableCell>
                              <Badge variant={client.daysInactive > 21 ? "destructive" : "secondary"}>
                                {client.daysInactive} days
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Call">
                                  <Phone className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Email">
                                  <Mail className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Profile">
                                  <Link href={`/clients/${client.id}`}>
                                    <ExternalLink className="h-4 w-4 text-gray-600" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}

        {/* ============ POSITIVE DATA SECTION ============ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Healthy Clients Dialog */}
          <Dialog>
            <Alert className="flex items-start justify-between bg-green-50 border-green-200">
              <div className="flex gap-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                <div>
                  <AlertTitle className="text-green-800">Healthy Clients</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {healthyClients.length} clients actively engaged & growing
                  </AlertDescription>
                </div>
              </div>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2 shrink-0 text-green-700 hover:text-green-800 hover:bg-green-100">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
            </Alert>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Healthy & Engaged Clients
                </DialogTitle>
                <DialogDescription>
                  Clients with recent contact, stable portfolios, and high satisfaction scores. Your star relationships! ⭐
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-auto flex-1 -mx-6 px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <p className="text-xs text-green-700">Total Healthy AUM</p>
                      <p className="text-lg font-bold text-green-800">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                          healthyClients.reduce((sum, c) => sum + c.portfolioValue, 0)
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <p className="text-xs text-green-700">Avg Satisfaction</p>
                      <p className="text-lg font-bold text-green-800">
                        {healthyClients.length > 0 
                          ? (healthyClients.reduce((sum, c) => sum + c.satisfaction, 0) / healthyClients.length).toFixed(1)
                          : 0}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <p className="text-xs text-green-700">Avg Growth</p>
                      <p className="text-lg font-bold text-green-800">
                        +{healthyClients.length > 0
                          ? (healthyClients.reduce((sum, c) => sum + c.portfolioGrowth, 0) / healthyClients.length).toFixed(1)
                          : 0}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <p className="text-xs text-green-700">Total Investments</p>
                      <p className="text-lg font-bold text-green-800">
                        {healthyClients.reduce((sum, c) => sum + c.investmentsCount, 0)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Portfolio Value</TableHead>
                      <TableHead>Growth</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthyClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-700 font-medium text-xs">{client.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-gray-500">{client.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-green-700">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.portfolioValue)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <TrendingUpIcon className="h-3 w-3 mr-1" />
                            +{client.portfolioGrowth}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            {client.daysSinceContact} days ago
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{client.satisfaction}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            {client.riskProfile}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Call">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Email">
                              <Mail className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Profile">
                              <Link href={`/clients/${client.id}`}>
                                <ExternalLink className="h-4 w-4 text-gray-600" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          {/* Top Performers Dialog */}
          <Dialog>
            <Alert className="flex items-start justify-between bg-purple-50 border-purple-200">
              <div className="flex gap-3">
                <Trophy className="h-4 w-4 mt-0.5 text-purple-600" />
                <div>
                  <AlertTitle className="text-purple-800">Top Performers</AlertTitle>
                  <AlertDescription className="text-purple-700">
                    {topPerformers.length} clients with exceptional returns
                  </AlertDescription>
                </div>
              </div>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2 shrink-0 text-purple-700 hover:text-purple-800 hover:bg-purple-100">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
            </Alert>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-purple-700">
                  <Trophy className="h-5 w-5" />
                  Top Performing Clients
                </DialogTitle>
                <DialogDescription>
                  Your highest-return portfolios this year. These clients are seeing excellent growth! 🚀
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-auto flex-1 -mx-6 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-purple-700">Total Gains (YTD)</p>
                      <p className="text-xl font-bold text-purple-800">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                          topPerformers.reduce((sum, c) => sum + c.totalGains, 0)
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-purple-700">Avg YTD Return</p>
                      <p className="text-xl font-bold text-purple-800">
                        +{(topPerformers.reduce((sum, c) => sum + c.ytdReturn, 0) / topPerformers.length).toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-purple-700">Top Performer AUM</p>
                      <p className="text-xl font-bold text-purple-800">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                          topPerformers.reduce((sum, c) => sum + c.portfolioValue, 0)
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Portfolio Value</TableHead>
                      <TableHead>YTD Return</TableHead>
                      <TableHead>Total Gains</TableHead>
                      <TableHead>Investment Types</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPerformers.map((client, index) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-purple-50 text-purple-700'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-gray-500">Since {client.clientSince}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.portfolioValue)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                            <TrendingUpIcon className="h-3 w-3 mr-1" />
                            +{client.ytdReturn}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.totalGains)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {client.investmentTypes.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Call">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Profile">
                              <Link href={`/clients/${client.id}`}>
                                <ExternalLink className="h-4 w-4 text-gray-600" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          {/* Recent Successes Dialog */}
          <Dialog>
            <Alert className="flex items-start justify-between bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <Sparkles className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <AlertTitle className="text-blue-800">Recent Wins</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    {recentSuccesses.length} milestones & achievements this week
                  </AlertDescription>
                </div>
              </div>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2 shrink-0 text-blue-700 hover:text-blue-800 hover:bg-blue-100">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
            </Alert>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                  Recent Wins & Milestones
                </DialogTitle>
                <DialogDescription>
                  Celebrate your clients&apos; achievements! New investments, goals reached, and portfolio milestones. 🎉
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-auto flex-1 -mx-6 px-6">
                <div className="space-y-3">
                  {recentSuccesses.map((success) => (
                    <Card key={success.id} className={`border-l-4 ${
                      success.type === 'portfolio_milestone' ? 'border-l-purple-500 bg-purple-50/50' :
                      success.type === 'new_investment' ? 'border-l-green-500 bg-green-50/50' :
                      success.type === 'goal_reached' ? 'border-l-blue-500 bg-blue-50/50' :
                      'border-l-yellow-500 bg-yellow-50/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              success.type === 'portfolio_milestone' ? 'bg-purple-100' :
                              success.type === 'new_investment' ? 'bg-green-100' :
                              success.type === 'goal_reached' ? 'bg-blue-100' :
                              'bg-yellow-100'
                            }`}>
                              {success.type === 'portfolio_milestone' && <Award className="h-5 w-5 text-purple-600" />}
                              {success.type === 'new_investment' && <TrendingUpIcon className="h-5 w-5 text-green-600" />}
                              {success.type === 'goal_reached' && <Target className="h-5 w-5 text-blue-600" />}
                              {success.type === 'referral' && <Gift className="h-5 w-5 text-yellow-600" />}
                            </div>
                            <div>
                              <p className="font-semibold">{success.clientName}</p>
                              <p className="text-sm text-gray-600">{success.description}</p>
                              {success.amount && (
                                <p className="text-lg font-bold text-green-600 mt-1">
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(success.amount)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="text-xs">
                              {success.date}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/clients/${success.clientId}`}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/clients">
              <Users className="h-4 w-4 mr-2" />
              View All Clients
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tasks">
              <Activity className="h-4 w-4 mr-2" />
              Today&apos;s Tasks
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Assets Under Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => [formatCurrency(Number(value)), 'AUM']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aum" 
                      stroke="#000000" 
                      strokeWidth={2}
                      dot={{ fill: '#000000', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Opportunities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Opportunities</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/clients">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Probability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topOpportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell>
                        <Link href={`/clients/${opp.client_id}`} className="hover:underline font-medium">
                          {opp.clientName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600">{opp.investment_type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={opp.probability > 70 ? 'default' : 'secondary'}
                          className={opp.probability > 70 ? 'bg-green-600' : ''}
                        >
                          {opp.probability}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lifecycle Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Client Lifecycle Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.lifecycleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {data.lifecycleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.lifecycleDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {data.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                  </div>
                ))}
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
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Link href={`/clients/${activity.client_id}`} className="hover:underline font-medium">
                        {activity.clientName}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{activity.type}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          activity.outcome === 'interested' ? 'border-green-500 text-green-600' :
                          activity.outcome === 'invested' ? 'border-green-600 bg-green-50 text-green-700' :
                          activity.outcome === 'not_interested' ? 'border-red-500 text-red-600' :
                          'border-yellow-500 text-yellow-600'
                        }
                      >
                        {activity.outcome.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-xs truncate">
                      {activity.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Salesforce Integration */}
        <SalesforceSync />
      </div>
    </div>
  );
}
