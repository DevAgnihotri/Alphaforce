'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  RefreshCw,
  DollarSign,
  Target,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  Sparkles,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

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

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<SalesforceOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<SalesforceOpportunity[]>([]);
  const [summary, setSummary] = useState<OpportunitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('probability');

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alphadesk/opportunities');
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data.opportunities);
        setFilteredOpportunities(data.data.opportunities);
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
  }, []);

  // Filter and sort opportunities
  useEffect(() => {
    let result = [...opportunities];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (opp) =>
          opp.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.investment_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((opp) => opp.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'probability':
        result.sort((a, b) => b.probability - a.probability);
        break;
      case 'amount':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'date':
        result.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        break;
      case 'fit':
        result.sort((a, b) => b.predicted_fit - a.predicted_fit);
        break;
    }

    setFilteredOpportunities(result);
  }, [opportunities, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'won':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'lost':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header title="Opportunities" subtitle="Salesforce Investment Opportunities" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold">{summary.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Open</p>
                      <p className="text-2xl font-bold">{summary.open}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Won</p>
                      <p className="text-2xl font-bold">{summary.won}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="text-xl font-bold">${summary.totalValue.toLocaleString()}</p>
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
                      <p className="text-sm text-gray-500">Avg Probability</p>
                      <p className="text-2xl font-bold">{summary.avgProbability}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        )}

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by client or investment type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="probability">Probability</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="date">Date Created</SelectItem>
                    <SelectItem value="fit">Fit Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchOpportunities} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                <Button asChild>
                  <Link href="/clients">
                    <Users className="h-4 w-4 mr-2" />
                    View Clients
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
            <CardDescription>
              Showing {filteredOpportunities.length} of {opportunities.length} opportunities from Salesforce
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Investment Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Fit Score</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No opportunities found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOpportunities.map((opp) => (
                      <TableRow key={opp.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(opp.status)}
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
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/clients/${opp.client_id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {opp.clientName}
                          </Link>
                        </TableCell>
                        <TableCell>{opp.investment_type}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${opp.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  opp.probability > 70
                                    ? 'bg-green-500'
                                    : opp.probability > 50
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-400'
                                }`}
                                style={{ width: `${opp.probability}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{opp.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{opp.predicted_fit}%</Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {new Date(opp.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button asChild size="sm" variant="ghost">
                              <Link href={`/clients/${opp.client_id}`}>
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/clients/${opp.client_id}#ai-insights`}>
                                <Sparkles className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats by Investment Type */}
        {!loading && opportunities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Opportunities by Investment Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(
                  opportunities.reduce((acc, opp) => {
                    acc[opp.investment_type] = (acc[opp.investment_type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div
                    key={type}
                    className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSearchTerm(type)}
                  >
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500 truncate" title={type}>
                      {type}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
