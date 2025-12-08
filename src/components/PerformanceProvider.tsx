import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { performanceEngine, type RenderMode, usePerformanceConfig } from '@/lib/performance-engine';

interface PerformanceContextType {
  mode: RenderMode;
  enableAnimations: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
  setMode: (mode: RenderMode) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const config = usePerformanceConfig();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true);
  }, []);

  const value: PerformanceContextType = {
    mode: config.mode,
    enableAnimations: config.enableAnimations,
    enableBlur: config.enableBlur,
    enableShadows: config.enableShadows,
    setMode: (mode) => performanceEngine.setMode(mode)
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    // Return defaults if outside provider
    return {
      mode: 'enhanced' as RenderMode,
      enableAnimations: true,
      enableBlur: true,
      enableShadows: true,
      setMode: () => {}
    };
  }
  return context;
}
