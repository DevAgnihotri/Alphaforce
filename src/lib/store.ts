// ============================================
// AlphaForce Zustand State Management
// ============================================

import { create } from 'zustand';
import { 
  Account, 
  Activity, 
  Investment, 
  Prediction,
  clients as mockClients,
  activities as mockActivities,
  investments as mockInvestments,
} from '@/data/mockData';

// ============================================
// Client Store
// ============================================
interface ClientState {
  clients: Account[];
  selectedClientId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setClients: (clients: Account[]) => void;
  addClient: (client: Account) => void;
  updateClient: (id: string, updates: Partial<Account>) => void;
  setSelectedClient: (id: string | null) => void;
  getClientById: (id: string) => Account | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: mockClients,
  selectedClientId: null,
  isLoading: false,
  error: null,

  setClients: (clients) => set({ clients }),
  
  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client] 
  })),
  
  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map((client) =>
      client.id === id ? { ...client, ...updates } : client
    ),
  })),
  
  setSelectedClient: (id) => set({ selectedClientId: id }),
  
  getClientById: (id) => get().clients.find((client) => client.id === id),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));

// ============================================
// Activity Store
// ============================================
interface ActivityState {
  activities: Activity[];
  
  // Actions
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  getClientActivities: (clientId: string) => Activity[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: mockActivities,

  setActivities: (activities) => set({ activities }),
  
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities],
  })),
  
  getClientActivities: (clientId) => 
    get().activities.filter((a) => a.client_id === clientId),
}));

// ============================================
// Investment Store
// ============================================
interface InvestmentState {
  investments: Investment[];
  
  // Actions
  setInvestments: (investments: Investment[]) => void;
  getInvestmentById: (id: string) => Investment | undefined;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  investments: mockInvestments,

  setInvestments: (investments) => set({ investments }),
  
  getInvestmentById: (id) => get().investments.find((inv) => inv.id === id),
}));

// ============================================
// Task Store (Prioritized Contact List)
// ============================================
export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  priority: 'high' | 'medium' | 'low';
  daysSinceContact: number;
  reason: string;
  recommendedAction: string;
  conversionProbability: number;
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'high' | 'medium' | 'low';
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setFilter: (filter: 'all' | 'high' | 'medium' | 'low') => void;
  getFilteredTasks: () => Task[];
  markTaskComplete: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filter: 'all',

  setTasks: (tasks) => set({ tasks }),
  
  setFilter: (filter) => set({ filter }),
  
  getFilteredTasks: () => {
    const { tasks, filter } = get();
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.priority === filter);
  },
  
  markTaskComplete: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId),
  })),
}));

// ============================================
// Prediction Store
// ============================================
interface PredictionState {
  predictions: Record<string, Prediction>;
  isCalculating: boolean;
  
  // Actions
  setPrediction: (clientId: string, prediction: Prediction) => void;
  getPrediction: (clientId: string) => Prediction | undefined;
  clearPredictions: () => void;
  setCalculating: (calculating: boolean) => void;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  predictions: {},
  isCalculating: false,

  setPrediction: (clientId, prediction) => set((state) => ({
    predictions: { ...state.predictions, [clientId]: prediction },
  })),
  
  getPrediction: (clientId) => get().predictions[clientId],
  
  clearPredictions: () => set({ predictions: {} }),
  
  setCalculating: (calculating) => set({ isCalculating: calculating }),
}));

// ============================================
// Dashboard Store (Filters & Stats)
// ============================================
interface DashboardState {
  dateRange: { start: string; end: string };
  riskFilter: 'all' | 'low' | 'medium' | 'high';
  lifecycleFilter: 'all' | 'lead' | 'qualified' | 'opportunity' | 'customer';
  
  // Actions
  setDateRange: (range: { start: string; end: string }) => void;
  setRiskFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
  setLifecycleFilter: (filter: 'all' | 'lead' | 'qualified' | 'opportunity' | 'customer') => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dateRange: { 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
  riskFilter: 'all',
  lifecycleFilter: 'all',

  setDateRange: (range) => set({ dateRange: range }),
  
  setRiskFilter: (filter) => set({ riskFilter: filter }),
  
  setLifecycleFilter: (filter) => set({ lifecycleFilter: filter }),
  
  resetFilters: () => set({
    riskFilter: 'all',
    lifecycleFilter: 'all',
  }),
}));

// ============================================
// UI Store (Global UI State)
// ============================================
interface UIState {
  sidebarOpen: boolean;
  activityModalOpen: boolean;
  selectedModalClientId: string | null;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openActivityModal: (clientId: string) => void;
  closeActivityModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activityModalOpen: false,
  selectedModalClientId: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  openActivityModal: (clientId) => set({ 
    activityModalOpen: true, 
    selectedModalClientId: clientId 
  }),
  
  closeActivityModal: () => set({ 
    activityModalOpen: false, 
    selectedModalClientId: null 
  }),
}));
