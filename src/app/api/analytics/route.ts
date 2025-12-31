// GET /api/analytics - Return analytics data for dashboards

import { NextResponse } from 'next/server';
import { clients, activities, opportunities, investments } from '@/data/mockData';

export async function GET() {
  try {
    // Dashboard 1: Advisor Performance
    const lifecycleData = [
      { name: 'Lead', value: clients.filter(c => c.lifecycle_stage === 'lead').length, color: '#6b7280' },
      { name: 'Qualified', value: clients.filter(c => c.lifecycle_stage === 'qualified').length, color: '#3b82f6' },
      { name: 'Opportunity', value: clients.filter(c => c.lifecycle_stage === 'opportunity').length, color: '#f59e0b' },
      { name: 'Customer', value: clients.filter(c => c.lifecycle_stage === 'customer').length, color: '#10b981' },
    ];

    // Conversion rate trend (mock monthly data)
    const conversionTrend = [
      { month: 'Jul', rate: 18 },
      { month: 'Aug', rate: 22 },
      { month: 'Sep', rate: 25 },
      { month: 'Oct', rate: 28 },
      { month: 'Nov', rate: 32 },
      { month: 'Dec', rate: 35 },
    ];

    // Activities by type
    const activityByType = [
      { type: 'Call', count: activities.filter(a => a.type === 'call').length, color: '#3b82f6' },
      { type: 'Email', count: activities.filter(a => a.type === 'email').length, color: '#10b981' },
      { type: 'Meeting', count: activities.filter(a => a.type === 'meeting').length, color: '#f59e0b' },
    ];

    // Dashboard 2: Investment Insights
    const investmentPopularity = investments.map(inv => {
      const oppCount = opportunities.filter(o => o.investment_type === inv.type).length;
      return {
        name: inv.name.length > 15 ? inv.name.substring(0, 15) + '...' : inv.name,
        fullName: inv.name,
        type: inv.type,
        count: oppCount,
        color: inv.risk_level === 'low' ? '#10b981' : inv.risk_level === 'medium' ? '#f59e0b' : '#ef4444',
      };
    }).sort((a, b) => b.count - a.count).slice(0, 6);

    const riskDistribution = [
      { name: 'Low Risk', value: investments.filter(i => i.risk_level === 'low').length, color: '#10b981' },
      { name: 'Medium Risk', value: investments.filter(i => i.risk_level === 'medium').length, color: '#f59e0b' },
      { name: 'High Risk', value: investments.filter(i => i.risk_level === 'high').length, color: '#ef4444' },
    ];

    const returnsByType = [
      { type: 'Stock', avgReturn: 12.5, color: '#3b82f6' },
      { type: 'Mutual Fund', avgReturn: 8.2, color: '#10b981' },
      { type: 'Fixed Income', avgReturn: 5.8, color: '#f59e0b' },
      { type: 'ETF', avgReturn: 9.5, color: '#8b5cf6' },
    ];

    // Dashboard 3: Contact Effectiveness
    const outcomeByMethod = [
      { method: 'Call', interested: 45, notInterested: 20, invested: 15, followUp: 20 },
      { method: 'Email', interested: 30, notInterested: 35, invested: 10, followUp: 25 },
      { method: 'Meeting', interested: 55, notInterested: 10, invested: 25, followUp: 10 },
    ];

    const responseRateTrend = [
      { month: 'Jul', call: 65, email: 45, meeting: 85 },
      { month: 'Aug', call: 68, email: 48, meeting: 82 },
      { month: 'Sep', call: 72, email: 52, meeting: 88 },
      { month: 'Oct', call: 70, email: 55, meeting: 90 },
      { month: 'Nov', call: 75, email: 58, meeting: 92 },
      { month: 'Dec', call: 78, email: 60, meeting: 95 },
    ];

    // Activity outcomes distribution
    const activityOutcomes = activities.reduce((acc, act) => {
      acc[act.outcome] = (acc[act.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const outcomeData = [
      { name: 'Interested', value: activityOutcomes['interested'] || 0, color: '#10b981' },
      { name: 'Not Interested', value: activityOutcomes['not_interested'] || 0, color: '#ef4444' },
      { name: 'Invested', value: activityOutcomes['invested'] || 0, color: '#3b82f6' },
      { name: 'Follow-up', value: activityOutcomes['follow_up'] || 0, color: '#f59e0b' },
    ];

    // Summary metrics
    const totalActivities = activities.length;
    const successRate = Math.round(
      ((activityOutcomes['interested'] || 0) + (activityOutcomes['invested'] || 0)) / 
      totalActivities * 100
    );
    const avgResponseTime = 2.3; // days (mock)
    const topPerformingChannel = 'Meeting';

    return NextResponse.json({
      success: true,
      data: {
        advisorPerformance: {
          lifecycleData,
          conversionTrend,
          activityByType,
        },
        investmentInsights: {
          investmentPopularity,
          riskDistribution,
          returnsByType,
        },
        contactEffectiveness: {
          outcomeByMethod,
          responseRateTrend,
          outcomeData,
        },
        summary: {
          totalActivities,
          successRate,
          avgResponseTime,
          topPerformingChannel,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
