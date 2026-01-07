'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
  Maximize2,
  Info,
  Activity,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
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
  { name: 'Stocks', value: 35, color: '#000000' },
  { name: 'Mutual Funds', value: 28, color: '#374151' },
  { name: 'ETFs', value: 20, color: '#6B7280' },
  { name: 'Fixed Income', value: 17, color: '#9CA3AF' },
];

const contactMethodData = [
  { method: 'Phone Call', success: 68, total: 100 },
  { method: 'Email', success: 45, total: 100 },
  { method: 'Meeting', success: 82, total: 100 },
  { method: 'Video Call', success: 75, total: 100 },
];

const clientSegmentData = [
  { segment: 'High Net Worth', aum: 4500000, clients: 8, avgReturn: 12.5 },
  { segment: 'Growth', aum: 2800000, clients: 15, avgReturn: 10.2 },
  { segment: 'Conservative', aum: 1500000, clients: 12, avgReturn: 6.8 },
  { segment: 'New Investors', aum: 800000, clients: 10, avgReturn: 8.5 },
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

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  tooltip?: string;
}

function DashboardCard({ title, description, icon: Icon, children, tooltip }: DashboardCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {title}
                {tooltip && (
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
                )}
              </CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function TableauDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Tableau Analytics
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </CardTitle>
              <CardDescription>
                Interactive dashboards • Real-time insights
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in Tableau
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview" className="gap-1">
              <BarChart3 className="h-3 w-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-1">
              <PieChart className="h-3 w-3" />
              Investments
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-1">
              <Users className="h-3 w-3" />
              Clients
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AUM Trend */}
              <DashboardCard
                title="AUM Growth Trend"
                description="Assets Under Management (in millions)"
                icon={DollarSign}
                tooltip="Total portfolio value managed across all clients"
              >
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aumTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(v) => `$${v}M`} />
                      <RechartsTooltip 
                        formatter={(value) => [`$${value}M`, 'AUM']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="aum" 
                        stroke="#000" 
                        fill="#e5e7eb"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Investment Distribution */}
              <DashboardCard
                title="Investment Distribution"
                description="Portfolio allocation by type"
                icon={PieChart}
                tooltip="How client investments are distributed across asset classes"
              >
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={investmentPopularityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {investmentPopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        fontSize={12}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Advisor Activity */}
              <DashboardCard
                title="Advisor Activity Metrics"
                description="Monthly conversions, meetings & calls"
                icon={Activity}
                tooltip="Track your engagement activities and conversion success"
              >
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={advisorPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="conversions" fill="#000000" name="Conversions" />
                      <Bar dataKey="meetings" fill="#6B7280" name="Meetings" />
                      <Bar dataKey="calls" fill="#D1D5DB" name="Calls" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              {/* Contact Method Success */}
              <DashboardCard
                title="Contact Method Success Rate"
                description="Effectiveness by communication channel"
                icon={Target}
                tooltip="Which contact methods lead to better engagement"
              >
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contactMethodData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" domain={[0, 100]} fontSize={12} />
                      <YAxis dataKey="method" type="category" fontSize={11} width={80} />
                      <RechartsTooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                      <Bar dataKey="success" fill="#000000" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
            </div>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-4">
            <DashboardCard
              title="Investment Product Popularity"
              description="Client preferences across asset types"
              icon={TrendingUp}
              tooltip="Which investment products are most popular among your clients"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={investmentPopularityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={true}
                      dataKey="value"
                    >
                      {investmentPopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <DashboardCard
              title="Client Segment Analysis"
              description="AUM and performance by client tier"
              icon={Users}
              tooltip="How your clients are segmented and performing"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientSegmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="segment" fontSize={11} />
                    <YAxis 
                      yAxisId="left" 
                      fontSize={12} 
                      tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      fontSize={12}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => {
                        const numValue = Number(value);
                        if (name === 'AUM') return [`$${(numValue/1000000).toFixed(2)}M`, name];
                        if (name === 'Avg Return') return [`${numValue}%`, name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="aum" fill="#000000" name="AUM" />
                    <Bar yAxisId="right" dataKey="avgReturn" fill="#9CA3AF" name="Avg Return" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>

        {/* Tableau Embed Placeholder */}
        <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">Tableau Embed Ready</p>
            <p className="text-xs mt-1">
              Replace with Tableau JS API embed using your Tableau Public/Server dashboard URL
            </p>
            <code className="text-xs bg-white px-2 py-1 rounded border mt-2 inline-block">
              {'<tableau-viz id="viz" src="YOUR_TABLEAU_URL" />'}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TableauDashboard;
