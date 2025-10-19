import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface TourStep {
  target: string; 
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  mobilePosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface DashboardTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  isOpen: boolean;
}

export function DashboardTour({ steps, onComplete, onSkip, isOpen }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateHighlight = () => {
      const targetElement = document.querySelector(steps[currentStep].target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightRect(rect);

        const currentStepData = steps[currentStep];
        const position = isMobile && currentStepData.mobilePosition 
          ? currentStepData.mobilePosition 
          : (currentStepData.position || 'bottom');
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        const padding = 16;

        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = rect.top - tooltipHeight - padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'bottom':
            top = rect.bottom + padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - padding;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + padding;
            break;
        }

        const maxLeft = window.innerWidth - tooltipWidth - padding;
        const maxTop = window.innerHeight - tooltipHeight - padding;
        left = Math.max(padding, Math.min(left, maxLeft));
        top = Math.max(padding, Math.min(top, maxTop));

        setTooltipPosition({ top, left });

        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [currentStep, steps, isOpen, isMobile]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {highlightRect && (
              <rect
                x={highlightRect.left - 4}
                y={highlightRect.top - 8}
                width={highlightRect.width + 16}
                height={highlightRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.7)"
          mask="url(#tour-mask)"
        />
      </svg>

      {highlightRect && (
        <div
          className="absolute rounded-lg border-4 border-blue-500 pointer-events-none transition-all duration-300 ease-in-out"
          style={{
            top: `${highlightRect.top - 8}px`,
            left: `${highlightRect.left - 7.5}px`,
            width: `${highlightRect.width + 16}px`,
            height: `${highlightRect.height + 16}px`,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.7)',
          }}
        />
      )}

      <Card
        className="absolute w-80 shadow-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {steps[currentStep].title}
              </h3>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            {steps[currentStep].description}
          </p>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-blue-600'
                      : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1 bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Usage Example
// ============================================

export default function DashboardWithTour() {
  const [showTour, setShowTour] = useState(false);

  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="balance"]',
      title: 'Your Wallet Balance',
      description: 'This shows your current wallet balance. Click "Fund Wallet" to deposit funds using cryptocurrency or fiat payments.',
      position: 'right',
      mobilePosition: 'bottom',
    },
    {
      target: '[data-tour="deposit"]',
      title: 'Make a Deposit',
      description: 'Click here to deposit funds using cryptocurrency. We support multiple payment methods.',
      position: 'right',
      mobilePosition: 'bottom',
    },
    {
      target: '[data-tour="transactions"]',
      title: 'Transaction History',
      description: 'View all your past transactions here. You can filter by status to find specific transactions.',
      position: 'top',
    },
    {
      target: '[data-tour="filter"]',
      title: 'Filter Transactions',
      description: 'Use filters to view only successful, refunded, or failed transactions.',
      position: 'left',
      mobilePosition: 'bottom',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => setShowTour(true)} variant="outline">
            Start Tour
          </Button>
        </div>

        <Card data-tour="balance" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <p className="text-sm opacity-90 mb-1">Total Balance</p>
            <h2 className="text-3xl md:text-4xl font-bold">₦25,000.00</h2>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card data-tour="deposit" className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base">Deposit</h3>
              <p className="text-xs text-slate-500 mt-1">Add funds to wallet</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base">Withdraw</h3>
              <p className="text-xs text-slate-500 mt-1">Send funds out</p>
            </CardContent>
          </Card>
        </div>

        <Card data-tour="transactions">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold">Recent Transactions</h3>
              <Button data-tour="filter" variant="outline" size="sm">
                Filter
              </Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full" />
                    <div>
                      <p className="font-medium text-sm">Deposit</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600 text-sm md:text-base">+₦5,000</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DashboardTour
        steps={tourSteps}
        isOpen={showTour}
        onComplete={() => {
          setShowTour(false);
        }}
        onSkip={() => {
          setShowTour(false);
        }}
      />
    </div>
  );
}