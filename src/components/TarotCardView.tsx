import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TarotCard } from '../data/tarot';
import { cn } from '../lib/utils';
import { RefreshCw, Check, Sparkles } from 'lucide-react';

interface TarotCardViewProps {
  card: TarotCard;
  isReversed: boolean;
  positionName: string;
  isConfirmed: boolean;
  onConfirm: () => void;
  onReplace: () => void;
}

const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  isReversed,
  positionName,
  isConfirmed,
  onConfirm,
  onReplace,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-1">
        <p className="text-mystic-gold/60 text-xs font-tech tracking-widest uppercase">{positionName}</p>
        <h3 className="text-xl font-display text-white">{card.name}</h3>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="w-56 aspect-2/3 relative rounded-2xl overflow-hidden glass shadow-2xl bg-mystic-800"
      >
        {/* Simple inline loader to guarantee smooth transitions */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-mystic-900">
            <Sparkles className="w-8 h-8 text-mystic-gold/20 animate-pulse" />
          </div>
        )}
        
        <img
          src={card.image}
          alt={card.name}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            isReversed && "rotate-180"
          )}
          loading="eager"
        />
        
        {/* Overlay gradient & indicator */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <p className="text-[10px] font-tech text-mystic-gold tracking-[0.2em]">
            {isReversed ? 'REVERSED' : 'UPRIGHT'}
          </p>
        </div>
      </motion.div>

      {!isConfirmed && (
        <div className="flex gap-4">
          <button
            onClick={onReplace}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors text-white/60 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> 重新抽取
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-500/20"
          >
            <Check className="w-4 h-4" /> 确认此牌
          </button>
        </div>
      )}
    </div>
  );
};

export default TarotCardView;
