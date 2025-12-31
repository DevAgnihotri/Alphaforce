// GET /api/tasks - Return prioritized task list

import { NextResponse } from 'next/server';
import { clients, getDaysSinceContact } from '@/data/mockData';
import { calculateTaskPriority } from '@/lib/mlScoring';

interface Task {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  priority: 'high' | 'medium' | 'low';
  days_since_contact: number;
  reason: string;
  recommended_action: string;
  conversion_probability: number;
  risk_profile: string;
  lifecycle_stage: string;
  portfolio_value: number;
}

export async function GET() {
  try {
    // Generate tasks from clients using ML scoring
    const tasks: Task[] = clients.map(client => {
      const daysSinceContact = getDaysSinceContact(client.last_contact);
      const priorityResult = calculateTaskPriority(client, daysSinceContact);
      
      return {
        id: `task_${client.id}`,
        client_id: client.id,
        client_name: client.name,
        client_email: client.email,
        priority: priorityResult.priority,
        days_since_contact: daysSinceContact,
        reason: priorityResult.reason,
        recommended_action: priorityResult.recommended_action,
        conversion_probability: client.conversion_probability,
        risk_profile: client.risk_profile,
        lifecycle_stage: client.lifecycle_stage,
        portfolio_value: client.portfolio_value,
      };
    });

    // Sort by priority (high first), then by conversion probability (desc), then by days since contact (desc)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (b.conversion_probability !== a.conversion_probability) {
        return b.conversion_probability - a.conversion_probability;
      }
      return b.days_since_contact - a.days_since_contact;
    });

    return NextResponse.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
