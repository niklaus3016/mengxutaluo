/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Library, User, Home as HomeIcon } from 'lucide-react';
import StarryBackground from './components/StarryBackground';
import {
  PrivacyModal,
  AgreementModal,
  PrivacyPolicyContent,
  UserAgreementContent,
  DeclineConfirmModal
} from './components/PrivacyConsent';

import HomePage from './pages/HomePage';
import TarotPage from './pages/TarotPage';
import HoroscopePage from './pages/HoroscopePage';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';
import { cn } from './lib/utils';
import React from 'react';

const PRIVACY_CONSENT_KEY = 'mengxutaluo_privacy_consent';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: '占卜' },
    { path: '/horoscope', icon: Compass, label: '星盘' },
    { path: '/library', icon: Library, label: '牌库' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="z-50 bg-mystic-900/90 backdrop-blur-xl border-t border-white/5 pb-6 pt-3 shrink-0">
      <div className="px-8 flex justify-between items-center relative max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative py-1",
                isActive ? "text-mystic-gold" : "text-white/40 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className="text-[9px] font-medium tracking-widest">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-mystic-gold rounded-full shadow-[0_0_8px_#E9D5FF]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AppContent() {
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
  const [showAgreementModal, setShowAgreementModal] = React.useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem(PRIVACY_CONSENT_KEY);
    if (!consent) {
      setShowPrivacyModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, 'accepted');
    setShowPrivacyModal(false);
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, 'declined');
    setShowDeclineModal(false);
    setShowPrivacyModal(false);
    if (typeof window !== 'undefined' && window.close) {
      window.close();
    }
  };

  const handleDeclineCancel = () => {
    setShowDeclineModal(false);
  };

  const handleOpenAgreement = () => {
    setShowAgreementModal('agreement');
  };

  const handleOpenPrivacy = () => {
    setShowAgreementModal('privacy');
  };

  const handleCloseAgreement = () => {
    setShowAgreementModal(null);
  };

  const consent = localStorage.getItem(PRIVACY_CONSENT_KEY);
  if (consent === 'declined') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-mystic-900">
        <div className="text-center text-white/60 p-8">
          <p className="text-lg mb-4">您已拒绝隐私政策</p>
          <p className="text-sm">如需使用本应用，请重新安装并同意隐私政策</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-screen w-full flex flex-col overflow-hidden bg-mystic-900">
        <StarryBackground />

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-0">
          <AnimatePresence mode="popLayout">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tarot/*" element={<TarotPage />} />
              <Route path="/horoscope" element={<HoroscopePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </AnimatePresence>
        </div>

        <Navigation />
      </div>

      <AnimatePresence>
        {showPrivacyModal && (
          <PrivacyModal
            onAccept={handleAccept}
            onDecline={handleDecline}
            onOpenAgreement={handleOpenAgreement}
            onOpenPrivacy={handleOpenPrivacy}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAgreementModal && (
          <AgreementModal
            onClose={handleCloseAgreement}
            title={showAgreementModal === 'agreement' ? '用户服务协议' : '隐私政策'}
            content={showAgreementModal === 'agreement' ? <UserAgreementContent /> : <PrivacyPolicyContent />}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeclineModal && (
          <DeclineConfirmModal
            onConfirm={handleDeclineConfirm}
            onCancel={handleDeclineCancel}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
