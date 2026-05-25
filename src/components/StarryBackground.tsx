import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { debugLog, logMemoryUsage } from '../lib/debugLogger';

// #region debug-point starry-background-lifecycle
const StarryBackground: React.FC = () => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    debugLog('mount', 'StarryBackground');
    logMemoryUsage('StarryBackground-mount');
    
    return () => {
      isMountedRef.current = false;
      debugLog('unmount', 'StarryBackground');
      logMemoryUsage('StarryBackground-unmount');
    };
  }, []);
  // #endregion debug-point starry-background-lifecycle

  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({ // Reduced from 150 to 100
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-1 overflow-hidden bg-mystic-900 pointer-events-none">
      {/* Background container for the app-like border experience if on desktop, 
          but usually we just want a full bleed on mobile-first applet. 
          The design shows a border of #2A1A4A. We'll simulate that for the main container later. */}
      
      {/* Radial Gradient Base */}
      <div className="absolute inset-0 bg-mystic-900" />

      {/* Nebula Glows from Design - Optimized with reduced animation duration */}
      <motion.div
        animate={isMountedRef.current ? {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        } : {}}
        transition={{
          duration: 8, // Reduced from 15 to 8
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-900/30 blur-[120px] rounded-full"
      />
      <motion.div
        animate={isMountedRef.current ? {
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        } : {}}
        transition={{
          duration: 12, // Reduced from 20 to 12
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full"
      />

      {/* Small Glowing Stars/Points from Design */}
      <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_10px_#fff]" />
      <div className="absolute top-1/3 left-1/3 w-px h-px bg-white opacity-50 rounded-full" />
      <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />

      {/* Stars Grid - Optimized with reduced count */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute bg-white rounded-full opacity-30"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
