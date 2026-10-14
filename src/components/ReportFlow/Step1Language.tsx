import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../../i18n/translations';

interface Step1LanguageProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onContinue: () => void;
}

export const Step1Language: React.FC<Step1LanguageProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
}) => {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-white">
      {/* Hero section */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multilingual Smart City Portal &bull; భాషను ఎంచుకోండి</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          {t.step1Title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.step1Subtitle}
        </p>

        <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold pt-2">
          Step 1 of 5: {t.selectLanguagePrompt}
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 group ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.03] ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <span className="text-3xl mb-2">{lang.flag}</span>

              <span className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition">
                {lang.nativeName}
              </span>

              <span className="text-xs text-slate-400 mt-0.5">
                {lang.name}
              </span>

              <span className="text-[11px] text-cyan-400/80 font-medium mt-2 px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-900/60">
                {lang.sampleGreeting}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feature highlights bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-8 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Real-time municipal ticket logging</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>AI Vision multi-category detection</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Transparent before-and-after proof</span>
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>{t.step1Continue}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
