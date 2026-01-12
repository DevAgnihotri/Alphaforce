'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Cloud,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Users,
  Briefcase,
  Activity,
  FileText,
  Info,
  Loader2,
} from 'lucide-react';

interface SalesforceObject {
  name: string;
  icon: React.ElementType;
  recordCount: number;
  lastSync: string;
  status: 'synced' | 'pending' | 'error';
  description: string;
}

interface SyncStats {
  totalRecords: number;
  lastFullSync: string;
  syncHealth: number;
  apiCallsToday: number;
  apiCallsLimit: number;
}

const SALESFORCE_OBJECTS: SalesforceObject[] = [
  {
    name: 'Leads',
    icon: Users,
    recordCount: 25,
    lastSync: '2 min ago',
    status: 'synced',
    description: 'Potential clients captured from various sources',
  },
  {
    name: 'Accounts',
    icon: Briefcase,
    recordCount: 25,
    lastSync: '2 min ago',
    status: 'synced',
    description: 'Active client accounts with portfolio data',
  },
  {
    name: 'Opportunities',
    icon: FileText,
    recordCount: 42,
    lastSync: '5 min ago',
    status: 'synced',
    description: 'Investment opportunities and deal pipeline',
  },
  {
    name: 'Activities',
    icon: Activity,
    recordCount: 68,
    lastSync: '1 min ago',
    status: 'synced',
    description: 'Calls, emails, and meetings with clients',
  },
];

function StatusBadge({ status }: { status: 'synced' | 'pending' | 'error' }) {
  const config = {
    synced: { label: 'Synced', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
    pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
    error: { label: 'Error', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
  };

  const { label, variant, icon: Icon, color } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className={`h-3 w-3 ${color}`} />
      {label}
    </Badge>
  );
}

export function SalesforceSync() {
  const [syncing, setSyncing] = useState(false);
  const [objects, setObjects] = useState<SalesforceObject[]>(SALESFORCE_OBJECTS);
  const [stats, setStats] = useState<SyncStats>({
    totalRecords: 110,
    lastFullSync: '2025-01-07 10:30 AM',
    syncHealth: 98,
    apiCallsToday: 245,
    apiCallsLimit: 10000,
  });
  const [loading, setLoading] = useState(true);

  // Fetch initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [objectsRes, statsRes] = await Promise.all([
          fetch('/api/salesforce/sync'),
          fetch('/api/salesforce/stats'),
        ]);

        if (objectsRes.ok) {
          const objectsData = await objectsRes.json();
          if (objectsData.success) {
            setObjects(objectsData.data.objects);
          }
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Salesforce data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    
    // Update UI to show pending status
    setObjects(prev => prev.map(obj => ({ ...obj, status: 'pending' as const })));
    
    try {
      // Trigger sync via API
      const syncRes = await fetch('/api/salesforce/sync', {
        method: 'POST',
      });

      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData.success) {
          setObjects(syncData.data.objects);
        }
      }

      // Update stats
      const statsRes = await fetch('/api/salesforce/stats', {
        method: 'POST',
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
      // Revert to previous state on error
      setObjects(prev => prev.map(obj => ({ ...obj, status: 'error' as const })));
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Salesforce Integration
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Mock Salesforce data sync showing Leads, Accounts, Opportunities, and Activities
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>
                Connected to Salesforce CRM • {stats.syncHealth}% Sync Health
              </CardDescription>
            </div>
          </div>
          <Button 
            onClick={handleSync} 
            disabled={syncing}
            variant="outline"
            className="gap-2"
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sync Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-xl font-bold">{stats.totalRecords.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Last Full Sync</p>
            <p className="text-sm font-medium">{stats.lastFullSync}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Sync Health</p>
            <p className="text-xl font-bold text-green-600">{stats.syncHealth}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">API Calls Today</p>
            <p className="text-sm font-medium">
              {stats.apiCallsToday.toLocaleString()} / {stats.apiCallsLimit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Objects Table */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Salesforce Objects
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Object</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objects.map((obj) => {
                const Icon = obj.icon;
                return (
                  <TableRow key={obj.name}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <Icon className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{obj.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{obj.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{obj.recordCount.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-500">{obj.lastSync}</TableCell>
                    <TableCell>
                      <StatusBadge status={obj.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SalesforceSync;
