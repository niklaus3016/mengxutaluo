import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 pt-8 pb-4 flex flex-col gap-6 h-full"
    >
      {/* Header */}
      <header className="space-y-1 shrink-0">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-sans font-bold text-mystic-gold flex items-center gap-2 tracking-widest"
        >
          梦序塔罗 
          <span className="text-[10px] bg-clip-text text-transparent bg-linear-to-r from-yellow-200 to-amber-500 uppercase tracking-tighter font-sans font-bold">Dream Seq</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-mystic-gold/70 text-xs font-sans font-bold"
        >
          探索时空中的每一个可能
        </motion.p>
      </header>

      {/* Hero Card Container - 拉伸到底部 */}
      <section className="relative flex-1 w-full bg-linear-to-br from-mystic-700 to-mystic-800 rounded-3xl border border-purple-500/30 shadow-inner flex flex-col items-center justify-between px-6 pb-6 pt-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* 顶部占位 - 平衡布局 */}
        <div className="flex-1" />

        {/* Animated Tarot Card Mock - 放大 */}
        <motion.div
          animate={{ 
            y: [16, 2, 16],
          }}
          transition={{
            duration: 5, repeat: Infinity, ease: "easeInOut"
          }}
          className="w-48 h-72 bg-linear-to-b from-mystic-700 to-mystic-900 rounded-xl border-2 border-amber-200/40 relative shadow-2xl flex flex-col justify-between p-4"
        >
           <div className="absolute inset-2 border border-amber-200/20 rounded-lg flex items-center justify-center">
             <div className="text-amber-200/20 text-5xl">✧</div>
          </div>
          <div className="w-full flex justify-between opacity-40 text-amber-100 italic">
            <div className="text-[8px] font-tech tracking-widest">XV</div>
            <div className="text-[8px] font-tech tracking-widest">XV</div>
          </div>
          <div className="w-full text-center text-[10px] tracking-[0.2em] text-amber-100/60 uppercase font-tech">The Mystery</div>
        </motion.div>

        {/* 中间占位 */}
        <div className="flex-1" />

        {/* 文字和按钮区域 */}
        <div className="flex flex-col items-center w-full">
          <p className="text-base text-center text-purple-100 font-normal font-sans tracking-wide leading-relaxed px-6 mb-6">
            "塔罗的神秘世界中，命运不再是未知的迷雾"
          </p>

          <button 
            onClick={() => navigate('/tarot')}
            className="px-14 py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-full text-base font-semibold tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-transform text-white"
          >
            开始占卜
          </button>
        </div>

        {/* 底部占位 */}
        <div className="flex-1" />
      </section>

    </motion.div>
  );
};

export default HomePage;
