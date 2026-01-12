'use client';

import { Header } from '@/components/Header';
import { SalesforceSync } from '@/components/SalesforceSync';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Phone,
  Mail,
  Calendar,
  Target,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  DollarSign,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Briefcase,
  Wallet,
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
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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

// Extended mock data for enhanced visualizations
const weeklyActivityData = [
  { day: 'Mon', calls: 12, emails: 18, meetings: 4 },
  { day: 'Tue', calls: 15, emails: 22, meetings: 6 },
  { day: 'Wed', calls: 18, emails: 25, meetings: 8 },
  { day: 'Thu', calls: 14, emails: 20, meetings: 5 },
  { day: 'Fri', calls: 20, emails: 28, meetings: 10 },
  { day: 'Sat', calls: 5, emails: 8, meetings: 2 },
  { day: 'Sun', calls: 2, emails: 4, meetings: 0 },
];

const performanceRadarData = [
  { metric: 'Conversions', value: 85, fullMark: 100 },
  { metric: 'Response Rate', value: 78, fullMark: 100 },
  { metric: 'Retention', value: 92, fullMark: 100 },
  { metric: 'Satisfaction', value: 88, fullMark: 100 },
  { metric: 'Growth', value: 75, fullMark: 100 },
  { metric: 'Engagement', value: 82, fullMark: 100 },
];

const revenueData = [
  { month: 'Jul', revenue: 145000, target: 140000 },
  { month: 'Aug', revenue: 158000, target: 150000 },
  { month: 'Sep', revenue: 172000, target: 160000 },
  { month: 'Oct', revenue: 185000, target: 175000 },
  { month: 'Nov', revenue: 195000, target: 185000 },
  { month: 'Dec', revenue: 220000, target: 200000 },
  { month: 'Jan', revenue: 245000, target: 220000 },
];

const clientGrowthData = [
  { month: 'Jul', new: 8, churned: 2 },
  { month: 'Aug', new: 12, churned: 1 },
  { month: 'Sep', new: 10, churned: 3 },
  { month: 'Oct', new: 15, churned: 2 },
  { month: 'Nov', new: 11, churned: 1 },
  { month: 'Dec', new: 18, churned: 2 },
  { month: 'Jan', new: 22, churned: 3 },
];

// Chart configurations
const activityChartConfig: ChartConfig = {
  calls: { label: 'Calls', color: 'hsl(221.2 83.2% 53.3%)' },
  emails: { label: 'Emails', color: 'hsl(142.1 76.2% 36.3%)' },
  meetings: { label: 'Meetings', color: 'hsl(262.1 83.3% 57.8%)' },
};

const revenueChartConfig: ChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(142.1 76.2% 36.3%)' },
  target: { label: 'Target', color: 'hsl(0 0% 60%)' },
};

const clientGrowthConfig: ChartConfig = {
  new: { label: 'New Clients', color: 'hsl(142.1 76.2% 36.3%)' },
  churned: { label: 'Churned', color: 'hsl(346.8 77.2% 49.8%)' },
};

const responseRateConfig: ChartConfig = {
  call: { label: 'Call', color: 'hsl(221.2 83.2% 53.3%)' },
  email: { label: 'Email', color: 'hsl(142.1 76.2% 36.3%)' },
  meeting: { label: 'Meeting', color: 'hsl(32.1 94.6% 43.7%)' },
};

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  description,
  gradient,
}: { 
  title: string; 
  value: string | number; 
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  description?: string;
  gradient?: string;
}) {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${gradient}`}>
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
              {change && (
                <span className={`flex items-center text-sm font-medium ${
                  changeType === 'positive' ? 'text-emerald-200' :
                  changeType === 'negative' ? 'text-red-200' : 'text-white/60'
                }`}>
                  {changeType === 'positive' && <ArrowUpRight className="h-4 w-4" />}
                  {changeType === 'negative' && <ArrowDownRight className="h-4 w-4" />}
                  {change}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-white/60">{description}</p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini Sparkline Card
function SparklineCard({
  title,
  value,
  data,
  dataKey,
  color,
  icon: Icon,
}: {
  title: string;
  value: string;
  data: { name: string; value: number }[];
  dataKey: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          <span className="text-lg font-bold">{value}</span>
        </div>
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey}
                stroke={color}
                fill={`url(#gradient-${title.replace(/\s/g, '')})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Progress Ring Component
function ProgressRing({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="88" height="88" className="transform -rotate-90">
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-800"
          />
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}

// Leader Board Card
function LeaderboardCard() {
  const topAdvisors = [
    { name: 'Sarah Johnson', conversions: 28, avatar: '👩‍💼', trend: 'up' },
    { name: 'Michael Chen', conversions: 24, avatar: '👨‍💼', trend: 'up' },
    { name: 'Emily Davis', conversions: 21, avatar: '👩‍💻', trend: 'down' },
    { name: 'James Wilson', conversions: 18, avatar: '👨‍💻', trend: 'up' },
    { name: 'Lisa Anderson', conversions: 15, avatar: '👩‍🏫', trend: 'same' },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="text-base">Top Performers</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">This Month</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topAdvisors.map((advisor, index) => (
          <div key={advisor.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <span className={`text-sm font-bold w-5 ${
              index === 0 ? 'text-yellow-500' :
              index === 1 ? 'text-gray-400' :
              index === 2 ? 'text-amber-600' : 'text-gray-500'
            }`}>
              #{index + 1}
            </span>
            <span className="text-xl">{advisor.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{advisor.name}</p>
              <p className="text-xs text-muted-foreground">{advisor.conversions} conversions</p>
            </div>
            {advisor.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
            {advisor.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Recent Activity Feed
function ActivityFeed() {
  const activities = [
    { type: 'call', client: 'Robert Thompson', time: '5 min ago', outcome: 'interested', icon: Phone },
    { type: 'email', client: 'Maria Garcia', time: '12 min ago', outcome: 'opened', icon: Mail },
    { type: 'meeting', client: 'David Kim', time: '1 hour ago', outcome: 'converted', icon: Calendar },
    { type: 'call', client: 'Jennifer Lee', time: '2 hours ago', outcome: 'follow-up', icon: Phone },
    { type: 'email', client: 'James Brown', time: '3 hours ago', outcome: 'replied', icon: Mail },
  ];

  const outcomeColors: Record<string, string> = {
    interested: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    opened: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    'follow-up': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    replied: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-base">Live Activity</CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <activity.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.client}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            <Badge variant="secondary" className={`text-xs ${outcomeColors[activity.outcome]}`}>
              {activity.outcome}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Header title="Analytics" subtitle="Comprehensive dashboards and insights" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Header title="Analytics" subtitle="Comprehensive dashboards and insights" />
        <div className="p-6">
          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardContent className="pt-6 flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error || 'Failed to load data'}</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sparklineData = [
    { name: 'W1', value: 12 },
    { name: 'W2', value: 18 },
    { name: 'W3', value: 15 },
    { name: 'W4', value: 25 },
    { name: 'W5', value: 22 },
    { name: 'W6', value: 30 },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header title="Analytics" subtitle="AI-Powered insights & real-time dashboards" />
      
      <div className="p-6 space-y-8">
        {/* Hero Stats Section - Gradient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value="$2.45M"
            change="+12.5%"
            changeType="positive"
            icon={DollarSign}
            description="vs. last month"
            gradient="bg-linear-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Active Clients"
            value="45"
            change="+8"
            changeType="positive"
            icon={Users}
            description="3 new this week"
            gradient="bg-linear-to-br from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Conversion Rate"
            value={`${data.summary.successRate}%`}
            change="+5.2%"
            changeType="positive"
            icon={Target}
            description="Above industry avg"
            gradient="bg-linear-to-br from-purple-500 to-pink-600"
          />
          <StatCard
            title="Response Time"
            value={`${data.summary.avgResponseTime}h`}
            change="-2h"
            changeType="positive"
            icon={Clock}
            description="Faster than target"
            gradient="bg-linear-to-br from-orange-500 to-red-600"
          />
        </div>

        {/* Quick Sparkline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SparklineCard
            title="Calls"
            value="156"
            data={sparklineData}
            dataKey="value"
            color="#3b82f6"
            icon={Phone}
          />
          <SparklineCard
            title="Emails"
            value="342"
            data={sparklineData.map(d => ({ ...d, value: d.value * 1.5 }))}
            dataKey="value"
            color="#10b981"
            icon={Mail}
          />
          <SparklineCard
            title="Meetings"
            value="48"
            data={sparklineData.map(d => ({ ...d, value: d.value * 0.6 }))}
            dataKey="value"
            color="#8b5cf6"
            icon={Calendar}
          />
          <SparklineCard
            title="Conversions"
            value="28"
            data={sparklineData.map(d => ({ ...d, value: d.value * 0.4 }))}
            dataKey="value"
            color="#f43f5e"
            icon={CheckCircle2}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue vs Target Chart */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    Revenue Performance
                  </CardTitle>
                  <CardDescription>Monthly revenue vs target comparison</CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18% YoY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="h-72">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${v/1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(142.1 76.2% 36.3%)"
                    fill="url(#revenueGradient)"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(0 0% 60%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-base">Q1 Goals Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 py-2">
                <ProgressRing value={78} label="AUM Target" color="#3b82f6" />
                <ProgressRing value={92} label="New Clients" color="#10b981" />
                <ProgressRing value={85} label="Revenue" color="#8b5cf6" />
                <ProgressRing value={96} label="Retention" color="#f59e0b" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  On track for Q1 targets
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Tabbed Dashboard Section */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border">
            <TabsTrigger value="performance" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="investments" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Investments</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Engagement</span>
            </TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Activity Chart */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        Weekly Activity Distribution
                      </CardTitle>
                      <CardDescription>Activity breakdown by day and type</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={activityChartConfig} className="h-72">
                    <BarChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="calls" fill="var(--color-calls)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="emails" fill="var(--color-emails)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Performance Radar */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900">
                      <Flame className="h-5 w-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-base">Performance Score</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={performanceRadarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="metric" className="text-xs" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" tick={{ fontSize: 9 }} />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
                      Overall Score: 83/100
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LeaderboardCard />
              <ActivityFeed />
              
              {/* Conversion Trend */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-base">Conversion Trend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.advisorPerformance.conversionTrend}>
                        <defs>
                          <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" unit="%" />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke="#10b981"
                          fill="url(#conversionGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    Up 7% from last quarter
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Client Growth Chart */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    Client Growth Analysis
                  </CardTitle>
                  <CardDescription>New vs churned clients over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={clientGrowthConfig} className="h-72">
                    <BarChart data={clientGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="new" fill="var(--color-new)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="churned" fill="var(--color-churned)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Lifecycle Distribution */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <PieChartIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    Client Lifecycle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.advisorPerformance.lifecycleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {data.advisorPerformance.lifecycleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {data.advisorPerformance.lifecycleData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                      <Wallet className="h-5 w-5 text-indigo-600" />
                    </div>
                    Portfolio Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.investmentInsights.riskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {data.investmentInsights.riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Returns by Type */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    Expected Returns by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.investmentInsights.returnsByType} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" unit="%" />
                        <YAxis dataKey="type" type="category" className="text-xs" width={90} />
                        <Bar dataKey="avgReturn" radius={[0, 6, 6, 0]}>
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

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Response Rate Trend */}
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-900">
                      <LineChartIcon className="h-5 w-5 text-cyan-600" />
                    </div>
                    Response Rate by Channel
                  </CardTitle>
                  <CardDescription>Monthly response rates across contact methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={responseRateConfig} className="h-72">
                    <LineChart data={data.contactEffectiveness.responseRateTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" unit="%" domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line
                        type="monotone"
                        dataKey="call"
                        stroke="var(--color-call)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-call)', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="email"
                        stroke="var(--color-email)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-email)', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="meeting"
                        stroke="var(--color-meeting)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-meeting)', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Outcome Distribution */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900">
                      <PieChartIcon className="h-5 w-5 text-pink-600" />
                    </div>
                    Outcome Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.contactEffectiveness.outcomeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {data.contactEffectiveness.outcomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {data.contactEffectiveness.outcomeData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Salesforce Integration */}
        <div className="mt-8">
          <SalesforceSync />
        </div>
      </div>
    </div>
  );
}
