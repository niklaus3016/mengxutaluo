import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tarotCards, TarotCard } from '../data/tarot';
import { Search, Filter, X, Info, Sparkles, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';
import { getFavoriteCardIds, toggleFavoriteCard } from '../lib/storage';
import { debugLog, logMemoryUsage } from '../lib/debugLogger';

// #region debug-point library-page-lifecycle

type TabId = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

const LibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [displayCount, setDisplayCount] = useState(24);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // #region debug-point library-page-cleanup
  useEffect(() => {
    debugLog('mount', 'LibraryPage');
    logMemoryUsage('LibraryPage-mount');
    
    setFavoriteIds(getFavoriteCardIds());
    
    return () => {
      debugLog('unmount', 'LibraryPage');
      logMemoryUsage('LibraryPage-unmount');
    };
  }, []);
  // #endregion debug-point library-page-cleanup

  const handleToggleFavorite = (cardId: string) => {
    toggleFavoriteCard(cardId);
    setFavoriteIds(getFavoriteCardIds());
  };

  const isFavorited = (cardId: string) => favoriteIds.includes(cardId);

  // Tabs specification with elemental tags
  const tabs = [
    { id: 'all' as const, label: '全部' },
    { id: 'major' as const, label: '大阿卡那' },
    { id: 'wands' as const, label: '权杖 (火)' },
    { id: 'cups' as const, label: '圣杯 (水)' },
    { id: 'swords' as const, label: '宝剑 (风)' },
    { id: 'pentacles' as const, label: '星币 (土)' },
  ];

  // Reset pagination count when active tab or search keywords change
  useEffect(() => {
    setDisplayCount(24);
  }, [search, activeTab]);

  // Combined text and category filtering - Memoized for performance
  const filteredCards = React.useMemo(() => {
    return tarotCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase()) || 
                            card.keywords.some(k => k.includes(search));
      
      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'major') return card.arcana === 'major';
      return card.suit === activeTab;
    });
  }, [search, activeTab]);

  const visibleCards = React.useMemo(() => {
    return filteredCards.slice(0, displayCount);
  }, [filteredCards, displayCount]);

  return (
    <div className="min-h-screen px-4 pt-12 pb-32 max-w-4xl mx-auto">
      <header className="space-y-6 mb-10 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-sans font-bold text-mystic-gold tracking-widest">牌库</h1>
          <p className="text-mystic-gold/70 text-xs font-sans font-bold">探索塔罗全体系 78 张卡牌</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 glass rounded-2xl px-4 py-3 flex items-center gap-3 border-white/5 focus-within:border-mystic-accent/50 transition-colors">
              <Search className="w-5 h-5 text-white/30" />
              <input 
                type="text" 
                placeholder="搜索牌名或关键词..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-white/20 text-sm"
              />
            </div>
          </div>

          {/* Elemental Category Pill Selection */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 px-1 scroll-smooth">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider whitespace-nowrap transition-all border duration-300",
                    isActive
                      ? "bg-linear-to-r from-purple-600 to-blue-600 border-transparent text-white shadow-lg shadow-purple-500/20"
                      : "glass border-white/5 text-white/50 hover:text-white hover:border-white/10"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Grid of Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
        {visibleCards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 12) * 0.02 }}
            onClick={() => setSelectedCard(card)}
            className="group cursor-pointer"
          >
            <div className="aspect-2/3 glass rounded-lg sm:rounded-2xl overflow-hidden mb-1.5 border-white/10 group-hover:border-mystic-accent/40 group-hover:shadow-[0_0_15px_rgba(127,90,240,0.2)] transition-all relative">
              <ImageWithPlaceholder 
                src={card.image} 
                alt={card.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                priority={i < 12}
              />
              <div className="absolute inset-0 bg-linear-to-t from-mystic-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-center font-medium text-[9px] sm:text-xs group-hover:text-mystic-gold transition-colors truncate px-0.5 text-white/80">{card.name}</h3>
          </motion.div>
        ))}
      </div>

      {/* Lazy Load Button */}
      {filteredCards.length > displayCount && (
        <div className="flex justify-center mt-12 mb-6">
          <button
            onClick={() => setDisplayCount(prev => prev + 24)}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass border-white/10 text-white/70 hover:text-white hover:border-mystic-accent/50 transition-all font-medium text-xs tracking-widest uppercase hover:shadow-[0_0_15px_rgba(127,90,240,0.15)] cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-mystic-gold group-hover:animate-pulse" />
            加载更多卡牌 ({filteredCards.length - displayCount}张未显示)
          </button>
        </div>
      )}

      {/* Empty Search Result */}
      {filteredCards.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-white/20 text-sm">寻觅无果，神启未至。换个词搜索吧。</p>
        </div>
      )}


      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-mystic-900/90 backdrop-blur-xl"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => handleToggleFavorite(selectedCard.id)}
                className="absolute top-6 left-6 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-white/60 hover:text-white z-10"
                title={isFavorited(selectedCard.id) ? "取消收藏" : "收藏卡牌"}
              >
                <Heart className={cn("w-5 h-5 transition-colors", isFavorited(selectedCard.id) ? "text-mystic-pink fill-mystic-pink" : "text-white/60")} />
              </button>

              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-white/60 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                {/* Header Image */}
                <div className="relative h-80 w-full overflow-hidden">
                  <ImageWithPlaceholder src={selectedCard.image} alt={selectedCard.name} className="w-full h-full object-cover scale-150 blur-xl opacity-20" />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-mystic-700 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center pt-10">
                    <div className="w-40 aspect-2/3 rounded-xl overflow-hidden shadow-2xl glass p-1">
                      <ImageWithPlaceholder src={selectedCard.image} alt={selectedCard.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-12 space-y-8 -mt-6 relative z-10">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-display font-bold text-mystic-gold">{selectedCard.name}</h2>
                    <div className="flex justify-center gap-2">
                      {selectedCard.keywords.map(kw => (
                        <span key={kw} className="text-[10px] uppercase tracking-widest text-mystic-accent border border-mystic-accent/30 px-2 py-0.5 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-mystic-pink">
                        <Info className="w-4 h-4" />
                        <h4 className="font-tech text-xs uppercase tracking-widest font-bold">正位含义 (Upright)</h4>
                      </div>
                      <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-4 rounded-2xl border border-white/5">
                        {selectedCard.meaning_up}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Info className="w-4 h-4" />
                        <h4 className="font-tech text-xs uppercase tracking-widest font-bold">逆位含义 (Reversed)</h4>
                      </div>
                      <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-4 rounded-2xl border border-white/5">
                        {selectedCard.meaning_rev}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-tech text-xs uppercase tracking-widest font-bold text-white/40">深层启示</h4>
                      <p className="text-white/60 leading-relaxed text-sm italic">
                        {selectedCard.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;
