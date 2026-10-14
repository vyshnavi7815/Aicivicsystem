import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  ShieldAlert,
  Check,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  Droplets,
  Trash2,
  Trees,
  Waves,
  LightbulbOff,
  CloudRain,
  AlertOctagon,
  Pipette,
  Truck,
  HeartHandshake,
  Wind,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { CIVIC_CATEGORIES } from '../../data/categories';

interface Step3ProblemSelectProps {
  language: LanguageCode;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Trash2,
  Droplets,
  AlertTriangle,
  Waves,
  CloudRain,
  LightbulbOff,
  Trees,
  ShieldAlert,
  AlertOctagon,
  Pipette,
  Truck,
  HeartHandshake,
  Zap,
  Wind,
  Volume2,
  HelpCircle,
};

export const Step3ProblemSelect: React.FC<Step3ProblemSelectProps> = ({
  language,
  selectedCategoryId,
  onSelectCategory,
  onContinue,
  onBack,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(false);

  const filteredCategories = CIVIC_CATEGORIES.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategoryObj = CIVIC_CATEGORIES.find((c) => c.id === selectedCategoryId);

  const handleProceed = () => {
    if (!selectedCategoryId) {
      setErrorPrompt(true);
      return;
    }
    setErrorPrompt(false);
    onContinue();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 3 of 5: Problem Classification</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.step3Title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          {t.step3Subtitle}
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 mb-6 flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold block text-amber-300 mb-0.5">{t.hazardWarning}</span>
          <span>{t.hazardAdvise}</span>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchCategories}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-xs sm:text-sm"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-cyan-300 font-semibold">{filteredCategories.length}</span> of 16 categories
        </div>
      </div>

      {errorPrompt && (
        <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
          Please select a civic problem category before proceeding.
        </div>
      )}

      {/* Categories Grid (16 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const Icon = CATEGORY_ICONS[cat.iconName] || HelpCircle;

          return (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setErrorPrompt(false);
              }}
              className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02] ring-2 ring-cyan-400/80'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white'
              }`}
            >
              {/* Category realistic photo thumbnail */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to solid smart city gradient if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Hazardous Safety Badge */}
                {cat.isHazardous && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300 text-[10px] font-bold shadow-md">
                    <Zap className="w-3 h-3 text-rose-400" />
                    <span>HAZARD ALERT</span>
                  </div>
                )}

                {/* Selection Indicator */}
                <div
                  className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md ring-2 ring-white'
                      : 'bg-slate-900/70 border border-slate-600 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white drop-shadow-md">
                    {cat.title}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Dept: {cat.defaultDepartment.split('&')[0]}</span>
                  <span className={`font-semibold ${cat.urgencyDefault === 'Critical' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {cat.urgencyDefault} Urgency
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Sticky preview */}
      {selectedCategoryObj && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img
              src={selectedCategoryObj.imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover border border-cyan-500/30"
            />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold block">
                {t.selectedCategory}
              </span>
              <p className="text-sm font-bold text-white">{selectedCategoryObj.title}</p>
              <p className="text-xs text-slate-300 hidden sm:block">{selectedCategoryObj.description}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Ready to Detail
          </span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-sm font-black shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <span>{t.next}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
