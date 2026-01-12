'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  Eye,
  Phone,
  Mail,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { ActivityLogger } from '@/components/ActivityLogger';

interface Task {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  priority: 'high' | 'medium' | 'low';
  days_since_contact: number;
  conversion_probability: number;
  risk_profile: string;
  lifecycle_stage: string;
  reason: string;
  recommended_action: string;
  portfolio_value: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const json = await res.json();
      if (json.success) {
        setTasks(json.data);
      } else {
        setError('Failed to load tasks');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on priority
  const filteredTasks = useMemo(() => {
    if (priorityFilter === 'all') return tasks;
    return tasks.filter((task) => task.priority === priorityFilter);
  }, [tasks, priorityFilter]);

  // Stats
  const stats = useMemo(() => {
    const high = tasks.filter((t) => t.priority === 'high').length;
    const medium = tasks.filter((t) => t.priority === 'medium').length;
    const low = tasks.filter((t) => t.priority === 'low').length;
    const avgProbability = tasks.length
      ? Math.round(tasks.reduce((sum, t) => sum + t.conversion_probability, 0) / tasks.length)
      : 0;
    return { high, medium, low, total: tasks.length, avgProbability };
  }, [tasks]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-600 hover:bg-red-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-600 hover:bg-green-700">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Tasks" subtitle="Daily prioritized contact list" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
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
        <Header title="Tasks" subtitle="Daily prioritized contact list" />
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
      <Header title="Tasks" subtitle="Daily prioritized contact list" />
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">{stats.high}</p>
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
                  <p className="text-sm text-gray-500">Medium Priority</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
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
                  <p className="text-sm text-gray-500">Low Priority</p>
                  <p className="text-2xl font-bold text-green-600">{stats.low}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Probability</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgProbability}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Contact Priority List</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={priorityFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriorityFilter('all')}
                >
                  All ({stats.total})
                </Button>
                <Button
                  variant={priorityFilter === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriorityFilter('high')}
                  className={priorityFilter === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  High ({stats.high})
                </Button>
                <Button
                  variant={priorityFilter === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriorityFilter('medium')}
                  className={priorityFilter === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                >
                  Medium ({stats.medium})
                </Button>
                <Button
                  variant={priorityFilter === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriorityFilter('low')}
                  className={priorityFilter === 'low' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Low ({stats.low})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-gray-50">
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>
                          <div>
                            <Link
                              href={`/clients/${task.client_id}`}
                              className="font-medium text-black hover:underline"
                            >
                              {task.client_name}
                            </Link>
                            <p className="text-sm text-gray-500">{task.client_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              task.days_since_contact > 14
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : task.days_since_contact > 7
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-green-100 text-green-700 border-green-200'
                            }
                          >
                            {task.days_since_contact} days ago
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(task.portfolio_value)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              task.conversion_probability > 70
                                ? 'border-green-500 text-green-600'
                                : task.conversion_probability > 50
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-gray-300 text-gray-600'
                            }
                          >
                            {task.conversion_probability}%
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-50 truncate text-gray-600">
                          {task.reason}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {task.recommended_action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <ActivityLogger
                              clientId={task.client_id}
                              clientName={task.client_name}
                              defaultType="call"
                              onActivityLogged={fetchTasks}
                              trigger={
                                <Button variant="ghost" size="sm" title="Log a Call">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <ActivityLogger
                              clientId={task.client_id}
                              clientName={task.client_name}
                              defaultType="email"
                              onActivityLogged={fetchTasks}
                              trigger={
                                <Button variant="ghost" size="sm" title="Log an Email">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/clients/${task.client_id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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
