'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
  Activity,
  Target,
  Sparkles,
  ArrowUpRight,
  Globe,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';

// Mock Tableau-style data
const advisorPerformanceData = [
  { month: 'Jul', conversions: 12, meetings: 28, calls: 45 },
  { month: 'Aug', conversions: 15, meetings: 32, calls: 52 },
  { month: 'Sep', conversions: 18, meetings: 35, calls: 48 },
  { month: 'Oct', conversions: 22, meetings: 40, calls: 55 },
  { month: 'Nov', conversions: 20, meetings: 38, calls: 50 },
  { month: 'Dec', conversions: 25, meetings: 42, calls: 58 },
  { month: 'Jan', conversions: 28, meetings: 45, calls: 62 },
];

const investmentPopularityData = [
  { name: 'Stocks', value: 35, fill: 'hsl(221.2 83.2% 53.3%)' },
  { name: 'Mutual Funds', value: 28, fill: 'hsl(142.1 76.2% 36.3%)' },
  { name: 'ETFs', value: 20, fill: 'hsl(262.1 83.3% 57.8%)' },
  { name: 'Fixed Income', value: 17, fill: 'hsl(32.1 94.6% 43.7%)' },
];

const contactMethodData = [
  { method: 'Phone Call', success: 68 },
  { method: 'Email', success: 45 },
  { method: 'Meeting', success: 82 },
  { method: 'Video Call', success: 75 },
];

const clientSegmentData = [
  { segment: 'High Net Worth', aum: 4.5, clients: 8, fill: 'hsl(221.2 83.2% 53.3%)' },
  { segment: 'Growth', aum: 2.8, clients: 15, fill: 'hsl(142.1 76.2% 36.3%)' },
  { segment: 'Conservative', aum: 1.5, clients: 12, fill: 'hsl(262.1 83.3% 57.8%)' },
  { segment: 'New Investors', aum: 0.8, clients: 10, fill: 'hsl(32.1 94.6% 43.7%)' },
];

const aumTrendData = [
  { month: 'Jul', aum: 8.2 },
  { month: 'Aug', aum: 8.5 },
  { month: 'Sep', aum: 8.8 },
  { month: 'Oct', aum: 9.1 },
  { month: 'Nov', aum: 9.4 },
  { month: 'Dec', aum: 9.6 },
  { month: 'Jan', aum: 10.2 },
];

const goalCompletionData = [
  { name: 'Revenue', value: 87, fill: 'hsl(142.1 76.2% 36.3%)' },
  { name: 'Clients', value: 92, fill: 'hsl(221.2 83.2% 53.3%)' },
  { name: 'AUM', value: 78, fill: 'hsl(262.1 83.3% 57.8%)' },
  { name: 'Retention', value: 95, fill: 'hsl(32.1 94.6% 43.7%)' },
];

// Chart configurations
const performanceConfig: ChartConfig = {
  conversions: { label: 'Conversions', color: 'hsl(221.2 83.2% 53.3%)' },
  meetings: { label: 'Meetings', color: 'hsl(142.1 76.2% 36.3%)' },
  calls: { label: 'Calls', color: 'hsl(262.1 83.3% 57.8%)' },
};

const contactConfig: ChartConfig = {
  success: { label: 'Success Rate', color: 'hsl(221.2 83.2% 53.3%)' },
};

const investmentConfig: ChartConfig = {
  value: { label: 'Allocation %' },
  Stocks: { color: 'hsl(221.2 83.2% 53.3%)' },
  'Mutual Funds': { color: 'hsl(142.1 76.2% 36.3%)' },
  ETFs: { color: 'hsl(262.1 83.3% 57.8%)' },
  'Fixed Income': { color: 'hsl(32.1 94.6% 43.7%)' },
};

// Mini Stat Component
function MiniStat({ label, value, icon: Icon, change, color }: {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold">{value}</p>
          {change && (
            <span className="text-xs text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TableauDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card className="shadow-xl border-0 bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <CardHeader className="border-b bg-linear-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-orange-500 to-pink-500 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Tableau Analytics
                <Badge className="bg-linear-to-r from-orange-500 to-pink-500 text-white border-0 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Interactive dashboards • Real-time insights • AI-powered
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 shadow-sm">
            <ExternalLink className="h-4 w-4" />
            Open in Tableau
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Mini Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MiniStat 
            label="Total AUM" 
            value="$10.2M" 
            icon={DollarSign} 
            change="+6.2%"
            color="#10b981"
          />
          <MiniStat 
            label="Active Clients" 
            value="45" 
            icon={Users} 
            change="+8"
            color="#3b82f6"
          />
          <MiniStat 
            label="Conversions" 
            value="28" 
            icon={Target} 
            change="+12%"
            color="#8b5cf6"
          />
          <MiniStat 
            label="Activities" 
            value="156" 
            icon={Activity} 
            change="+23%"
            color="#f59e0b"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="overview" className="gap-1.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-1.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Investments</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-1.5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AUM Trend */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">AUM Growth Trend</CardTitle>
                      <CardDescription className="text-xs">Assets Under Management (millions)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={aumTrendData}>
                        <defs>
                          <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `$${v}M`} />
                        <Area 
                          type="monotone" 
                          dataKey="aum" 
                          stroke="#10b981" 
                          fill="url(#aumGradient)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Distribution */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <PieChartIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Investment Distribution</CardTitle>
                      <CardDescription className="text-xs">Portfolio allocation by type</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={investmentConfig} className="h-52">
                    <PieChart>
                      <Pie
                        data={investmentPopularityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {investmentPopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        formatter={(value) => <span className="text-xs">{value}</span>}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Advisor Activity */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Advisor Activity Metrics</CardTitle>
                      <CardDescription className="text-xs">Monthly performance breakdown</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={performanceConfig} className="h-52">
                    <BarChart data={advisorPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="calls" fill="var(--color-calls)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Contact Method Success */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900">
                      <Target className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Contact Success Rate</CardTitle>
                      <CardDescription className="text-xs">Effectiveness by channel</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={contactConfig} className="h-52">
                    <BarChart data={contactMethodData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" unit="%" />
                      <YAxis dataKey="method" type="category" className="text-xs" width={75} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="success" fill="var(--color-success)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    <Layers className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Investment Product Allocation</CardTitle>
                    <CardDescription className="text-xs">Client portfolio distribution across asset types</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={investmentConfig} className="h-72">
                  <PieChart>
                    <Pie
                      data={investmentPopularityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={true}
                      dataKey="value"
                    >
                      {investmentPopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Segments */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Client Segment Analysis</CardTitle>
                      <CardDescription className="text-xs">AUM by client tier (millions)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientSegmentData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="segment" className="text-xs" tick={{ fontSize: 10 }} />
                        <YAxis className="text-xs" tickFormatter={(v) => `$${v}M`} />
                        <Bar dataKey="aum" radius={[6, 6, 0, 0]}>
                          {clientSegmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Completion */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                      <Target className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Goal Completion</CardTitle>
                      <CardDescription className="text-xs">Quarterly target progress</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="20%" 
                        outerRadius="90%" 
                        data={goalCompletionData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={6}
                        />
                        <Legend 
                          iconSize={10}
                          layout="horizontal"
                          verticalAlign="bottom"
                          formatter={(value) => <span className="text-xs">{value}</span>}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="h-3.5 w-3.5" />
          <span>Data refreshed every 30 seconds</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Mock Data Mode
        </Badge>
      </CardFooter>
    </Card>
  );
}

export default TableauDashboard;
