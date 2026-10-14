import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Mic,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
  ArrowLeft,
  X,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode, AIAnalysisResult } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { CIVIC_CATEGORIES } from '../../data/categories';

interface Step4DescribeUploadProps {
  language: LanguageCode;
  selectedCategoryId: string;
  onUpdateCategory: (id: string) => void;
  description: string;
  setDescription: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  observationDateTime: string;
  setObservationDateTime: (val: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (val: string) => void;
  aiAnalysis: AIAnalysisResult | null;
  setAiAnalysis: (val: AIAnalysisResult | null) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step4DescribeUpload: React.FC<Step4DescribeUploadProps> = ({
  language,
  selectedCategoryId,
  onUpdateCategory,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  observationDateTime,
  setObservationDateTime,
  additionalNotes,
  setAdditionalNotes,
  aiAnalysis,
  setAiAnalysis,
  onContinue,
  onBack,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showCategoryMismatchPrompt, setShowCategoryMismatchPrompt] = useState(false);
  const [validationError, setValidationError] = useState('');

  const currentCategory = CIVIC_CATEGORIES.find((c) => c.id === selectedCategoryId);

  // File Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setValidationError('Image size exceeds 12MB limit.');
      return;
    }

    setValidationError('');
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      setAiAnalysis(null); // Reset previous analysis on new photo
      setShowCategoryMismatchPrompt(false);
    };
    reader.readAsDataURL(file);
  };

  // AI Vision Analysis Request to Server
  const handleAnalyzeWithAI = async () => {
    if (!imageUrl) {
      setValidationError('Please upload a photograph first to run AI Vision analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');
    setShowCategoryMismatchPrompt(false);

    try {
      const res = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageUrl,
          selectedCategoryId,
          categoryTitle: currentCategory?.title || selectedCategoryId,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI analysis failed');
      }

      setAiAnalysis(data.analysis);

      // Check category alignment
      if (
        data.analysis?.detectedCategory &&
        data.analysis.detectedCategory.toLowerCase() !== (currentCategory?.title || '').toLowerCase() &&
        data.analysis.categoryMatched === false
      ) {
        setShowCategoryMismatchPrompt(true);
      }
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setAnalysisError('AI analysis service currently busy. You can still proceed with your submission.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Voice Input Speech Recognition
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListeningVoice(true);
    recognition.onend = () => setIsListeningVoice(false);
    recognition.onerror = () => setIsListeningVoice(false);

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setDescription(description ? `${description} ${speechText}` : speechText);
      setIsListeningVoice(false);
    };

    recognition.start();
  };

  const handleConfirmCategorySwitch = () => {
    if (!aiAnalysis?.detectedCategory) return;
    const match = CIVIC_CATEGORIES.find(
      (c) => c.title.toLowerCase() === aiAnalysis.detectedCategory.toLowerCase()
    );
    if (match) {
      onUpdateCategory(match.id);
    }
    setShowCategoryMismatchPrompt(false);
  };

  const handleFormContinue = () => {
    if (!description.trim()) {
      setValidationError('Please provide a short description of the problem.');
      return;
    }
    if (!imageUrl) {
      setValidationError('Please upload or snap a photograph of the civic problem.');
      return;
    }

    setValidationError('');
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>Step 4 of 5: Evidence & AI Analysis</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.step4Title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          {t.step4Subtitle}
        </p>
      </div>

      {validationError && (
        <div className="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Selected Category Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {currentCategory?.imageUrl && (
            <img
              src={currentCategory.imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover border border-cyan-500/30"
            />
          )}
          <div>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block">
              Selected Civic Category
            </span>
            <span className="text-sm font-bold text-white">
              {currentCategory?.title || 'Civic Issue'}
            </span>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
          Target: {currentCategory?.defaultDepartment?.split('&')[0]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Column: Photograph Upload & Camera */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Photographic Evidence</span>
              </h3>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Hidden Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload Area / Preview */}
            {!imageUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-xl p-8 text-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-950/80 group"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {t.uploadPhoto}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {t.uploadPhotoHint}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t.takePhotoCamera}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 group">
                <img
                  src={imageUrl}
                  alt="Citizen Upload"
                  className="w-full h-56 object-cover bg-slate-950"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end justify-between p-3">
                  <span className="text-xs font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                    Uploaded Evidence Photo
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-xs text-white border border-slate-700 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t.replacePhoto}</span>
                  </button>
                </div>
              </div>
            )}

            {/* AI Vision Analysis Trigger Button */}
            {imageUrl && (
              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? t.aiAnalyzing : t.aiAnalyzeButton}</span>
              </button>
            )}

            {analysisError && (
              <p className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900">
                {analysisError}
              </p>
            )}

            {/* AI Results Card */}
            {aiAnalysis && (
              <div className="p-4 rounded-xl bg-gradient-to-b from-cyan-950/50 to-slate-950 border border-cyan-500/40 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-200">
                      {t.aiResultsTitle}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {aiAnalysis.confidenceScore}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.detectedIssue}</span>
                    <span className="font-bold text-white">{aiAnalysis.detectedCategory}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.estimatedSeverity}</span>
                    <span
                      className={`font-bold ${
                        aiAnalysis.estimatedSeverity === 'Critical'
                          ? 'text-rose-400'
                          : aiAnalysis.estimatedSeverity === 'High'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {aiAnalysis.estimatedSeverity}
                    </span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 block">Visible Material / Damage</span>
                  <span className="text-slate-300">{aiAnalysis.wasteOrDamageType}</span>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 block">AI Evidence Summary</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {aiAnalysis.visibleEvidenceSummary}
                  </p>
                </div>

                <div className="text-xs pt-1 border-t border-slate-800">
                  <span className="text-[10px] text-cyan-400 font-semibold block">{t.suggestedAction}</span>
                  <p className="text-slate-200 text-[11px] font-medium">
                    {aiAnalysis.suggestedAction}
                  </p>
                </div>

                {/* Category mismatch prompt */}
                {showCategoryMismatchPrompt && (
                  <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs space-y-2 mt-2">
                    <p className="font-semibold">{t.categoryMismatchWarning}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmCategorySwitch}
                        className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold text-[11px]"
                      >
                        {t.confirmCategorySwitch} ({aiAnalysis.detectedCategory})
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCategoryMismatchPrompt(false)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
                      >
                        {t.keepCurrentCategory}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-500 italic pt-1">
                  {t.aiDisclaimer}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Problem Description & Time Details */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{t.problemDescription} <span className="text-rose-400">*</span></span>
              </label>

              {/* Voice input button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  isListeningVoice
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isListeningVoice ? t.voiceListening : t.voiceInput}</span>
              </button>
            </div>

            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm leading-relaxed"
            />

            {/* Date and Time of observation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.observationDateTime}</span>
              </label>
              <input
                type="datetime-local"
                value={observationDateTime}
                onChange={(e) => setObservationDateTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-xs sm:text-sm font-mono"
              />
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.additionalNotes}
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

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
          onClick={handleFormContinue}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-sm font-black shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <span>{t.next}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
