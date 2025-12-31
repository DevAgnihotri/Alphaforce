'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, AlertTriangle, Eye, Info } from 'lucide-react';
import { Account, getDaysSinceContact } from '@/data/mockData';

export default function ClientsPage() {
  const [clients, setClients] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/clients');
        const json = await res.json();
        if (json.success) {
          setClients(json.data);
        } else {
          setError('Failed to load clients');
        }
      } catch {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Risk filter
      const matchesRisk =
        riskFilter === 'all' || client.risk_profile === riskFilter;

      // Lifecycle filter
      const matchesLifecycle =
        lifecycleFilter === 'all' || client.lifecycle_stage === lifecycleFilter;

      return matchesSearch && matchesRisk && matchesLifecycle;
    });
  }, [clients, searchQuery, riskFilter, lifecycleFilter]);

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

  const getStatusColor = (daysSince: number) => {
    if (daysSince > 14) return 'bg-red-100 text-red-700 border-red-200';
    if (daysSince > 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  if (loading) {
    return (
      <div>
        <Header title="Clients" subtitle="Manage your client portfolio" />
        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Clients" subtitle="Manage your client portfolio" />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Clients" subtitle="Manage your client portfolio" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Client List ({filteredClients.length})</CardTitle>
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>

                {/* Risk Filter */}
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                {/* Lifecycle Filter */}
                <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="opportunity">Opportunity</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            Risk <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Client&apos;s investment risk tolerance (Low/Medium/High)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            Portfolio Value <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total value of all client investments</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            Last Contact <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Days since last interaction (call, email, or meeting)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            Stage <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Client lifecycle: Lead → Qualified → Opportunity → Customer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            Probability <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>AI-predicted likelihood of conversion to customer</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No clients found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => {
                      const daysSince = getDaysSinceContact(client.last_contact);
                      return (
                        <TableRow key={client.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <Link
                                href={`/clients/${client.id}`}
                                className="font-medium text-black hover:underline"
                              >
                                {client.name}
                              </Link>
                              <p className="text-sm text-gray-500">{client.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{client.age}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(client.risk_profile)}>
                              {client.risk_profile}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(client.portfolio_value)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(daysSince)}
                            >
                              {daysSince} days ago
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize text-gray-600">
                              {client.lifecycle_stage}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                client.conversion_probability > 70
                                  ? 'border-green-500 text-green-600'
                                  : client.conversion_probability > 50
                                  ? 'border-yellow-500 text-yellow-600'
                                  : 'border-gray-300 text-gray-600'
                              }
                            >
                              {client.conversion_probability}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/clients/${client.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
