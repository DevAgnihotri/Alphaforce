// GET /api/tasks - Return prioritized task list

import { NextResponse } from 'next/server';
import { clients, getDaysSinceContact } from '@/data/mockData';

interface Task {
  id: string;
  clientId: string;
  clientName: string;
  email: string;
  priority: 'high' | 'medium' | 'low';
  daysSinceContact: number;
  reason: string;
  recommendedAction: string;
  conversionProbability: number;
  riskProfile: string;
}

function getPriority(daysSinceContact: number, probability: number): 'high' | 'medium' | 'low' {
  if (daysSinceContact > 14 || probability > 75) return 'high';
  if (daysSinceContact > 7 || probability > 50) return 'medium';
  return 'low';
}

function getReason(daysSinceContact: number, probability: number, riskProfile: string): string {
  const reasons: string[] = [];
  
  if (daysSinceContact > 14) reasons.push('No contact in 14+ days');
  else if (daysSinceContact > 7) reasons.push('No contact in 7+ days');
  
  if (probability > 75) reasons.push('High conversion probability');
  else if (probability > 50) reasons.push('Moderate conversion probability');
  
  if (riskProfile === 'high') reasons.push('High-risk portfolio');
  
  return reasons.length > 0 ? reasons.join(', ') : 'Regular follow-up';
}

function getRecommendedAction(preferredContact: string, daysSinceContact: number): string {
  if (daysSinceContact > 14) {
    return preferredContact === 'meeting' 
      ? 'Schedule urgent meeting' 
      : `Send urgent ${preferredContact}`;
  }
  
  switch (preferredContact) {
    case 'phone': return 'Schedule a call';
    case 'meeting': return 'Request a meeting';
    default: return 'Send follow-up email';
  }
}

export async function GET() {
  try {
    // Generate tasks from clients
    const tasks: Task[] = clients.map(client => {
      const daysSinceContact = getDaysSinceContact(client.last_contact);
      const priority = getPriority(daysSinceContact, client.conversion_probability);
      
      return {
        id: `task_${client.id}`,
        clientId: client.id,
        clientName: client.name,
        email: client.email,
        priority,
        daysSinceContact,
        reason: getReason(daysSinceContact, client.conversion_probability, client.risk_profile),
        recommendedAction: getRecommendedAction(client.preferred_contact, daysSinceContact),
        conversionProbability: client.conversion_probability,
        riskProfile: client.risk_profile,
      };
    });

    // Sort by priority (high first), then by days since contact (desc)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.daysSinceContact - a.daysSinceContact;
    });

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
