// GET /api/dashboard-stats - Return aggregated dashboard metrics

import { NextResponse } from 'next/server';
import { 
  clients, 
  activities, 
  opportunities, 
  getDaysSinceContact 
} from '@/data/mockData';

export async function GET() {
  try {
    // Calculate key metrics
    const totalClients = clients.length;
    const activeOpportunities = opportunities.filter(o => o.status === 'open').length;
    
    // Conversion rate: customers / total clients
    const customers = clients.filter(c => c.lifecycle_stage === 'customer').length;
    const conversionRate = Math.round((customers / totalClients) * 100);

    // Average portfolio value
    const avgPortfolioValue = Math.round(
      clients.reduce((sum, c) => sum + c.portfolio_value, 0) / totalClients
    );

    // Total assets under management
    const totalAUM = clients.reduce((sum, c) => sum + c.portfolio_value, 0);

    // Recent activities (last 10)
    const recentActivities = [...activities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(act => {
        const client = clients.find(c => c.id === act.client_id);
        return {
          ...act,
          clientName: client?.name || 'Unknown',
        };
      });

    // Top opportunities (highest probability)
    const topOpportunities = opportunities
      .filter(o => o.status === 'open')
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5)
      .map(opp => {
        const client = clients.find(c => c.id === opp.client_id);
        return {
          ...opp,
          clientName: client?.name || 'Unknown',
        };
      });

    // Alerts
    const inactiveClients = clients.filter(c => getDaysSinceContact(c.last_contact) > 30).length;
    const highRiskClients = clients.filter(c => c.risk_profile === 'high').length;
    const urgentFollowups = clients.filter(c => getDaysSinceContact(c.last_contact) > 14).length;

    // Lifecycle stage distribution
    const lifecycleDistribution = {
      lead: clients.filter(c => c.lifecycle_stage === 'lead').length,
      qualified: clients.filter(c => c.lifecycle_stage === 'qualified').length,
      opportunity: clients.filter(c => c.lifecycle_stage === 'opportunity').length,
      customer: clients.filter(c => c.lifecycle_stage === 'customer').length,
    };

    // Risk distribution
    const riskDistribution = {
      low: clients.filter(c => c.risk_profile === 'low').length,
      medium: clients.filter(c => c.risk_profile === 'medium').length,
      high: clients.filter(c => c.risk_profile === 'high').length,
    };

    // Activity breakdown by type
    const activityByType = {
      call: activities.filter(a => a.type === 'call').length,
      email: activities.filter(a => a.type === 'email').length,
      meeting: activities.filter(a => a.type === 'meeting').length,
    };

    // Monthly performance (mock data for chart)
    const monthlyPerformance = [
      { month: 'Jul', aum: 1800000 },
      { month: 'Aug', aum: 1950000 },
      { month: 'Sep', aum: 2050000 },
      { month: 'Oct', aum: 2150000 },
      { month: 'Nov', aum: 2280000 },
      { month: 'Dec', aum: totalAUM },
    ];

    // Formatted lifecycle distribution for pie chart
    const lifecycleChartData = [
      { name: 'Lead', value: lifecycleDistribution.lead, color: '#6b7280' },
      { name: 'Qualified', value: lifecycleDistribution.qualified, color: '#3b82f6' },
      { name: 'Opportunity', value: lifecycleDistribution.opportunity, color: '#f59e0b' },
      { name: 'Customer', value: lifecycleDistribution.customer, color: '#10b981' },
    ].filter(item => item.value > 0);

    // Formatted risk distribution for pie chart
    const riskChartData = [
      { name: 'Low Risk', value: riskDistribution.low, color: '#10b981' },
      { name: 'Medium Risk', value: riskDistribution.medium, color: '#f59e0b' },
      { name: 'High Risk', value: riskDistribution.high, color: '#ef4444' },
    ].filter(item => item.value > 0);

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalClients,
          activeOpportunities,
          conversionRate,
          avgPortfolioValue,
          totalAUM,
        },
        recentActivities,
        topOpportunities,
        alerts: {
          inactiveClients,
          highRiskClients,
          urgentFollowups,
        },
        distributions: {
          lifecycle: lifecycleDistribution,
          risk: riskDistribution,
          activityType: activityByType,
        },
        lifecycleDistribution: lifecycleChartData,
        riskDistribution: riskChartData,
        monthlyPerformance,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
