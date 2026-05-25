import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { saveAstrologyHistory } from '../lib/storage';

interface ZodiacInfo {
  name: string;
  enName: string;
  symbol: string;
  element: '火' | '土' | '风' | '水';
  desc: string;
}

const zodiacs: ZodiacInfo[] = [
  { name: '白羊座', enName: 'ARIES', symbol: '♈', element: '火', desc: '你天生拥有旺盛的生命力、出色的领导力与直率坦诚的个性。无论是追求梦想还是应对日常，你总是勇往直前、热烈而赤诚。' },
  { name: '金牛座', enName: 'TAURUS', symbol: '♉', element: '土', desc: '你具有极强的审美品味 and 脚踏实地的务实精神。内心稳健、善于积累，对物质与纯粹的情感拥有极高的要求与坚守。' },
  { name: '双子座', enName: 'GEMINI', symbol: '♊', element: '风', desc: '你极具灵气与敏捷的思维。对外部世界充满无尽的好奇心，擅长信息收集和与人建立轻松、高响应的沟通。' },
  { name: '巨蟹座', enName: 'CANCER', symbol: '♋', element: '水', desc: '你怀揣敏锐的直觉和深沉的温柔。情感细腻开阔，重视家庭和自我的安全感，能给周围人带来如水般的滋养。' },
  { name: '狮子座', enName: 'LEO', symbol: '♌', element: '火', desc: '你充满着阳光、自信和无与伦比的慷慨豪迈。舞台属于像你这样勇敢的开创者，你的温暖与正能量时刻感召着旁人。' },
  { name: '处女座', enName: 'VIRGO', symbol: '♍', element: '土', desc: '你拥有一颗冷静、睿智且极有条理的心。做事一丝不苟，擅于在琐碎的数据及能量流动中寻回最极致的纯正秩序。' },
  { name: '天秤座', enName: 'LIBRA', symbol: '♎', element: '风', desc: '你的一生都在追寻美、和谐与能量的精妙平衡。你谈吐得体、气质儒雅，擅长在复杂多变的关系网中斡旋调和。' },
  { name: '天蝎座', enName: 'SCORPIO', symbol: '♏', element: '水', desc: '你拥有无比深邃的情感世界和极好的洞察力。沉稳冷峻的外表下，是一颗重情义、敢爱敢恨、绝不轻言放弃的炽热灵魂。' },
  { name: '射手座', enName: 'SAGITTARIUS', symbol: '♐', element: '火', desc: '你天生向往纯粹的自由、远方的真理与高维智慧。乐观豁达、充满探索欲的你总能将生活的挑战转化为精妙的旅程。' },
  { name: '摩羯座', enName: 'CAPRICORN', symbol: '♑', element: '土', desc: '你的核心人格充满了稳健的进取心与高度的定力。你天生具有运筹帷幄的潜质，懂得通过坚韧与自律在岁月中不断升格。' },
  { name: '水瓶座', enName: 'AQUARIUS', symbol: '♒', element: '风', desc: '你是走在时代前沿的开拓先锋。思想独立、充满人文主义关怀，不随波逐流并坚持以独特的角度审视并改善世界。' },
  { name: '双鱼座', enName: 'PISCES', symbol: '♓', element: '水', desc: '你拥有丰盈的精神世界、极致的灵感与包容万物的同理心。艺术感十足的你，常常能在虚实变幻间洞彻生命的本源。' }
];

const getSolarSign = (dateStr: string): ZodiacInfo => {
  if (!dateStr) return zodiacs[9]; // 默认摩羯
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return zodiacs[9];
  const month = d.getMonth() + 1; // 1-12
  const day = d.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacs[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacs[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return zodiacs[2];
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return zodiacs[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacs[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacs[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return zodiacs[6];
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return zodiacs[7];
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return zodiacs[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacs[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacs[10];
  return zodiacs[11]; // 双鱼座
};

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const HoroscopePage: React.FC = () => {
  const [step, setStep] = useState<'input' | 'calculating' | 'result'>('input');
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '2000-01-01',
    time: '12:00'
  });

  const [sunSign, setSunSign] = useState<ZodiacInfo>(zodiacs[9]);
  const [moonSign, setMoonSign] = useState<ZodiacInfo>(zodiacs[7]);
  const [risingSign, setRisingSign] = useState<ZodiacInfo>(zodiacs[2]);

  const calcTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (calcTimerRef.current) {
        clearTimeout(calcTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('calculating');

    // Calculate zodiacs deterministically offline
    const solar = getSolarSign(formData.birthdate);
    const hashSeed = simpleHash(formData.name + formData.birthdate + formData.time);
    
    // Pick different zodiac for Moon
    let moonIdx = (hashSeed + 3) % 12;
    if (zodiacs[moonIdx].name === solar.name) {
      moonIdx = (moonIdx + 1) % 12;
    }
    const moon = zodiacs[moonIdx];

    // Pick different zodiac for Rising
    let risingIdx = (hashSeed + 7) % 12;
    if (zodiacs[risingIdx].name === solar.name || zodiacs[risingIdx].name === moon.name) {
      risingIdx = (risingIdx + 1) % 12;
      if (zodiacs[risingIdx].name === solar.name || zodiacs[risingIdx].name === moon.name) {
        risingIdx = (risingIdx + 1) % 12;
      }
    }
    const rising = zodiacs[risingIdx];

    setSunSign(solar);
    setMoonSign(moon);
    setRisingSign(rising);

    // Save to astrology history
    const dateObj = new Date();
    const formattedDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
    
    saveAstrologyHistory({
      id: String(Date.now()),
      type: '星盘',
      title: '本命盘解读',
      date: formattedDate,
      name: formData.name,
      birthdate: formData.birthdate,
      time: formData.time,
      sunSign: solar,
      moonSign: moon,
      risingSign: rising
    });

    calcTimerRef.current = setTimeout(() => setStep('result'), 3000);
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-32 max-w-2xl mx-auto overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <header className="space-y-1">
               <h1 className="text-3xl font-sans font-bold text-mystic-gold tracking-widest">星盘解读</h1>
               <p className="text-mystic-gold/70 text-xs font-sans font-bold">洞见宇宙中的自己</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="glass rounded-4xl p-8 space-y-6 border-white/5 shadow-2xl">
                <div className="space-y-4">
                  <label className="text-xs font-tech uppercase text-white/40 tracking-widest pl-2">契约姓名</label>
                  <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/5 focus-within:border-mystic-pink/50 transition-all flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-mystic-pink" />
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="如何称呼你？" 
                      className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-white/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-xs font-tech uppercase text-white/40 tracking-widest pl-2">诞生日期</label>
                    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 border-white/5">
                      <Calendar className="w-4 h-4 text-white/30" />
                      <input 
                        type="date" 
                        required 
                        value={formData.birthdate}
                        onChange={e => setFormData({...formData, birthdate: e.target.value})}
                        className="bg-transparent border-none focus:ring-0 w-full text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-tech uppercase text-white/40 tracking-widest pl-2">诞生时刻</label>
                    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 border-white/5">
                      <Clock className="w-4 h-4 text-white/30" />
                      <input 
                        type="time" 
                        required 
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className="bg-transparent border-none focus:ring-0 w-full text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
              >
                连接星界频率 <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[70vh] flex flex-col items-center justify-center gap-10"
          >
             <div className="relative">
                <Compass className="w-32 h-32 text-mystic-pink animate-spin-slow opacity-30" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] border-2 border-dashed border-mystic-pink/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-40px] border border-mystic-accent/10 rounded-full"
                />
             </div>
             <div className="text-center space-y-2">
                <p className="text-xl font-display text-white italic">"正在绘制属于你的时空刻度..."</p>
                <div className="flex justify-center gap-1">
                  {[1,2,3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 h-1 bg-mystic-pink rounded-full"
                    />
                  ))}
                </div>
             </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10 pb-10"
          >
            <div className="text-center space-y-2">
              <p className="text-mystic-pink font-tech tracking-widest text-xs">BIRTH CHART FOR</p>
              <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">{formData.name}</h2>
            </div>

            {/* CHART VISUAL WITH DYNAMIC CONSTELLATION SYMBOL */}
            <div className="relative aspect-square w-full max-w-sm mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/5 glass" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-white/10" />
              <div className="absolute inset-12 rounded-full border border-mystic-pink/20 bg-mystic-900/40 backdrop-blur-sm" />
              
              {/* Star Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d="M 50 10 L 50 90 M 10 50 L 90 50 M 20 20 L 80 80 M 80 20 L 20 80"
                  stroke="rgba(246, 135, 179, 0.4)" 
                  strokeWidth="0.5" 
                  fill="none" 
                />
                {[...Array(12)].map((_, i) => (
                  <text 
                    key={i} 
                    x={50 + 40 * Math.cos(i * 30 * Math.PI / 180)} 
                    y={50 + 40 * Math.sin(i * 30 * Math.PI / 180) + 1.5} 
                    className="fill-white/30 text-[4px]"
                    textAnchor="middle"
                  >
                    ★
                  </text>
                ))}
              </svg>

              <div className="relative z-10 text-center space-y-1">
                 <p className="text-4xl select-none">{sunSign.symbol}</p>
                 <p className="text-xs font-tech tracking-widest text-mystic-gold">{sunSign.name} / {sunSign.enName}</p>
              </div>
            </div>

            {/* Interpretation Cards */}
            <section className="grid grid-cols-1 gap-6">
              {[
                { 
                  title: '太阳', 
                  value: sunSign.name, 
                  label: '核心人格', 
                  desc: sunSign.desc, 
                  color: 'mystic-gold' 
                },
                { 
                  title: '月亮', 
                  value: moonSign.name, 
                  label: '内心世界', 
                  desc: `你拥有极佳的直觉和潜意识共鸣感。月亮在此预示着，落在以「${moonSign.element}」象守护的【${moonSign.name}】，代表你的隐秘需求在于建立真正的精神确定性。${moonSign.desc}`, 
                  color: 'mystic-pink' 
                },
                { 
                  title: '上升', 
                  value: risingSign.name, 
                  label: '社会人格', 
                  desc: `你给世界的第一印象，正是由上升【${risingSign.name}】代表的「${risingSign.element}」象之风引领。你具有独特的行事魅力，总能优雅得体、顺势自如地探索世间万物。${risingSign.desc}`, 
                  color: 'mystic-accent' 
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass rounded-3xl p-6 border-white/5 group hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-white/30 font-tech uppercase tracking-widest">{item.label}</p>
                      <h4 className="text-xl font-display font-bold text-white">{item.title}能量</h4>
                    </div>
                    <div className={cn("px-4 py-1.5 rounded-full glass-bright text-xs font-bold", `text-${item.color}`)}>
                      {item.value}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </section>

            <button onClick={() => setStep('input')} className="w-full py-4 glass rounded-full text-white/60 hover:text-white cursor-pointer active:scale-95 transition-all">重新排盘</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoroscopePage;
