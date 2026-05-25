import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, History, Shield, Trash2, ChevronRight, User, X, 
  MapPin, Clock, Calendar, Sparkles, Compass, AlertTriangle, BookOpen, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  getTarotHistory, getAstrologyHistory, getResonanceDays, 
  clearLocalStorageData, TarotHistoryEntry, AstrologyHistoryEntry 
} from '../lib/storage';
import { tarotCards, TarotCard } from '../data/tarot';
import TarotResultView from '../components/TarotResultView';
import ImageWithPlaceholder from '../components/ImageWithPlaceholder';

const ProfilePage: React.FC = () => {
  // Offline state
  const [tarotHist, setTarotHist] = useState<TarotHistoryEntry[]>([]);
  const [astrologyHist, setAstrologyHist] = useState<AstrologyHistoryEntry[]>([]);
  const [resonanceCount, setResonanceCount] = useState(1);

  // Modal toggle states
  const [activeTarotResult, setActiveTarotResult] = useState<any | null>(null);
  const [activeAstrologyResult, setActiveAstrologyResult] = useState<AstrologyHistoryEntry | null>(null);
  
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Feedback states
  const [clearingProgress, setClearingProgress] = useState<'idle' | 'clearing' | 'done'>('idle');

  // Load offline data on page entry
  const loadOfflineData = () => {
    setTarotHist(getTarotHistory());
    setAstrologyHist(getAstrologyHistory());
    setResonanceCount(getResonanceDays());
  };

  useEffect(() => {
    loadOfflineData();
  }, []);

  // Compute stats
  const totalReadings = tarotHist.length + astrologyHist.length;

  // Combine records chronologically - Memoized for performance
  const allRecords = React.useMemo(() => {
    return [
      ...tarotHist.map(t => ({ ...t, kind: 'tarot' as const, timeVal: parseInt(t.id) })),
      ...astrologyHist.map(a => ({ ...a, kind: 'astrology' as const, timeVal: parseInt(a.id) }))
    ].sort((a, b) => b.timeVal - a.timeVal);
  }, [tarotHist, astrologyHist]);

  const displayedRecords = React.useMemo(() => {
    return showAllHistory ? allRecords : allRecords.slice(0, 5);
  }, [allRecords, showAllHistory]);

  // Clear data trigger
  const handleConfirmClear = () => {
    setClearingProgress('clearing');
    setTimeout(() => {
      clearLocalStorageData();
      loadOfflineData();
      setClearingProgress('done');
      setTimeout(() => {
        setClearingProgress('idle');
        setShowClearConfirmModal(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-32 max-w-2xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full glass border-2 border-mystic-gold/30 p-1">
             <div className="w-full h-full rounded-full bg-linear-to-tr from-purple-800 to-indigo-900 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-white/30" />
             </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPrivacyModal(true)}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full glass-bright flex items-center justify-center border border-white/10 cursor-pointer"
            title="隐私说明"
          >
            <Info className="w-4 h-4 text-mystic-gold" />
          </motion.div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold text-white tracking-widest">寻星旅人</h2>
        </div>
      </header>

      {/* History Records */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-mystic-accent" />
            <h3 className="font-semibold text-lg text-white">我的记录</h3>
          </div>
          {allRecords.length > 5 && (
            <button 
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {showAllHistory ? '收起记录' : '查看全部'}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {displayedRecords.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-white/20 text-xs italic border border-white/5">
              暂未记录星系律动。开始你的第一次占卜或排盘吧。
            </div>
          ) : (
            displayedRecords.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() => {
                  if (item.kind === 'tarot') {
                    setActiveTarotResult(item.analysis);
                  } else {
                    setActiveAstrologyResult(item as AstrologyHistoryEntry);
                  }
                }}
                className="glass rounded-3xl p-4 flex items-center justify-between group cursor-pointer border border-white/5 hover:border-white/10"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl glass-bright flex items-center justify-center text-[10px] font-bold shrink-0",
                    item.kind === 'tarot' ? "text-mystic-accent" : "text-mystic-pink"
                  )}>
                    {item.type}
                  </div>
                  <div className="min-w-0 p-0.5">
                    <h4 className="text-sm font-medium text-white truncate pr-2">{item.title}</h4>
                    <div className="flex items-center gap-2 overflow-hidden">
                       <span className="text-[10px] text-white/30 font-mono shrink-0">{item.date}</span>
                       {item.kind === 'tarot' && <span className="text-[10px] text-mystic-gold/60 truncate italic">{item.result}</span>}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white shrink-0 transition-colors" />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Settings Grid Panel */}
      <section className="space-y-3">
        {[
          { icon: Shield, label: '隐私与安全', color: 'text-blue-400', onClick: () => setShowPrivacyModal(true) },
          { icon: Trash2, label: '清空本地数据', color: 'text-red-400', onClick: () => setShowClearConfirmModal(true) },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={item.onClick}
            className="glass rounded-3xl p-4 flex items-center justify-between group cursor-pointer border border-white/5 hover:border-white/10 transition-all active:scale-[0.99]"
          >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <span className="text-sm font-medium text-white">{item.label}</span>
             </div>
             <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
          </div>
        ))}
      </section>

      {/* Footnote */}
      <footer className="text-center pb-10">
         <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono">梦序塔罗 V1.0</p>
      </footer>

      {/* 1. Tarot Saved Detail Overlay */}
      {activeTarotResult && (
        <TarotResultView 
          data={activeTarotResult} 
          onClose={() => setActiveTarotResult(null)} 
        />
      )}

      {/* 2. Astrology Saved Detail Modal */}
      <AnimatePresence>
        {activeAstrologyResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#04020a]/95 backdrop-blur-xl overflow-y-auto"
            onClick={() => setActiveAstrologyResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveAstrologyResult(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-white/60 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 space-y-8 max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="text-center space-y-2 mt-4">
                  <Compass className="w-10 h-10 text-mystic-pink mx-auto animate-spin-slow mb-1" />
                  <p className="text-mystic-pink font-mono tracking-widest text-[10px]">SAVED BIRTH CHART</p>
                  <h3 className="text-2xl font-display font-bold text-white uppercase">{activeAstrologyResult.name} 的本命盘</h3>
                </div>

                {/* Info blocks */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-xs text-white/60">
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/30 block">诞生时间</span>
                    <span className="text-white font-mono">{activeAstrologyResult.birthdate} {activeAstrologyResult.time}</span>
                  </div>
                </div>

                {/* Positions */}
                <div className="space-y-4">
                  {[
                    { title: '太阳 (核心人格)', val: activeAstrologyResult.sunSign },
                    { title: '月亮 (内心世界)', val: activeAstrologyResult.moonSign },
                    { title: '上升 (社会面具)', val: activeAstrologyResult.risingSign },
                  ].map((pos, pIdx) => (
                    <div key={pIdx} className="glass p-5 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold font-display text-mystic-gold">{pos.title}</span>
                        <div className="flex items-center gap-1.5 bg-mystic-pink/10 text-mystic-pink px-3 py-1 rounded-full text-xs font-bold">
                          <span>{pos.val.symbol}</span>
                          <span>{pos.val.name}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed pt-1">
                        {pos.val.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveAstrologyResult(null)}
                  className="w-full py-4 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold text-sm tracking-wide shadow-lg cursor-pointer transition-all hover:scale-[1.01]"
                >
                  关闭星盘视图
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 4. Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#04020a]/95 backdrop-blur-xl"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md glass rounded-[2.5rem] p-8 space-y-6 relative border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 mt-4">
                <Shield className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
                <h3 className="text-2xl font-display font-bold text-white">隐私与数据安全</h3>
                <p className="text-xs text-white/40">完全本地化的个人能量分析枢纽</p>
              </div>

              <div className="space-y-4 text-xs text-white/70 leading-relaxed">
                <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-400 font-bold text-[10px]">1</span>
                  </div>
                  <p><strong>绝对离线处理：</strong>梦序塔罗不保留任何网络后端服务器，您的姓名、诞辰日期、占卜问题绝不上传。</p>
                </div>
                <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-400 font-bold text-[10px]">2</span>
                  </div>
                  <p><strong>本端沙盘：</strong>所有测算记录、本命盘星轨均只在设备本地的 `localStorage` 中安全闭环保存。</p>
                </div>
                <div className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-400 font-bold text-[10px]">3</span>
                  </div>
                  <p><strong>单向一键擦除：</strong>您对您的隐私拥有百分之百的掌控权，随时都可以通过本页面「清空本地数据」彻底移除物理残留。</p>
                </div>
              </div>

              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-4 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm tracking-wide shadow-md cursor-pointer transition-all"
              >
                契约知悉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#04020a]/98 backdrop-blur-2xl"
            onClick={() => clearingProgress === 'idle' && setShowClearConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm glass rounded-[2.5rem] p-8 space-y-6 text-center relative border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {clearingProgress === 'idle' && (
                <>
                  <div className="space-y-2">
                    <AlertTriangle className="w-14 h-14 text-red-500 mx-auto animate-bounce" />
                    <h3 className="text-xl font-display font-medium text-white">确定移除所有本地足迹吗？</h3>
                    <p className="text-xs text-white/40 leading-relaxed px-4">该操作将永久擦除设备上本命盘的测算结果、占卜记录以及收藏牌目，此步骤完全物理不可逆。</p>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setShowClearConfirmModal(false)}
                      className="flex-1 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider transition-all border border-white/5 cursor-pointer"
                    >
                      安全返回
                    </button>
                    <button
                      onClick={handleConfirmClear}
                      className="flex-1 py-3.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 transition-all font-bold text-xs tracking-wider cursor-pointer"
                    >
                      彻底清空
                    </button>
                  </div>
                </>
              )}

              {clearingProgress === 'clearing' && (
                <div className="py-8 space-y-4">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-red-500 animate-spin mx-auto" />
                  <p className="text-xs text-white/40 tracking-widest font-mono uppercase">DISCONNECTING RESONANCE...</p>
                </div>
              )}

              {clearingProgress === 'done' && (
                <div className="py-8 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/25 text-red-500 flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                  <p className="text-xs text-white font-bold pt-2">共鸣矩阵重置完成</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
