import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tarotCards, TarotCard } from '../data/tarot';
import { Sparkles, RefreshCw, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import TarotCardView from '../components/TarotCardView';
import TarotResultView from '../components/TarotResultView';
import { saveTarotHistory } from '../lib/storage';
import { debugLog, logMemoryUsage } from '../lib/debugLogger';

// #region debug-point tarot-page-lifecycle

type Step = 'QUESTION' | 'SHUFFLING' | 'FAN' | 'PICKING_DETAIL' | 'INTERPRETING' | 'RESULT';

const presetQuestions = [
  { category: '综合运势', text: '我近期的整体能量场与运势流动如何？有哪些需要倾听的指引？', icon: '✦' },
  { category: '事业学业', text: '我接下来的职业生涯/学业走势如何？有什么需要把握或避开的机会？', icon: '💼' },
  { category: '情感关系', text: '我在感情上的运势走向如何？该如何更好地处理亲密关系或突破瓶颈？', icon: '❤️' },
  { category: '财富状况', text: '我近期的财运脉络如何？应该如何开辟丰盛能量？', icon: '🪙' },
];

interface SelectedCard {
  card: TarotCard;
  isReversed: boolean;
  positionName: string;
}

const generateLocalInterpretation = (
  cards: SelectedCard[],
  spreadName: string
) => {
  const isThreeCards = cards.length === 3;
  
  const interpretations = cards.map((s, idx) => {
    const cardNameWithOrientation = s.card.name + (s.isReversed ? ' (逆位)' : ' (正位)');
    const meaning = s.isReversed ? s.card.meaning_rev : s.card.meaning_up;
    const position = isThreeCards 
      ? (idx === 0 ? "过去 (Past)" : idx === 1 ? "现在 (Present)" : "未来 (Future)")
      : s.positionName;
      
    return {
      cardName: cardNameWithOrientation,
      position: position,
      element: s.card.keywords.join(' · '),
      meaning: `${s.card.description} 这张牌在此位置，预示着：${meaning}`
    };
  });

  const firstCard = cards[0]?.card;
  const overallText = `本次占卜启用了经典牌阵「${spreadName}」。牌阵核心能量由首牌《${firstCard?.name}》锚定。` +
    `通过《${cards.map(c => c.card.name.split(' (')[0]).join('》、《')}》的能量共鸣，揭示出你当前的运势流动。` +
    `理智与情感在此刻达到微妙共振，正是自我觉察的最佳时机。`;

  const adviceText = `万事万物皆有其特定轨迹与潜能。不必因一时的犹豫或阻碍产生纠结与退缩，而应当把视线投向内心的本源。` +
    `正如牌面所昭示的："${cards.map(c => c.isReversed ? c.card.meaning_rev : c.card.meaning_up).join(' ')}" ` +
    `顺应变化，接纳自我，你便能找到最适合的节奏重新起航。`;

  const actionPlan = cards.map((c) => {
    const mainKey = c.card.keywords[0] || '成长';
    return c.isReversed 
      ? `针对《${c.card.name}（逆位）》所映射的阻滞，请静心反观，寻求在「${mainKey}」领域进行自我调适。`
      : `伴随《${c.card.name}（正位）》饱满的流通力量，勇敢向前，主动在「${mainKey}」方向上探寻突破点。`;
  });

  return {
    opening: "群星的印记已印刻于时空之上。愿这一曲无声的塔罗回音能化为照亮迷雾的微光。",
    overall: overallText,
    interpretations: interpretations,
    advice: adviceText,
    actionPlan: actionPlan,
    closing: "契约达成，言尽于此。愿你在行进的每一步中，皆得至臻和谐。"
  };
};

const TarotPage: React.FC = () => {
  const [step, setStep] = useState<Step>('QUESTION');
  const [question, setQuestion] = useState('我近期的整体能量场与运势流动如何？有哪些需要倾听的指引？');
  const [analysis] = useState<{ analysis: string; spreadName: string; cardCount: number }>({
    analysis: "在灵性的指引下，探寻属于你的命运脉络。",
    spreadName: "圣三角牌阵",
    cardCount: 3
  });
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [interpretationData, setInterpretationData] = useState<any>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  
  const interpretersTimerRef = useRef<NodeJS.Timeout | null>(null);
  const confirmTimerRef = useRef<NodeJS.Timeout | null>(null);

  // #region debug-point tarot-page-cleanup
  useEffect(() => {
    debugLog('mount', 'TarotPage');
    logMemoryUsage('TarotPage-mount');
    
    return () => {
      debugLog('unmount', 'TarotPage');
      logMemoryUsage('TarotPage-unmount');
      if (interpretersTimerRef.current) {
        debugLog('timer', 'TarotPage', { action: 'cleanup', timer: 'interpretersTimerRef' });
        clearTimeout(interpretersTimerRef.current);
      }
      if (confirmTimerRef.current) {
        debugLog('timer', 'TarotPage', { action: 'cleanup', timer: 'confirmTimerRef' });
        clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);
  // #endregion debug-point tarot-page-cleanup
  
  const navigate = useNavigate();

  // Fisher-Yates shuffle algorithm
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Shuffle process
  useEffect(() => {
    if (step === 'SHUFFLING') {
      debugLog('timer', 'TarotPage', { action: 'start', timer: 'shuffle', delay: 4000 });
      // Perform actual shuffling
      const shuffled = shuffleArray(tarotCards);
      setShuffledCards(shuffled);
      
      const timer = setTimeout(() => {
        debugLog('timer', 'TarotPage', { action: 'end', timer: 'shuffle' });
        setStep('FAN');
      }, 4000);
      return () => {
        debugLog('timer', 'TarotPage', { action: 'clear', timer: 'shuffle' });
        clearTimeout(timer);
      };
    }
  }, [step]);

  // Handle card selection from fan
  const handlePickCard = (card: TarotCard) => {
    if (selectedCards.length >= analysis.cardCount) return;
    
    // Check if card already selected
    if (selectedCards.some(s => s.card.id === card.id)) return;

    const isReversed = Math.random() > 0.7;
    const positions = ["过去 (Past)", "现在 (Present)", "未来 (Future)"];
    const positionName = positions[selectedCards.length] || `位置 ${selectedCards.length + 1}`;
    
    const newCard = { card, isReversed, positionName };
    setSelectedCards([...selectedCards, newCard]);
    setIsConfirmed(false);
    setStep('PICKING_DETAIL');
  };

  // Confirm individual card
  const handleConfirmCard = () => {
    setIsConfirmed(true);
    
    if (selectedCards.length < analysis.cardCount) {
      confirmTimerRef.current = setTimeout(() => {
        setStep('FAN');
      }, 500);
    } else {
      handleStartInterpretation();
    }
  };

  // Replace current card
  const handleReplaceCard = () => {
    const newCards = [...selectedCards];
    newCards.pop();
    setSelectedCards(newCards);
    setStep('FAN');
  };

  // Final interpretation
  const handleStartInterpretation = () => {
    setStep('INTERPRETING');
    debugLog('timer', 'TarotPage', { action: 'start', timer: 'interpretation', delay: 2500 });
    interpretersTimerRef.current = setTimeout(() => {
      try {
        debugLog('timer', 'TarotPage', { action: 'end', timer: 'interpretation' });
        const result = generateLocalInterpretation(selectedCards, analysis.spreadName);
        
        // Save to offline local history
        const dateObj = new Date();
        const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
        
        const firstCardName = selectedCards[0]?.card.name || '未知卡牌';
        const orientation = selectedCards[0]?.isReversed ? '（逆位）' : '（正位）';

        saveTarotHistory({
          id: String(Date.now()),
          type: '塔罗',
          title: question.trim().length > 15 ? question.trim().slice(0, 15) + '...' : question.trim(),
          date: formattedDate,
          question: question,
          spreadName: analysis.spreadName,
          result: `【${firstCardName}】${orientation}`,
          cards: selectedCards.map(s => ({
            cardId: s.card.id,
            isReversed: s.isReversed,
            positionName: s.positionName
          })),
          analysis: result
        });

        setInterpretationData(result);
        setStep('RESULT');
        logMemoryUsage('TarotPage-result');
      } catch (err) {
        console.error("Local interpretation failed", err);
        debugLog('error', 'TarotPage', { error: err });
        setStep('FAN');
      }
    }, 2500);
  };

  const currentPickingCard = selectedCards[selectedCards.length - 1];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden relative">
      {/* Background stars/nebula effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'QUESTION' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex flex-col justify-center px-6 py-12 relative max-w-lg mx-auto"
          >
            {/* Back button */}
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              title="返回首页"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="space-y-4 text-center mb-8 mt-10">
              <h2 className="text-3xl font-display font-bold text-mystic-gold tracking-widest">设定占卜意图</h2>
              <p className="text-white/40 text-xs italic">在星轨交汇之前，请在此处写下你想探寻的事物或解答的困惑</p>
            </div>

            <div className="space-y-4">
              {/* Custom Text Area */}
              <div className="glass rounded-4xl p-6 border border-white/5 space-y-3">
                <label className="text-[10px] font-tech text-white/40 uppercase tracking-widest block pl-2">你的问题 / 困惑</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="请输入你内心的困惑（例如：接下来的三个月里我该如何寻找突破？）"
                  className="w-full h-24 bg-white/5 border border-white/5 focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/20 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 resize-none outline-none transition-all"
                />
              </div>

              {/* Preset Selectors */}
              <div className="space-y-2">
                <p className="text-[10px] font-tech text-white/40 uppercase tracking-widest pl-2">或选择经典意念频道</p>
                <div className="grid grid-cols-2 gap-3">
                  {presetQuestions.map((pq, i) => (
                    <button
                      key={i}
                      onClick={() => setQuestion(pq.text)}
                      className={cn(
                        "glass p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all hover:bg-white/5 active:scale-95 cursor-pointer",
                        question === pq.text ? "border-mystic-accent bg-purple-900/10" : "border-white/5"
                      )}
                    >
                      <span className="text-lg">{pq.icon}</span>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-white block truncate">{pq.category}</span>
                        <span className="text-[9px] text-white/40 line-clamp-1">{pq.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep('SHUFFLING')}
                disabled={!question.trim()}
                className="w-full py-4 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold text-sm tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none uppercase mt-6 cursor-pointer"
              >
                开启命运之轮
              </button>
            </div>
          </motion.div>
        )}

        {step === 'SHUFFLING' && (
          <motion.div
            key="shuffling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex flex-col items-center justify-center gap-16 relative"
          >
            {/* Back button */}
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              title="返回首页"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

             <div className="relative w-64 h-[400px]">
               {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                 <motion.div
                   key={i}
                   animate={{
                     x: [0, (i - 4) * 50, 0],
                     y: [0, i * 5, 0],
                     z: [0, i * 10, 0],
                     rotate: [0, (i - 4) * 15, 0],
                     rotateY: [0, 180, 360],
                   }}
                   transition={{
                     duration: 1.5,
                     repeat: Infinity,
                     delay: i * 0.1,
                     ease: "easeInOut"
                   }}
                   className="absolute inset-0 glass rounded-2xl border-white/20 flex items-center justify-center backface-hidden shadow-2xl"
                 >
                   <div className="w-full h-full p-4">
                      <div className="w-full h-full border border-mystic-gold/10 rounded-xl flex items-center justify-center opacity-10">
                        <Sparkles className="w-12 h-12 text-mystic-gold" />
                      </div>
                   </div>
                 </motion.div>
               ))}
             </div>
             <div className="text-center space-y-2">
                <p className="text-mystic-gold/60 font-tech tracking-[0.4em] uppercase">Shuffling Cards</p>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-mystic-accent"
                    />
                  ))}
                </div>
             </div>
          </motion.div>
        )}

        {step === 'FAN' && (
          <motion.div
            key="fan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-screen flex flex-col p-6 pt-10 relative"
          >
            {/* Back button */}
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              title="返回首页"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center mb-10 mt-12 space-y-2">
              <h2 className="text-2xl font-display text-white tracking-widest">{analysis?.spreadName}</h2>
              <p className="text-white/40 text-sm">请点击卡牌，抽取第 {selectedCards.length + 1} / {analysis?.cardCount} 张卡牌</p>
              
              <div className="flex justify-center gap-3 mt-6">
                {Array.from({ length: analysis?.cardCount || 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={i === selectedCards.length ? { scale: 1.2, boxShadow: '0 0 15px rgba(212,175,55,0.4)' } : {}}
                    className={cn(
                      "w-3 h-3 rounded-full border border-mystic-gold transition-all duration-500",
                      i < selectedCards.length ? "bg-mystic-gold" : "bg-transparent opacity-30"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-auto no-scrollbar pb-10 content-start px-2">
              {(shuffledCards.length > 0 ? shuffledCards.slice(0, 21) : tarotCards.slice(0, 21)).map((card, i) => {
                 const isSelected = selectedCards.some(s => s.card.id === card.id);
                 return (
                   <motion.div
                     key={card.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: isSelected ? 0 : 1, y: 0 }}
                     transition={{ delay: i * 0.03 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={() => !isSelected && handlePickCard(card)}
                     className={cn(
                       "aspect-2/3 glass-bright rounded-lg border border-white/5 relative flex items-center justify-center cursor-pointer group",
                       isSelected && "pointer-events-none"
                     )}
                   >
                     <div className="absolute inset-1 border border-mystic-gold/10 rounded-md opacity-20 group-hover:opacity-100 transition-opacity" />
                     <Sparkles className="w-5 h-5 text-white/5 group-hover:text-mystic-gold/40 transition-colors" />
                   </motion.div>
                 );
              })}
            </div>
          </motion.div>
        )}

        {step === 'PICKING_DETAIL' && currentPickingCard && (
          <motion.div
            key="picking-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <TarotCardView
              card={currentPickingCard.card}
              isReversed={currentPickingCard.isReversed}
              positionName={currentPickingCard.positionName}
              isConfirmed={isConfirmed}
              onConfirm={handleConfirmCard}
              onReplace={handleReplaceCard}
            />
          </motion.div>
        )}

        {(step === 'INTERPRETING') && (
          <motion.div
            key="interpreting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex flex-col items-center justify-center p-10 text-center gap-12"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border border-mystic-gold/10 rounded-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RefreshCw className="w-12 h-12 text-mystic-gold animate-spin-slow" />
                </motion.div>
                <div className="text-[10px] font-tech text-mystic-gold/60 tracking-[0.3em] uppercase">Decoding Destiny</div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-white">契约共鸣中</h2>
              <p className="text-white/40 text-sm italic max-w-xs mx-auto">
                您的生命轨迹正在与塔罗奥义融合。请保持宁静，真相即将显现...
              </p>
            </div>
          </motion.div>
        )}

        {step === 'RESULT' && interpretationData && (
          <TarotResultView
            data={interpretationData}
            onClose={() => {
              setStep('QUESTION');
              setSelectedCards([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TarotPage;
