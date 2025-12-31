'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  UserX
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Link from 'next/link';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Clients</p>
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
                  <p className="text-sm text-gray-500">Active Opportunities</p>
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
                  <p className="text-sm text-gray-500">Conversion Rate</p>
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
                  <p className="text-sm text-gray-500">Total AUM</p>
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
        {(data.alerts.inactiveClients > 0 || data.alerts.urgentFollowups > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.alerts.urgentFollowups > 0 && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Urgent Follow-ups</AlertTitle>
                <AlertDescription>
                  {data.alerts.urgentFollowups} clients haven&apos;t been contacted in 14+ days
                </AlertDescription>
              </Alert>
            )}
            {data.alerts.inactiveClients > 0 && (
              <Alert>
                <UserX className="h-4 w-4" />
                <AlertTitle>Inactive Clients</AlertTitle>
                <AlertDescription>
                  {data.alerts.inactiveClients} clients inactive for 30+ days
                </AlertDescription>
              </Alert>
            )}
            {data.alerts.highRiskClients > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High-Risk Portfolios</AlertTitle>
                <AlertDescription>
                  {data.alerts.highRiskClients} clients with high-risk profiles
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

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
              <CardTitle>Top Opportunities</CardTitle>
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
      </div>
    </div>
  );
}
