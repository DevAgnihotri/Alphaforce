// ============================================
// AlphaForce Mock Data - Salesforce Objects
// ============================================

// TypeScript Interfaces
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  income: number;
  risk_profile: 'low' | 'medium' | 'high';
  interests: string[];
  source: 'website' | 'referral' | 'ad' | 'cold_call';
  date_created: string;
  lifecycle_stage: 'lead' | 'qualified' | 'opportunity' | 'customer';
}

export interface Account {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  income: number;
  risk_profile: 'low' | 'medium' | 'high';
  portfolio_value: number;
  total_investments: number;
  lifecycle_stage: 'lead' | 'qualified' | 'opportunity' | 'customer';
  last_contact: string;
  conversion_probability: number;
  interests: string[];
  preferred_contact: 'email' | 'phone' | 'meeting';
}

export interface Opportunity {
  id: string;
  client_id: string;
  investment_type: string;
  amount: number;
  predicted_fit: number;
  probability: number;
  status: 'open' | 'won' | 'lost';
  created_date: string;
}

export interface Activity {
  id: string;
  client_id: string;
  type: 'call' | 'email' | 'meeting';
  date: string;
  outcome: 'interested' | 'not_interested' | 'invested' | 'follow_up';
  notes: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'fixed_income' | 'etf';
  risk_level: 'low' | 'medium' | 'high';
  expected_return: number;
  category: string;
  min_investment: number;
}

export interface Prediction {
  client_id: string;
  recommendations: {
    investment_id: string;
    investment_name: string;
    confidence: number;
    reason: string;
  }[];
}

// ============================================
// Mock Investment Products
// ============================================
export const investments: Investment[] = [
  {
    id: 'inv_001',
    name: 'TechGrowth Stock Fund',
    type: 'stock',
    risk_level: 'high',
    expected_return: 15.5,
    category: 'Technology',
    min_investment: 5000,
  },
  {
    id: 'inv_002',
    name: 'Balanced Growth MF',
    type: 'mutual_fund',
    risk_level: 'medium',
    expected_return: 10.2,
    category: 'Diversified',
    min_investment: 2500,
  },
  {
    id: 'inv_003',
    name: 'Treasury Bond Fund',
    type: 'fixed_income',
    risk_level: 'low',
    expected_return: 4.5,
    category: 'Government',
    min_investment: 1000,
  },
  {
    id: 'inv_004',
    name: 'Healthcare Innovation ETF',
    type: 'etf',
    risk_level: 'high',
    expected_return: 14.0,
    category: 'Healthcare',
    min_investment: 3000,
  },
  {
    id: 'inv_005',
    name: 'Blue Chip Dividend Fund',
    type: 'stock',
    risk_level: 'medium',
    expected_return: 8.5,
    category: 'Large Cap',
    min_investment: 5000,
  },
  {
    id: 'inv_006',
    name: 'Corporate Bond Plus',
    type: 'fixed_income',
    risk_level: 'low',
    expected_return: 5.8,
    category: 'Corporate',
    min_investment: 2000,
  },
  {
    id: 'inv_007',
    name: 'Emerging Markets Growth',
    type: 'mutual_fund',
    risk_level: 'high',
    expected_return: 18.0,
    category: 'International',
    min_investment: 4000,
  },
  {
    id: 'inv_008',
    name: 'Real Estate Investment Trust',
    type: 'etf',
    risk_level: 'medium',
    expected_return: 9.5,
    category: 'Real Estate',
    min_investment: 3500,
  },
];

// ============================================
// Mock Clients (Accounts)
// ============================================
export const clients: Account[] = [
  {
    id: 'client_001',
    client_id: 'client_001',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0101',
    age: 28,
    income: 85000,
    risk_profile: 'medium',
    portfolio_value: 45000,
    total_investments: 3,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-28',
    conversion_probability: 75,
    interests: ['technology', 'growth stocks'],
    preferred_contact: 'email',
  },
  {
    id: 'client_002',
    client_id: 'client_002',
    name: 'Robert Chen',
    email: 'robert.chen@email.com',
    phone: '+1-555-0102',
    age: 45,
    income: 150000,
    risk_profile: 'high',
    portfolio_value: 250000,
    total_investments: 6,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-15',
    conversion_probability: 85,
    interests: ['emerging markets', 'tech stocks', 'healthcare'],
    preferred_contact: 'phone',
  },
  {
    id: 'client_003',
    client_id: 'client_003',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0103',
    age: 55,
    income: 120000,
    risk_profile: 'low',
    portfolio_value: 180000,
    total_investments: 4,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-10',
    conversion_probability: 60,
    interests: ['bonds', 'fixed income', 'dividends'],
    preferred_contact: 'meeting',
  },
  {
    id: 'client_004',
    client_id: 'client_004',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+1-555-0104',
    age: 35,
    income: 95000,
    risk_profile: 'medium',
    portfolio_value: 65000,
    total_investments: 2,
    lifecycle_stage: 'opportunity',
    last_contact: '2025-12-20',
    conversion_probability: 70,
    interests: ['real estate', 'balanced funds'],
    preferred_contact: 'email',
  },
  {
    id: 'client_005',
    client_id: 'client_005',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@email.com',
    phone: '+1-555-0105',
    age: 32,
    income: 110000,
    risk_profile: 'high',
    portfolio_value: 85000,
    total_investments: 4,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-05',
    conversion_probability: 80,
    interests: ['technology', 'innovation', 'growth'],
    preferred_contact: 'phone',
  },
  {
    id: 'client_006',
    client_id: 'client_006',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0106',
    age: 62,
    income: 200000,
    risk_profile: 'low',
    portfolio_value: 450000,
    total_investments: 5,
    lifecycle_stage: 'customer',
    last_contact: '2025-11-28',
    conversion_probability: 55,
    interests: ['bonds', 'treasury', 'capital preservation'],
    preferred_contact: 'meeting',
  },
  {
    id: 'client_007',
    client_id: 'client_007',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1-555-0107',
    age: 29,
    income: 75000,
    risk_profile: 'medium',
    portfolio_value: 32000,
    total_investments: 2,
    lifecycle_stage: 'qualified',
    last_contact: '2025-12-22',
    conversion_probability: 65,
    interests: ['etfs', 'diversified portfolios'],
    preferred_contact: 'email',
  },
  {
    id: 'client_008',
    client_id: 'client_008',
    name: 'David Martinez',
    email: 'david.martinez@email.com',
    phone: '+1-555-0108',
    age: 41,
    income: 130000,
    risk_profile: 'high',
    portfolio_value: 175000,
    total_investments: 5,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-01',
    conversion_probability: 78,
    interests: ['emerging markets', 'tech', 'high growth'],
    preferred_contact: 'phone',
  },
  {
    id: 'client_009',
    client_id: 'client_009',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '+1-555-0109',
    age: 38,
    income: 105000,
    risk_profile: 'medium',
    portfolio_value: 95000,
    total_investments: 3,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-18',
    conversion_probability: 72,
    interests: ['healthcare', 'blue chip', 'dividends'],
    preferred_contact: 'email',
  },
  {
    id: 'client_010',
    client_id: 'client_010',
    name: 'Christopher Taylor',
    email: 'chris.taylor@email.com',
    phone: '+1-555-0110',
    age: 50,
    income: 175000,
    risk_profile: 'medium',
    portfolio_value: 320000,
    total_investments: 7,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-12',
    conversion_probability: 82,
    interests: ['real estate', 'diversified', 'income'],
    preferred_contact: 'meeting',
  },
  {
    id: 'client_011',
    client_id: 'client_011',
    name: 'Amanda White',
    email: 'amanda.white@email.com',
    phone: '+1-555-0111',
    age: 26,
    income: 65000,
    risk_profile: 'high',
    portfolio_value: 18000,
    total_investments: 1,
    lifecycle_stage: 'lead',
    last_contact: '2025-12-29',
    conversion_probability: 45,
    interests: ['technology', 'startups', 'growth'],
    preferred_contact: 'email',
  },
  {
    id: 'client_012',
    client_id: 'client_012',
    name: 'Daniel Harris',
    email: 'daniel.harris@email.com',
    phone: '+1-555-0112',
    age: 58,
    income: 220000,
    risk_profile: 'low',
    portfolio_value: 520000,
    total_investments: 6,
    lifecycle_stage: 'customer',
    last_contact: '2025-11-20',
    conversion_probability: 50,
    interests: ['bonds', 'fixed income', 'preservation'],
    preferred_contact: 'phone',
  },
  {
    id: 'client_013',
    client_id: 'client_013',
    name: 'Jessica Clark',
    email: 'jessica.clark@email.com',
    phone: '+1-555-0113',
    age: 33,
    income: 88000,
    risk_profile: 'medium',
    portfolio_value: 55000,
    total_investments: 3,
    lifecycle_stage: 'opportunity',
    last_contact: '2025-12-25',
    conversion_probability: 68,
    interests: ['balanced funds', 'etfs'],
    preferred_contact: 'email',
  },
  {
    id: 'client_014',
    client_id: 'client_014',
    name: 'Kevin Robinson',
    email: 'kevin.robinson@email.com',
    phone: '+1-555-0114',
    age: 44,
    income: 145000,
    risk_profile: 'high',
    portfolio_value: 210000,
    total_investments: 5,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-08',
    conversion_probability: 76,
    interests: ['tech stocks', 'innovation', 'international'],
    preferred_contact: 'phone',
  },
  {
    id: 'client_015',
    client_id: 'client_015',
    name: 'Michelle Adams',
    email: 'michelle.adams@email.com',
    phone: '+1-555-0115',
    age: 48,
    income: 160000,
    risk_profile: 'medium',
    portfolio_value: 280000,
    total_investments: 4,
    lifecycle_stage: 'customer',
    last_contact: '2025-12-03',
    conversion_probability: 74,
    interests: ['real estate', 'healthcare', 'dividends'],
    preferred_contact: 'meeting',
  },
];

// ============================================
// Mock Activities
// ============================================
export const activities: Activity[] = [
  { id: 'act_001', client_id: 'client_001', type: 'email', date: '2025-12-28', outcome: 'interested', notes: 'Discussed Q4 tech performance' },
  { id: 'act_002', client_id: 'client_001', type: 'call', date: '2025-12-20', outcome: 'follow_up', notes: 'Needs more info on mutual funds' },
  { id: 'act_003', client_id: 'client_002', type: 'call', date: '2025-12-15', outcome: 'invested', notes: 'Added $25K to emerging markets' },
  { id: 'act_004', client_id: 'client_002', type: 'meeting', date: '2025-12-01', outcome: 'interested', notes: 'Quarterly portfolio review' },
  { id: 'act_005', client_id: 'client_003', type: 'meeting', date: '2025-12-10', outcome: 'interested', notes: 'Discussed fixed income options' },
  { id: 'act_006', client_id: 'client_003', type: 'email', date: '2025-11-25', outcome: 'follow_up', notes: 'Sent bond fund comparison' },
  { id: 'act_007', client_id: 'client_004', type: 'email', date: '2025-12-20', outcome: 'interested', notes: 'Initial portfolio proposal sent' },
  { id: 'act_008', client_id: 'client_005', type: 'call', date: '2025-12-05', outcome: 'invested', notes: 'Increased tech allocation by 15%' },
  { id: 'act_009', client_id: 'client_006', type: 'meeting', date: '2025-11-28', outcome: 'interested', notes: 'Annual retirement planning review' },
  { id: 'act_010', client_id: 'client_007', type: 'email', date: '2025-12-22', outcome: 'interested', notes: 'Sent ETF introduction materials' },
  { id: 'act_011', client_id: 'client_008', type: 'call', date: '2025-12-01', outcome: 'follow_up', notes: 'Wants to discuss emerging markets' },
  { id: 'act_012', client_id: 'client_009', type: 'email', date: '2025-12-18', outcome: 'interested', notes: 'Healthcare sector analysis shared' },
  { id: 'act_013', client_id: 'client_010', type: 'meeting', date: '2025-12-12', outcome: 'invested', notes: 'Added REIT position' },
  { id: 'act_014', client_id: 'client_011', type: 'email', date: '2025-12-29', outcome: 'interested', notes: 'First contact - lead qualification' },
  { id: 'act_015', client_id: 'client_012', type: 'call', date: '2025-11-20', outcome: 'not_interested', notes: 'Satisfied with current allocation' },
  { id: 'act_016', client_id: 'client_013', type: 'email', date: '2025-12-25', outcome: 'interested', notes: 'Follow-up on balanced fund proposal' },
  { id: 'act_017', client_id: 'client_014', type: 'call', date: '2025-12-08', outcome: 'invested', notes: 'Added international exposure' },
  { id: 'act_018', client_id: 'client_015', type: 'meeting', date: '2025-12-03', outcome: 'follow_up', notes: 'Needs time to consider REIT options' },
];

// ============================================
// Mock Opportunities
// ============================================
export const opportunities: Opportunity[] = [
  { id: 'opp_001', client_id: 'client_001', investment_type: 'TechGrowth Stock Fund', amount: 15000, predicted_fit: 75, probability: 70, status: 'open', created_date: '2025-12-28' },
  { id: 'opp_002', client_id: 'client_002', investment_type: 'Emerging Markets Growth', amount: 50000, predicted_fit: 90, probability: 85, status: 'open', created_date: '2025-12-15' },
  { id: 'opp_003', client_id: 'client_004', investment_type: 'Real Estate Investment Trust', amount: 25000, predicted_fit: 80, probability: 65, status: 'open', created_date: '2025-12-20' },
  { id: 'opp_004', client_id: 'client_007', investment_type: 'Balanced Growth MF', amount: 10000, predicted_fit: 70, probability: 55, status: 'open', created_date: '2025-12-22' },
  { id: 'opp_005', client_id: 'client_011', investment_type: 'TechGrowth Stock Fund', amount: 8000, predicted_fit: 65, probability: 40, status: 'open', created_date: '2025-12-29' },
  { id: 'opp_006', client_id: 'client_013', investment_type: 'Balanced Growth MF', amount: 20000, predicted_fit: 75, probability: 60, status: 'open', created_date: '2025-12-25' },
];

// ============================================
// Client Portfolio Holdings (which investments each client has)
// ============================================
export interface PortfolioHolding {
  client_id: string;
  investment_id: string;
  amount_invested: number;
  current_value: number;
  purchase_date: string;
  performance: number; // percentage gain/loss
}

export const portfolioHoldings: PortfolioHolding[] = [
  { client_id: 'client_001', investment_id: 'inv_001', amount_invested: 15000, current_value: 17250, purchase_date: '2025-06-15', performance: 15 },
  { client_id: 'client_001', investment_id: 'inv_002', amount_invested: 20000, current_value: 21800, purchase_date: '2025-03-10', performance: 9 },
  { client_id: 'client_001', investment_id: 'inv_005', amount_invested: 10000, current_value: 10850, purchase_date: '2025-09-01', performance: 8.5 },
  { client_id: 'client_002', investment_id: 'inv_001', amount_invested: 50000, current_value: 58500, purchase_date: '2025-01-20', performance: 17 },
  { client_id: 'client_002', investment_id: 'inv_004', amount_invested: 40000, current_value: 46000, purchase_date: '2025-04-15', performance: 15 },
  { client_id: 'client_002', investment_id: 'inv_007', amount_invested: 60000, current_value: 72000, purchase_date: '2025-02-10', performance: 20 },
  { client_id: 'client_003', investment_id: 'inv_003', amount_invested: 80000, current_value: 83600, purchase_date: '2024-11-01', performance: 4.5 },
  { client_id: 'client_003', investment_id: 'inv_006', amount_invested: 60000, current_value: 63480, purchase_date: '2025-01-15', performance: 5.8 },
  { client_id: 'client_005', investment_id: 'inv_001', amount_invested: 35000, current_value: 40250, purchase_date: '2025-05-20', performance: 15 },
  { client_id: 'client_005', investment_id: 'inv_004', amount_invested: 25000, current_value: 28500, purchase_date: '2025-07-10', performance: 14 },
  { client_id: 'client_006', investment_id: 'inv_003', amount_invested: 200000, current_value: 209000, purchase_date: '2024-06-01', performance: 4.5 },
  { client_id: 'client_006', investment_id: 'inv_006', amount_invested: 150000, current_value: 158700, purchase_date: '2024-09-15', performance: 5.8 },
  { client_id: 'client_010', investment_id: 'inv_008', amount_invested: 100000, current_value: 109500, purchase_date: '2025-03-01', performance: 9.5 },
  { client_id: 'client_010', investment_id: 'inv_005', amount_invested: 80000, current_value: 86800, purchase_date: '2025-05-10', performance: 8.5 },
];

// ============================================
// Helper Functions
// ============================================
export const getClientById = (id: string): Account | undefined => {
  return clients.find(client => client.id === id);
};

export const getClientActivities = (clientId: string): Activity[] => {
  return activities.filter(activity => activity.client_id === clientId);
};

export const getClientPortfolio = (clientId: string): PortfolioHolding[] => {
  return portfolioHoldings.filter(holding => holding.client_id === clientId);
};

export const getClientOpportunities = (clientId: string): Opportunity[] => {
  return opportunities.filter(opp => opp.client_id === clientId);
};

export const getInvestmentById = (id: string): Investment | undefined => {
  return investments.find(inv => inv.id === id);
};

export const getDaysSinceContact = (lastContact: string): number => {
  const today = new Date();
  const contactDate = new Date(lastContact);
  const diffTime = Math.abs(today.getTime() - contactDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
