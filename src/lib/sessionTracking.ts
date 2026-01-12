// ============================================
// AlphaForce Session Tracking
// Uses sessionStorage for minimal session data
// ============================================

interface SessionData {
  sessionId: string;
  loginTime: string;
  lastActivity: string;
  pagesVisited: string[];
  actionsPerformed: number;
  tourCompleted: boolean;
}

const SESSION_KEY = 'alphaforce-session';

// Generate a simple session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Initialize or get existing session
export function initSession(): SessionData {
  if (typeof window === 'undefined') {
    return getDefaultSession();
  }

  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    try {
      const session = JSON.parse(existing) as SessionData;
      // Update last activity
      session.lastActivity = new Date().toISOString();
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } catch {
      // Invalid session, create new
    }
  }

  const newSession: SessionData = {
    sessionId: generateSessionId(),
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    pagesVisited: [],
    actionsPerformed: 0,
    tourCompleted: false,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
}

// Get default session for SSR
function getDefaultSession(): SessionData {
  return {
    sessionId: '',
    loginTime: '',
    lastActivity: '',
    pagesVisited: [],
    actionsPerformed: 0,
    tourCompleted: false,
  };
}

// Get current session
export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as SessionData;
  } catch {
    return null;
  }
}

// Track page visit
export function trackPageVisit(page: string): void {
  if (typeof window === 'undefined') return;

  const session = getSession();
  if (!session) {
    initSession();
    trackPageVisit(page);
    return;
  }

  if (!session.pagesVisited.includes(page)) {
    session.pagesVisited.push(page);
  }
  session.lastActivity = new Date().toISOString();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Track action performed
export function trackAction(): void {
  if (typeof window === 'undefined') return;

  const session = getSession();
  if (!session) return;

  session.actionsPerformed += 1;
  session.lastActivity = new Date().toISOString();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Mark tour as completed
export function markTourCompleted(): void {
  if (typeof window === 'undefined') return;

  const session = getSession();
  if (!session) return;

  session.tourCompleted = true;
  session.lastActivity = new Date().toISOString();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Get session duration in minutes
export function getSessionDuration(): number {
  const session = getSession();
  if (!session || !session.loginTime) return 0;

  const start = new Date(session.loginTime).getTime();
  const now = Date.now();
  return Math.round((now - start) / 60000);
}

// Check if session exists
export function hasActiveSession(): boolean {
  return getSession() !== null;
}

// Clear session
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

// Hook for React components
export function useSessionTracking() {
  return {
    initSession,
    getSession,
    trackPageVisit,
    trackAction,
    markTourCompleted,
    getSessionDuration,
    hasActiveSession,
    clearSession,
  };
}
