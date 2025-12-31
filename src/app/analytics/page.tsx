'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  return (
    <div>
      <Header title="Analytics" subtitle="Tableau dashboards and insights" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Tableau Dashboards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Tableau integration will be implemented in Step 12</p>
            <div className="mt-4">
              <Skeleton className="h-96 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
