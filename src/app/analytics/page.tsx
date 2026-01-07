'use client';

import { Header } from '@/components/Header';
import { SalesforceSync } from '@/components/SalesforceSync';
import { TableauDashboard } from '@/components/TableauDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Phone,
  Mail,
  Calendar,
  Target,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Info,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AnalyticsData {
  advisorPerformance: {
    lifecycleData: { name: string; value: number; color: string }[];
    conversionTrend: { month: string; rate: number }[];
    activityByType: { type: string; count: number; color: string }[];
  };
  investmentInsights: {
    investmentPopularity: { name: string; fullName: string; type: string; count: number; color: string }[];
    riskDistribution: { name: string; value: number; color: string }[];
    returnsByType: { type: string; avgReturn: number; color: string }[];
  };
  contactEffectiveness: {
    outcomeByMethod: { method: string; interested: number; notInterested: number; invested: number; followUp: number }[];
    responseRateTrend: { month: string; call: number; email: number; meeting: number }[];
    outcomeData: { name: string; value: number; color: string }[];
  };
  summary: {
    totalActivities: number;
    successRate: number;
    avgResponseTime: number;
    topPerformingChannel: string;
  };
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  tooltip 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  tooltip: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{title}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartLegend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError('Failed to load analytics data');
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
        <Header title="Analytics" subtitle="Comprehensive dashboards and insights" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Header title="Analytics" subtitle="Comprehensive dashboards and insights" />
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error || 'Failed to load data'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Analytics" subtitle="Comprehensive dashboards and insights" />
      <div className="p-6 space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Activities"
            value={data.summary.totalActivities}
            icon={Activity}
            tooltip="Total number of client interactions (calls, emails, meetings) recorded"
          />
          <MetricCard
            title="Success Rate"
            value={`${data.summary.successRate}%`}
            icon={Target}
            tooltip="Percentage of activities resulting in interested or invested outcomes"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${data.summary.avgResponseTime} days`}
            icon={TrendingUp}
            tooltip="Average time between initial contact and client response"
          />
          <MetricCard
            title="Top Channel"
            value={data.summary.topPerformingChannel}
            icon={Users}
            tooltip="The contact method with the highest success rate"
          />
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="advisor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="advisor" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Advisor Performance</span>
              <span className="sm:hidden">Advisor</span>
            </TabsTrigger>
            <TabsTrigger value="investment" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Investment Insights</span>
              <span className="sm:hidden">Investments</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Contact Effectiveness</span>
              <span className="sm:hidden">Contacts</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard 1: Advisor Performance */}
          <TabsContent value="advisor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lifecycle Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client Lifecycle Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of clients by their current stage in the sales funnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.advisorPerformance.lifecycleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {data.advisorPerformance.lifecycleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ChartLegend items={data.advisorPerformance.lifecycleData} />
                </CardContent>
              </Card>

              {/* Conversion Rate Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Conversion Rate Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly conversion rate from lead to customer over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.advisorPerformance.conversionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} unit="%" />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2 }}
                          name="Conversion Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Activities by Type */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activities by Type
                  </CardTitle>
                  <CardDescription>
                    Distribution of client interactions across different contact methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.advisorPerformance.activityByType} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis dataKey="type" type="category" stroke="#6b7280" fontSize={12} width={80} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                          {data.advisorPerformance.activityByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">Emails</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Meetings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dashboard 2: Investment Insights */}
          <TabsContent value="investment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Investment Popularity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Investment Popularity
                  </CardTitle>
                  <CardDescription>
                    Most frequently recommended investments based on client opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.investmentInsights.investmentPopularity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={11} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                          labelFormatter={(label, payload) => {
                            const item = payload?.[0]?.payload;
                            return item?.fullName || label;
                          }}
                        />
                        <Bar dataKey="count" name="Opportunities" radius={[4, 4, 0, 0]}>
                          {data.investmentInsights.investmentPopularity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Low Risk
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Medium Risk
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      High Risk
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Portfolio Risk Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of investment products by risk level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.investmentInsights.riskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {data.investmentInsights.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ChartLegend items={data.investmentInsights.riskDistribution} />
                </CardContent>
              </Card>

              {/* Expected Returns by Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Expected Returns by Type
                  </CardTitle>
                  <CardDescription>
                    Average expected annual returns by investment category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.investmentInsights.returnsByType}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} unit="%" />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                          formatter={(value) => [`${value}%`, 'Avg Return']}
                        />
                        <Bar dataKey="avgReturn" name="Avg Return" radius={[4, 4, 0, 0]}>
                          {data.investmentInsights.returnsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dashboard 3: Contact Effectiveness */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Response Rate Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5" />
                    Response Rate Trend by Channel
                  </CardTitle>
                  <CardDescription>
                    Monthly response rates across different contact methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.contactEffectiveness.responseRateTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} unit="%" domain={[0, 100]} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="call" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6' }}
                          name="Call"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="email" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981' }}
                          name="Email"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="meeting" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={{ fill: '#f59e0b' }}
                          name="Meeting"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Outcome Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Activity Outcome Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of all activity outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.contactEffectiveness.outcomeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {data.contactEffectiveness.outcomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ChartLegend items={data.contactEffectiveness.outcomeData} />
                </CardContent>
              </Card>

              {/* Outcome by Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Outcomes by Contact Method
                  </CardTitle>
                  <CardDescription>
                    Success metrics breakdown for each contact channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.contactEffectiveness.outcomeByMethod}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="method" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} unit="%" />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Legend />
                        <Bar dataKey="interested" name="Interested" fill="#10b981" stackId="a" />
                        <Bar dataKey="invested" name="Invested" fill="#3b82f6" stackId="a" />
                        <Bar dataKey="followUp" name="Follow-up" fill="#f59e0b" stackId="a" />
                        <Bar dataKey="notInterested" name="Not Interested" fill="#ef4444" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Tableau Dashboard Integration */}
        <div className="mt-8">
          <TableauDashboard />
        </div>

        {/* Salesforce Integration */}
        <div className="mt-8">
          <SalesforceSync />
        </div>
      </div>
    </div>
  );
}
