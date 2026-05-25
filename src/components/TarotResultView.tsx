import React from 'react';
import { motion } from 'motion/react';
import { tarotCards } from '../data/tarot';
import { cn } from '../lib/utils';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import ImageWithPlaceholder from './ImageWithPlaceholder';

interface TarotResultViewProps {
  data: {
    opening: string;
    overall: string;
    interpretations: Array<{
      cardName: string;
      position: string;
      element: string;
      meaning: string;
    }>;
    advice: string;
    actionPlan: string[];
    closing: string;
  };
  onClose: () => void;
}

const TarotResultView: React.FC<TarotResultViewProps> = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-[#0a0a1a] overflow-y-auto no-scrollbar"
    >
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-linear-to-b from-purple-900/20 to-transparent" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <section className="text-center space-y-6 pt-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <Sparkles className="w-12 h-12 text-mystic-gold mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-display font-bold text-white tracking-widest">启示录</h1>
          </motion.div>
          <p className="text-white/60 leading-relaxed max-w-md mx-auto italic px-4">
            "{data.opening}"
          </p>
        </section>

        {/* Overall Interpretation */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-[40px] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-purple-500 to-blue-500" />
          <h2 className="text-xl font-display text-mystic-gold mb-4 flex items-center gap-2">
            星象总揽 <div className="h-px flex-1 bg-white/10" />
          </h2>
          <p className="text-white/80 leading-loose">
            {data.overall}
          </p>
        </motion.section>

        {/* Individual Card Details */}
        <section className="space-y-8">
          <h2 className="text-center text-mystic-gold/40 font-tech tracking-[0.3em] uppercase text-sm">卡牌深度解析</h2>
          {data.interpretations.map((item, i) => {
            const cardData = tarotCards.find(c => {
              const nameParts = c.name.toLowerCase().replace(/[()]/g, '').split(' ');
              const searchName = item.cardName.toLowerCase();
              return searchName.includes(c.name.split(' (')[0]) || 
                     nameParts.some(part => part.length > 3 && searchName.includes(part));
            });
            const isReversed = item.cardName.includes('逆位');
            
            return (
              <motion.div
                key={i}
                initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="glass rounded-[32px] overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {cardData && (
                    <div className="w-full md:w-48 aspect-2/3 relative shrink-0 bg-black/40">
                      <ImageWithPlaceholder 
                        src={cardData.image} 
                        alt={item.cardName} 
                        className={cn(
                          "w-full h-full object-cover p-2",
                          isReversed && "rotate-180"
                        )}
                        priority={i < 3}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a1a] via-transparent to-transparent md:bg-linear-to-r" />
                    </div>
                  )}
                  <div className="p-8 space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-tech text-mystic-gold/60 tracking-widest uppercase mb-1 block">POSITION {i + 1}</span>
                        <h3 className="text-2xl font-display text-white">{item.position}</h3>
                      </div>
                      <div className="px-3 py-1 rounded-lg glass-bright text-xs text-mystic-gold font-tech border border-mystic-gold/20">
                        {item.cardName}
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-start gap-3 glass-bright p-4 rounded-2xl border border-white/5">
                          <div className="w-8 h-8 rounded-full bg-mystic-gold/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-mystic-gold" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/90 mb-1">关键图腾</p>
                            <p className="text-sm text-white/60 leading-relaxed">{item.element}</p>
                          </div>
                       </div>
                       <p className="text-white/80 leading-relaxed pt-2">
                          {item.meaning}
                       </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Advice & Action Plan */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-[40px] p-8 space-y-8 border-t border-mystic-gold/30"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-display text-mystic-gold">智慧指引</h2>
            <p className="text-white/80 leading-relaxed">{data.advice}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-tech text-white/40 tracking-[0.2em] uppercase">建议行动方案</h3>
            <div className="space-y-3">
              {data.actionPlan.map((plan, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl group hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <p className="text-white/70 text-sm">{plan}</p>
                  <ArrowRight className="w-4 h-4 ml-auto text-white/20 group-hover:text-mystic-gold group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Closing */}
        <section className="text-center pb-12 space-y-8">
           <p className="text-white/40 italic text-sm">"{data.closing}"</p>
           
           <div className="flex flex-col gap-4">
              <button 
                onClick={onClose}
                className="w-full py-5 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                契约完成
              </button>
           </div>
        </section>
      </div>

      {/* Scroll indicator for report */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white/20 pointer-events-none"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </motion.div>
  );
};

export default TarotResultView;
