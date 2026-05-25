import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Sparkles } from 'lucide-react';
import { debugLog, logMemoryUsage } from '../lib/debugLogger';

// #region debug-point image-lifecycle

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const getSuitTheme = (srcStr: string) => {
  const clean = srcStr.toLowerCase();
  if (clean.includes('/w') || clean.includes('w0') || clean.includes('w1')) {
    return {
      gradient: 'from-[#2b1206] via-[#170a04] to-[#0d0502]',
      color: 'text-amber-500/10'
    };
  }
  if (clean.includes('/c') || clean.includes('c0') || clean.includes('c1')) {
    return {
      gradient: 'from-[#0a1e30] via-[#05111c] to-[#02070c]',
      color: 'text-cyan-500/10'
    };
  }
  if (clean.includes('/s') || clean.includes('s0') || clean.includes('s1')) {
    return {
      gradient: 'from-[#141b26] via-[#0c1017] to-[#06080c]',
      color: 'text-blue-400/10'
    };
  }
  if (clean.includes('/p') || clean.includes('p0') || clean.includes('p1')) {
    return {
      gradient: 'from-[#0a2113] via-[#05110a] to-[#020704]',
      color: 'text-emerald-500/10'
    };
  }
  return {
    gradient: 'from-[#191136] via-[#0d091d] to-[#06040e]',
    color: 'text-purple-500/10'
  };
};

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({ src, alt, className, priority = false }) => {
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const highResRef = useRef<HTMLImageElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // #region debug-point image-cleanup
  useEffect(() => {
    debugLog('image', 'ImageWithPlaceholder', { src, priority, isVisible });
    
    return () => {
      debugLog('image', 'ImageWithPlaceholder', { action: 'cleanup', src });
    };
  }, [src, priority, isVisible]);
  // #endregion debug-point image-cleanup

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isVisible]);

  useEffect(() => {
    // Reset state on source changes
    setHighResLoaded(false);
    setThumbLoaded(false);

    // If already in browser cache, set loaded instantly
    if (highResRef.current && highResRef.current.complete) {
      setHighResLoaded(true);
      debugLog('image', 'ImageWithPlaceholder', { action: 'cache-hit', src });
    }
  }, [src]);

  const theme = getSuitTheme(src);
  const thumbSrc = `${src}?thumb=true`;

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-linear-to-br",
        theme.gradient
      )}
    >
      {/* Background ambient pulse / sparkles when loading */}
      <AnimatePresence>
        {!highResLoaded && isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent bg-size-[200%_100%] animate-shimmer" />
            <Sparkles className={cn("w-6 h-6 animate-pulse", theme.color)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blurred Low-Res Thumbnail Layer */}
      <AnimatePresence>
        {!highResLoaded && isVisible && (
          <motion.img
            src={thumbSrc}
            alt={`${alt} (Thumbnail)`}
            loading="eager"
            onLoad={() => setThumbLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: thumbLoaded ? 0.9 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              className,
              "absolute inset-0 w-full h-full object-cover blur-md scale-105 z-10 select-none pointer-events-none brightness-[0.85]"
            )}
          />
        )}
      </AnimatePresence>

      {/* High-Resolution Full Image Layer */}
      {isVisible && (
        <img
          ref={highResRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setHighResLoaded(true)}
          className={cn(
            className,
            "w-full h-full object-cover transition-all duration-700 ease-out",
            highResLoaded ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-95 select-none pointer-events-none"
          )}
        />
      )}
    </div>
  );
};

export default ImageWithPlaceholder;
