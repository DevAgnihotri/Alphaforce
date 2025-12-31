/**
 * ML Scoring Module
 * Rule-based scoring for investment recommendations
 * 
 * Scoring Logic:
 * 1. Match risk tolerance to investment type
 * 2. Favor investments client succeeded with before
 * 3. Consider age and income bracket
 * 4. Factor in interests/preferences
 */

import { Account, Investment, PortfolioHolding, investments } from '@/data/mockData';

export interface Recommendation {
  investment_id: string;
  investment_name: string;
  investment_type: string;
  confidence: number;
  reason: string;
  expected_return: number;
  risk_level: string;
}

export interface ScoringResult {
  client_id: string;
  recommendations: Recommendation[];
  overall_score: number;
  scoring_factors: {
    risk_match: number;
    interest_match: number;
    age_suitability: number;
    income_suitability: number;
    past_success: number;
  };
}

// Risk matching scores
const RISK_MATCH_SCORES: Record<string, Record<string, number>> = {
  low: {
    fixed_income: 100,
    bond: 90,
    balanced: 70,
    dividend: 80,
    mutual_fund: 60,
    stock: 20,
    crypto: 0,
  },
  medium: {
    balanced: 100,
    mutual_fund: 90,
    dividend: 85,
    stock: 70,
    fixed_income: 60,
    bond: 60,
    crypto: 30,
  },
  high: {
    stock: 100,
    mutual_fund: 80,
    balanced: 60,
    crypto: 50,
    dividend: 40,
    fixed_income: 20,
    bond: 10,
  },
};

// Interest matching
const INTEREST_INVESTMENT_MAP: Record<string, string[]> = {
  technology: ['stock', 'mutual_fund'],
  healthcare: ['stock', 'mutual_fund'],
  growth: ['stock', 'mutual_fund', 'balanced'],
  income: ['dividend', 'fixed_income', 'bond'],
  dividends: ['dividend', 'fixed_income'],
  stability: ['fixed_income', 'bond', 'balanced'],
  real_estate: ['balanced', 'mutual_fund'],
  international: ['stock', 'mutual_fund'],
  emerging_markets: ['stock', 'mutual_fund'],
  blue_chip: ['stock', 'dividend'],
};

// Age-based suitability (younger = more risk tolerance)
function getAgeSuitability(age: number, investmentRisk: string): number {
  if (age < 35) {
    // Young: prefer growth
    if (investmentRisk === 'high') return 90;
    if (investmentRisk === 'medium') return 70;
    return 50;
  } else if (age < 50) {
    // Middle: balanced
    if (investmentRisk === 'medium') return 90;
    if (investmentRisk === 'high') return 60;
    return 70;
  } else if (age < 65) {
    // Pre-retirement: moderate
    if (investmentRisk === 'medium') return 80;
    if (investmentRisk === 'low') return 90;
    return 40;
  } else {
    // Retirement: low risk
    if (investmentRisk === 'low') return 100;
    if (investmentRisk === 'medium') return 50;
    return 20;
  }
}

// Income-based suitability
function getIncomeSuitability(income: number, minInvestment: number): number {
  const ratio = income / (minInvestment * 12);
  if (ratio > 10) return 100;
  if (ratio > 5) return 80;
  if (ratio > 2) return 60;
  if (ratio > 1) return 40;
  return 20;
}

// Check past success with similar investments
function getPastSuccessScore(
  portfolio: PortfolioHolding[],
  investmentType: string,
  allInvestments: Investment[]
): number {
  if (portfolio.length === 0) return 50; // Neutral for new clients
  
  const relevantHoldings = portfolio.filter((h) => {
    const inv = allInvestments.find((i) => i.id === h.investment_id);
    return inv && inv.type === investmentType;
  });
  
  if (relevantHoldings.length === 0) return 40; // No experience
  
  const avgPerformance =
    relevantHoldings.reduce((sum, h) => sum + h.performance, 0) / relevantHoldings.length;
  
  if (avgPerformance > 15) return 100;
  if (avgPerformance > 10) return 85;
  if (avgPerformance > 5) return 70;
  if (avgPerformance > 0) return 55;
  return 30; // Negative performance
}

// Generate reason text
function generateReason(
  client: Account,
  investment: Investment,
  scores: { risk: number; interest: number; age: number; income: number; past: number }
): string {
  const reasons: string[] = [];
  
  if (scores.risk > 80) {
    reasons.push(`${investment.risk_level} risk matches ${client.risk_profile} tolerance`);
  }
  
  if (scores.interest > 70) {
    const matchingInterests = client.interests.filter((i) =>
      INTEREST_INVESTMENT_MAP[i]?.includes(investment.type)
    );
    if (matchingInterests.length > 0) {
      reasons.push(`aligns with interest in ${matchingInterests.join(', ')}`);
    }
  }
  
  if (scores.age > 80) {
    reasons.push(`age-appropriate investment strategy`);
  }
  
  if (scores.past > 70) {
    reasons.push(`positive past performance in similar investments`);
  }
  
  if (investment.expected_return) {
    reasons.push(`expected ${investment.expected_return} annual return`);
  }
  
  return reasons.length > 0
    ? reasons.join('; ')
    : `Suitable ${investment.risk_level}-risk option for portfolio diversification`;
}

// Main scoring function
export function scoreInvestmentsForClient(
  client: Account,
  portfolio: PortfolioHolding[],
  availableInvestments: Investment[] = investments
): ScoringResult {
  const scoredInvestments: {
    investment: Investment;
    totalScore: number;
    scores: { risk: number; interest: number; age: number; income: number; past: number };
  }[] = [];
  
  for (const investment of availableInvestments) {
    // Risk match score
    const riskScores = RISK_MATCH_SCORES[client.risk_profile] || RISK_MATCH_SCORES.medium;
    const riskScore = riskScores[investment.type] || 50;
    
    // Interest match score
    let interestScore = 50;
    for (const interest of client.interests) {
      const mappedTypes = INTEREST_INVESTMENT_MAP[interest] || [];
      if (mappedTypes.includes(investment.type)) {
        interestScore = Math.max(interestScore, 80);
        if (mappedTypes[0] === investment.type) {
          interestScore = 90;
        }
      }
    }
    
    // Age suitability
    const ageScore = getAgeSuitability(client.age, investment.risk_level);
    
    // Income suitability
    const incomeScore = getIncomeSuitability(client.income, investment.min_investment);
    
    // Past success
    const pastScore = getPastSuccessScore(portfolio, investment.type, availableInvestments);
    
    // Weighted total score
    const totalScore = 
      riskScore * 0.30 +
      interestScore * 0.25 +
      ageScore * 0.20 +
      incomeScore * 0.10 +
      pastScore * 0.15;
    
    scoredInvestments.push({
      investment,
      totalScore,
      scores: {
        risk: riskScore,
        interest: interestScore,
        age: ageScore,
        income: incomeScore,
        past: pastScore,
      },
    });
  }
  
  // Sort by score descending
  scoredInvestments.sort((a, b) => b.totalScore - a.totalScore);
  
  // Take top 5 recommendations
  const topRecommendations = scoredInvestments.slice(0, 5);
  
  // Normalize confidence to sum roughly to 100 for top 3
  const top3Total = topRecommendations.slice(0, 3).reduce((sum, r) => sum + r.totalScore, 0);
  
  const recommendations: Recommendation[] = topRecommendations.map((r, index) => ({
    investment_id: r.investment.id,
    investment_name: r.investment.name,
    investment_type: r.investment.type,
    confidence: index < 3
      ? Math.round((r.totalScore / top3Total) * 100)
      : Math.round(r.totalScore),
    reason: generateReason(client, r.investment, r.scores),
    expected_return: r.investment.expected_return,
    risk_level: r.investment.risk_level,
  }));
  
  // Calculate overall scoring factors (average of top 3)
  const avgScores = {
    risk_match: Math.round(
      topRecommendations.slice(0, 3).reduce((s, r) => s + r.scores.risk, 0) / 3
    ),
    interest_match: Math.round(
      topRecommendations.slice(0, 3).reduce((s, r) => s + r.scores.interest, 0) / 3
    ),
    age_suitability: Math.round(
      topRecommendations.slice(0, 3).reduce((s, r) => s + r.scores.age, 0) / 3
    ),
    income_suitability: Math.round(
      topRecommendations.slice(0, 3).reduce((s, r) => s + r.scores.income, 0) / 3
    ),
    past_success: Math.round(
      topRecommendations.slice(0, 3).reduce((s, r) => s + r.scores.past, 0) / 3
    ),
  };
  
  return {
    client_id: client.id,
    recommendations,
    overall_score: Math.round(
      topRecommendations.slice(0, 3).reduce((s, r) => s + r.totalScore, 0) / 3
    ),
    scoring_factors: avgScores,
  };
}

// Task prioritization scoring
export interface TaskPriorityResult {
  client_id: string;
  priority: 'high' | 'medium' | 'low';
  priority_score: number;
  reason: string;
  recommended_action: string;
}

export function calculateTaskPriority(
  client: Account,
  daysSinceContact: number
): TaskPriorityResult {
  let score = 0;
  const reasons: string[] = [];
  
  // Days since contact (most important)
  if (daysSinceContact > 14) {
    score += 40;
    reasons.push('no contact in 2+ weeks');
  } else if (daysSinceContact > 7) {
    score += 25;
    reasons.push('no contact in 1+ week');
  } else if (daysSinceContact > 3) {
    score += 10;
  }
  
  // Conversion probability
  if (client.conversion_probability > 70) {
    score += 30;
    reasons.push('high conversion probability');
  } else if (client.conversion_probability > 50) {
    score += 15;
    reasons.push('moderate conversion probability');
  }
  
  // Portfolio value (high value = priority)
  if (client.portfolio_value > 500000) {
    score += 15;
    reasons.push('high-value client');
  } else if (client.portfolio_value > 200000) {
    score += 8;
  }
  
  // Lifecycle stage
  if (client.lifecycle_stage === 'opportunity') {
    score += 20;
    reasons.push('active opportunity');
  } else if (client.lifecycle_stage === 'qualified') {
    score += 10;
    reasons.push('qualified lead');
  }
  
  // Determine priority level
  let priority: 'high' | 'medium' | 'low';
  if (score >= 50) {
    priority = 'high';
  } else if (score >= 25) {
    priority = 'medium';
  } else {
    priority = 'low';
  }
  
  // Recommend action
  let recommended_action = 'email';
  if (priority === 'high') {
    recommended_action = 'call';
  } else if (client.preferred_contact === 'email') {
    recommended_action = 'email';
  } else if (client.preferred_contact === 'phone') {
    recommended_action = 'call';
  }
  
  return {
    client_id: client.id,
    priority,
    priority_score: score,
    reason: reasons.length > 0 ? reasons.join(', ') : 'routine follow-up',
    recommended_action,
  };
}
