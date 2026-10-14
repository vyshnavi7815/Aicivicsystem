import React from 'react';
import {
  ShieldAlert,
  MapPin,
  FileText,
  LayoutDashboard,
  Flame,
  Route,
  Award,
  Bot,
  Globe,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenChat: () => void;
  pendingReportsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  onOpenChat,
  pendingReportsCount = 0,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-[#070B14]/90 backdrop-blur-md border-b border-cyan-500/20 text-white">
      {/* Top emergency ribbon */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-cyan-950/70 px-4 py-1.5 text-xs border-b border-cyan-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-300">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span className="font-medium tracking-wide">
            CivicAI City Operations Network &bull; Live Automated Triage & Smart Dispatch
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <a
            href="tel:112"
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.emergencyHelpline}</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('report')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition">
              <div className="w-full h-full bg-[#090E1A] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  CivicAI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  GovTech 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onTabChange('report')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'report'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{t.navReport}</span>
            </button>

            <button
              onClick={() => onTabChange('citizen')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'citizen'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{t.navCitizenPortal}</span>
            </button>

            <button
              onClick={() => onTabChange('admin')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'admin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>{t.navAdminPortal}</span>
              {pendingReportsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => onTabChange('hotspots')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'hotspots'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{t.navHotspots}</span>
            </button>

            <button
              onClick={() => onTabChange('routes')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'routes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Route className="w-4 h-4 text-emerald-400" />
              <span>{t.navRoutes}</span>
            </button>

            <button
              onClick={() => onTabChange('rewards')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'rewards'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-yellow-400" />
              <span>{t.navRewards}</span>
            </button>
          </nav>

          {/* Right actions: Chatbot + Language selector */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
              title="Open CivicBot AI Assistant"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">{t.navChatbot}</span>
            </button>

            {/* Language dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 text-xs font-medium text-cyan-200 transition">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">{currentLangObj.nativeName}</span>
              </button>

              <div className="absolute right-0 mt-1 w-48 bg-[#0D1527] border border-cyan-500/30 rounded-xl shadow-2xl py-2 hidden group-hover:block hover:block z-50 backdrop-blur-xl">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Select Language / భాష
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition ${
                      language === lang.code
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-2 border-cyan-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom nav tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          {[
            { id: 'report', label: t.navReport, icon: MapPin },
            { id: 'citizen', label: t.navCitizenPortal, icon: FileText },
            { id: 'admin', label: t.navAdminPortal, icon: LayoutDashboard },
            { id: 'hotspots', label: t.navHotspots, icon: Flame },
            { id: 'routes', label: t.navRoutes, icon: Route },
            { id: 'rewards', label: t.navRewards, icon: Award },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                  currentTab === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
