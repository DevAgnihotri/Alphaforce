'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard,
  Users,
  Target,
  ListTodo,
  BarChart3,
  Brain,
  Sparkles,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: React.ReactNode;
  action?: {
    label: string;
    href?: string;
  };
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AlphaForce! 🎉',
    description: 'Hi Saul! Ready to supercharge your financial advisory practice? Let me show you around AlphaForce - your AI-powered force multiplier.',
    position: 'center',
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'This is your command center. Quickly navigate between Dashboard, Clients, Opportunities, Tasks, Analytics, and AlphaDesk - your AI assistant.',
    target: 'aside',
    position: 'right',
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Your Dashboard shows key metrics at a glance: total clients, active opportunities, conversion rates, and AUM. Track alerts for clients needing attention.',
    target: '[data-tour="metrics"]',
    position: 'bottom',
    icon: <LayoutDashboard className="w-6 h-6" />,
    action: {
      label: 'View Dashboard',
      href: '/dashboard',
    },
  },
  {
    id: 'clients',
    title: 'Client Management',
    description: 'View and manage all your clients in one place. Filter by risk profile, lifecycle stage, and search by name. Click any client to see their full profile and AI insights.',
    target: '[data-tour="clients-nav"]',
    position: 'right',
    icon: <Users className="w-6 h-6" />,
    action: {
      label: 'View Clients',
      href: '/clients',
    },
  },
  {
    id: 'opportunities',
    title: 'Opportunity Tracking',
    description: 'Track all your sales opportunities with AI-powered probability scoring. See which deals are most likely to close and prioritize your outreach accordingly.',
    target: '[data-tour="opportunities-nav"]',
    position: 'right',
    icon: <Target className="w-6 h-6" />,
    action: {
      label: 'View Opportunities',
      href: '/opportunities',
    },
  },
  {
    id: 'tasks',
    title: 'Task Management',
    description: 'Never miss a follow-up! Your tasks are automatically prioritized based on client value and urgency. Complete tasks to keep your pipeline healthy.',
    target: '[data-tour="tasks-nav"]',
    position: 'right',
    icon: <ListTodo className="w-6 h-6" />,
    action: {
      label: 'View Tasks',
      href: '/tasks',
    },
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Deep dive into your performance metrics. View trends, client distribution, and portfolio analytics powered by Tableau-grade visualizations.',
    target: '[data-tour="analytics-nav"]',
    position: 'right',
    icon: <BarChart3 className="w-6 h-6" />,
    action: {
      label: 'View Analytics',
      href: '/analytics',
    },
  },
  {
    id: 'alphadesk',
    title: 'AlphaDesk - Your AI Assistant',
    description: 'This is where the magic happens! AlphaDesk uses AI to analyze your clients, generate personalized insights, and suggest the best actions to take. It\'s like having a super-smart assistant.',
    target: '[data-tour="alphadesk-nav"]',
    position: 'right',
    icon: <Brain className="w-6 h-6" />,
    action: {
      label: 'Try AlphaDesk',
      href: '/alphadesk',
    },
  },
  {
    id: 'ai-insights',
    title: 'AI-Powered Recommendations',
    description: 'Throughout AlphaForce, you\'ll see AI insights marked with ✨. These are personalized recommendations based on client data, market trends, and behavioral patterns.',
    position: 'center',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'You now know the essentials of AlphaForce. Start by exploring your Dashboard, check on your clients, and let the AI help you prioritize your day. Better call Saul... for results!',
    position: 'center',
    icon: <CheckCircle2 className="w-6 h-6" />,
    action: {
      label: 'Start Exploring',
      href: '/dashboard',
    },
  },
];

interface SpotlightProps {
  targetRect: DOMRect | null;
  isCenter: boolean;
}

function Spotlight({ targetRect, isCenter }: SpotlightProps) {
  if (isCenter || !targetRect) {
    return (
      <div className="fixed inset-0 bg-black/70 z-9998" />
    );
  }

  const padding = 8;
  const borderRadius = 12;

  return (
    <div className="fixed inset-0 z-9998 pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={targetRect.left - padding}
              y={targetRect.top - padding}
              width={targetRect.width + padding * 2}
              height={targetRect.height + padding * 2}
              rx={borderRadius}
              ry={borderRadius}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>
      {/* Highlight border */}
      <div
        className="absolute border-2 border-cyan-400 rounded-xl shadow-lg shadow-cyan-400/30 animate-pulse"
        style={{
          left: targetRect.left - padding,
          top: targetRect.top - padding,
          width: targetRect.width + padding * 2,
          height: targetRect.height + padding * 2,
        }}
      />
    </div>
  );
}

interface TooltipBoxProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onAction?: () => void;
}

function TooltipBox({ 
  step, 
  currentStep, 
  totalSteps, 
  targetRect, 
  onNext, 
  onPrev, 
  onSkip,
  onAction 
}: TooltipBoxProps) {
  const isCenter = step.position === 'center';
  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  // Calculate position
  let style: React.CSSProperties = {};
  
  if (isCenter || !targetRect) {
    style = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  } else {
    const gap = 16;
    switch (step.position) {
      case 'right':
        style = {
          position: 'fixed',
          top: Math.max(20, Math.min(targetRect.top, window.innerHeight - 320)),
          left: targetRect.right + gap,
        };
        break;
      case 'left':
        style = {
          position: 'fixed',
          top: Math.max(20, Math.min(targetRect.top, window.innerHeight - 320)),
          right: window.innerWidth - targetRect.left + gap,
        };
        break;
      case 'bottom':
        style = {
          position: 'fixed',
          top: targetRect.bottom + gap,
          left: Math.max(20, targetRect.left),
        };
        break;
      case 'top':
        style = {
          position: 'fixed',
          bottom: window.innerHeight - targetRect.top + gap,
          left: Math.max(20, targetRect.left),
        };
        break;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      className="z-9999 w-95 max-w-[calc(100vw-40px)]"
      style={style}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
              {step.icon}
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">
                Step {currentStep + 1} of {totalSteps}
              </p>
              <h3 className="text-white font-semibold text-lg leading-tight">
                {step.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {step.description}
          </p>

          {step.action && (
            <Button
              onClick={onAction}
              variant="outline"
              size="sm"
              className="mt-3 text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            >
              {step.action.label}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-cyan-500 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                onClick={onPrev}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              onClick={onNext}
              size="sm"
              className="gap-1 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {isLast ? 'Finish' : 'Next'}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Arrow pointer */}
      {!isCenter && targetRect && (
        <div
          className={cn(
            "absolute w-4 h-4 bg-white border-gray-200 transform rotate-45",
            step.position === 'right' && "-left-2 top-6 border-l border-b",
            step.position === 'left' && "-right-2 top-6 border-r border-t",
            step.position === 'bottom' && "-top-2 left-6 border-l border-t",
            step.position === 'top' && "-bottom-2 left-6 border-r border-b",
          )}
        />
      )}
    </motion.div>
  );
}

export function ProductTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  // Check localStorage and show tour after initial render
  useEffect(() => {
    // Mark as browser environment
    setIsBrowser(true);
    
    const hasSeenTour = localStorage.getItem('alphaforce-tour-completed');
    const shouldShowTour = localStorage.getItem('alphaforce-show-tour');
    
    // Show tour for first-time users or if explicitly requested
    if (!hasSeenTour || shouldShowTour === 'true') {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.removeItem('alphaforce-show-tour');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Update target element position
  const updateTargetPosition = useCallback(() => {
    const step = tourSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) return;
    
    // Use requestAnimationFrame to defer the position update
    const rafId = requestAnimationFrame(() => {
      updateTargetPosition();
    });
    
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [isOpen, updateTargetPosition]);

  const completeTour = useCallback(() => {
    setIsOpen(false);
    setCurrentStep(0);
    localStorage.setItem('alphaforce-tour-completed', 'true');
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep, completeTour]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    completeTour();
  }, [completeTour]);

  const handleAction = useCallback(() => {
    const step = tourSteps[currentStep];
    if (step.action?.href) {
      // Use setTimeout to defer navigation
      setTimeout(() => {
        window.location.assign(step.action!.href!);
      }, 0);
    }
    handleNext();
  }, [currentStep, handleNext]);

  if (!isBrowser || !isOpen) return null;

  const step = tourSteps[currentStep];
  const isCenter = step.position === 'center';

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-9998">
        {/* Spotlight overlay */}
        <Spotlight targetRect={targetRect} isCenter={isCenter} />

        {/* Tooltip */}
        <TooltipBox
          step={step}
          currentStep={currentStep}
          totalSteps={tourSteps.length}
          targetRect={targetRect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAction={step.action ? handleAction : undefined}
        />
      </div>
    </AnimatePresence>,
    document.body
  );
}

// Hook to trigger the tour manually
export function useTour() {
  const startTour = () => {
    localStorage.removeItem('alphaforce-tour-completed');
    localStorage.setItem('alphaforce-show-tour', 'true');
    window.location.reload();
  };

  const resetTour = () => {
    localStorage.removeItem('alphaforce-tour-completed');
  };

  return { startTour, resetTour };
}

// Button component to restart tour
export function RestartTourButton({ className }: { className?: string }) {
  const { startTour } = useTour();

  return (
    <Button
      onClick={startTour}
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
    >
      <Rocket className="w-4 h-4" />
      Restart Tour
    </Button>
  );
}
