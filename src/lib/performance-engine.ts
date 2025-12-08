/**
 * UHPE - Ultra Hybrid Performance Engine
 * Adaptive rendering based on device capabilities
 */

export type RenderMode = 'ultimate' | 'enhanced' | 'lite';

interface DeviceCapabilities {
  gpuScore: number;
  memoryGB: number;
  hasWebGL: boolean;
  connectionSpeed: 'fast' | 'medium' | 'slow';
  cores: number;
  isMobile: boolean;
}

interface PerformanceConfig {
  mode: RenderMode;
  enableAnimations: boolean;
  enableParticles: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
  enableTransitions: boolean;
  prefetchEnabled: boolean;
  lazyLoadThreshold: number;
  maxConcurrentLoads: number;
}

const CONFIG_MAP: Record<RenderMode, PerformanceConfig> = {
  ultimate: {
    mode: 'ultimate',
    enableAnimations: true,
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
    enableTransitions: true,
    prefetchEnabled: true,
    lazyLoadThreshold: 300,
    maxConcurrentLoads: 10
  },
  enhanced: {
    mode: 'enhanced',
    enableAnimations: true,
    enableParticles: false,
    enableBlur: true,
    enableShadows: true,
    enableTransitions: true,
    prefetchEnabled: true,
    lazyLoadThreshold: 200,
    maxConcurrentLoads: 6
  },
  lite: {
    mode: 'lite',
    enableAnimations: false,
    enableParticles: false,
    enableBlur: false,
    enableShadows: false,
    enableTransitions: false,
    prefetchEnabled: false,
    lazyLoadThreshold: 100,
    maxConcurrentLoads: 3
  }
};

class PerformanceEngine {
  private capabilities: DeviceCapabilities | null = null;
  private config: PerformanceConfig = CONFIG_MAP.enhanced;
  private observers: Set<(config: PerformanceConfig) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.detectCapabilities();
      this.setupNetworkObserver();
    }
  }

  private detectCapabilities(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    
    let gpuScore = 50; // Default mid-range
    
    if (gl && hasWebGL) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        gpuScore = this.scoreGPU(renderer);
      }
    }

    const memoryGB = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const connection = (navigator as any).connection;
    let connectionSpeed: 'fast' | 'medium' | 'slow' = 'medium';
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '4g' || effectiveType === '5g') {
        connectionSpeed = 'fast';
      } else if (effectiveType === '3g') {
        connectionSpeed = 'medium';
      } else {
        connectionSpeed = 'slow';
      }
    }

    this.capabilities = {
      gpuScore,
      memoryGB,
      hasWebGL,
      connectionSpeed,
      cores,
      isMobile
    };

    this.determineMode();
  }

  private scoreGPU(renderer: string): number {
    const lowEnd = /intel|hd graphics|uhd graphics|mali-4|adreno 3|powervr/i;
    const midRange = /adreno 5|mali-g5|nvidia geforce mx|intel iris/i;
    const highEnd = /nvidia geforce rtx|nvidia geforce gtx 10|nvidia geforce gtx 16|amd radeon rx|apple m1|apple m2|apple m3/i;

    if (highEnd.test(renderer)) return 90;
    if (midRange.test(renderer)) return 60;
    if (lowEnd.test(renderer)) return 30;
    return 50;
  }

  private determineMode(): void {
    if (!this.capabilities) return;

    const { gpuScore, memoryGB, connectionSpeed, cores, isMobile } = this.capabilities;
    
    // Calculate composite score
    let score = gpuScore;
    score += memoryGB >= 8 ? 20 : memoryGB >= 4 ? 10 : 0;
    score += cores >= 8 ? 15 : cores >= 4 ? 8 : 0;
    score += connectionSpeed === 'fast' ? 15 : connectionSpeed === 'medium' ? 8 : 0;
    score -= isMobile ? 15 : 0;

    let mode: RenderMode;
    if (score >= 100) {
      mode = 'ultimate';
    } else if (score >= 60) {
      mode = 'enhanced';
    } else {
      mode = 'lite';
    }

    this.setMode(mode);
  }

  private setupNetworkObserver(): void {
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.detectCapabilities();
      });
    }
  }

  public setMode(mode: RenderMode): void {
    this.config = CONFIG_MAP[mode];
    this.applyCSS();
    this.notifyObservers();
    console.log(`[UHPE] Render mode set to: ${mode}`);
  }

  private applyCSS(): void {
    const root = document.documentElement;
    
    if (!this.config.enableAnimations) {
      root.style.setProperty('--animation-duration', '0s');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduce-motion');
    }

    if (!this.config.enableBlur) {
      root.classList.add('no-blur');
    } else {
      root.classList.remove('no-blur');
    }

    if (!this.config.enableShadows) {
      root.classList.add('no-shadows');
    } else {
      root.classList.remove('no-shadows');
    }
  }

  private notifyObservers(): void {
    this.observers.forEach(cb => cb(this.config));
  }

  public subscribe(callback: (config: PerformanceConfig) => void): () => void {
    this.observers.add(callback);
    callback(this.config);
    return () => this.observers.delete(callback);
  }

  public getConfig(): PerformanceConfig {
    return this.config;
  }

  public getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }

  public getMode(): RenderMode {
    return this.config.mode;
  }

  // Prefetch on hover utility
  public prefetch(url: string): void {
    if (!this.config.prefetchEnabled) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  // Schedule idle work
  public scheduleIdleTask(callback: () => void): void {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 1);
    }
  }
}

export const performanceEngine = new PerformanceEngine();

// React hook
import { useState, useEffect } from 'react';

export function usePerformanceConfig(): PerformanceConfig {
  const [config, setConfig] = useState(performanceEngine.getConfig());

  useEffect(() => {
    return performanceEngine.subscribe(setConfig);
  }, []);

  return config;
}

export function useRenderMode(): RenderMode {
  return usePerformanceConfig().mode;
}
