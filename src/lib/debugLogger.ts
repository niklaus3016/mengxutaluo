import React from 'react';

interface DebugLog {
  timestamp: number;
  sessionId: string;
  type: 'mount' | 'unmount' | 'timer' | 'animation' | 'image' | 'memory' | 'error';
  component: string;
  data?: any;
}

class DebugLogger {
  private sessionId: string;
  private logs: DebugLog[] = [];
  private maxLogs = 1000;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  log(type: DebugLog['type'], component: string, data?: any) {
    const logEntry: DebugLog = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      type,
      component,
      data,
    };

    this.logs.push(logEntry);

    // Keep only recent logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also log to console for immediate visibility
    console.log(`[DEBUG ${type.toUpperCase()}] ${component}:`, data);
  }

  getLogs(): DebugLog[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }

  getStats() {
    const stats = {
      total: this.logs.length,
      byType: {} as Record<string, number>,
      byComponent: {} as Record<string, number>,
    };

    this.logs.forEach(log => {
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
      stats.byComponent[log.component] = (stats.byComponent[log.component] || 0) + 1;
    });

    return stats;
  }
}

// Global instance
let globalLogger: DebugLogger | null = null;

export const initDebugLogger = (sessionId: string) => {
  if (!globalLogger) {
    globalLogger = new DebugLogger(sessionId);
  }
  return globalLogger;
};

export const getDebugLogger = () => {
  if (!globalLogger) {
    globalLogger = new DebugLogger('default');
  }
  return globalLogger;
};

export const debugLog = (type: DebugLog['type'], component: string, data?: any) => {
  getDebugLogger().log(type, component, data);
};

// React hook for component lifecycle debugging
export const useDebugLifecycle = (componentName: string, extraData?: any) => {
  React.useEffect(() => {
    debugLog('mount', componentName, { ...extraData, timestamp: Date.now() });
    return () => {
      debugLog('unmount', componentName, { ...extraData, timestamp: Date.now() });
    };
  }, [componentName]);
};

// Timer tracking
export const useDebugTimer = (componentName: string) => {
  const timerCountRef = React.useRef(0);

  const startTimer = (callback: () => void, delay: number) => {
    timerCountRef.current++;
    debugLog('timer', componentName, { 
      action: 'start', 
      count: timerCountRef.current,
      delay 
    });
    
    const timerId = setTimeout(() => {
      timerCountRef.current--;
      debugLog('timer', componentName, { 
        action: 'end', 
        count: timerCountRef.current 
      });
      callback();
    }, delay);

    return timerId;
  };

  const clearTimer = (timerId: NodeJS.Timeout) => {
    clearTimeout(timerId);
    timerCountRef.current--;
    debugLog('timer', componentName, { 
      action: 'clear', 
      count: timerCountRef.current 
    });
  };

  return { startTimer, clearTimer, timerCount: () => timerCountRef.current };
};

// Memory monitoring
export const logMemoryUsage = (component: string) => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    debugLog('memory', component, {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
    });
  }
};