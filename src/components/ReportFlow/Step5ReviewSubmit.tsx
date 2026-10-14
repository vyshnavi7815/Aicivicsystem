import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit2,
  MapPin,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  FileCheck,
  Send,
} from 'lucide-react';
import { LanguageCode, LocationData, AIAnalysisResult, CivicReport } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { CIVIC_CATEGORIES } from '../../data/categories';
import { LeafletMap } from '../LeafletMap';

interface Step5ReviewSubmitProps {
  language: LanguageCode;
  citizenName: string;
  citizenPhone: string;
  location: LocationData;
  selectedCategoryId: string;
  description: string;
  imageUrl: string;
  observationDateTime: string;
  additionalNotes: string;
  aiAnalysis: AIAnalysisResult | null;
  onEditStep: (stepNumber: number) => void;
  onBack: () => void;
  onSuccessfulSubmission: (report: CivicReport) => void;
}

export const Step5ReviewSubmit: React.FC<Step5ReviewSubmitProps> = ({
  language,
  citizenName,
  citizenPhone,
  location,
  selectedCategoryId,
  description,
  imageUrl,
  observationDateTime,
  additionalNotes,
  aiAnalysis,
  onEditStep,
  onBack,
  onSuccessfulSubmission,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentCategory = CIVIC_CATEGORIES.find((c) => c.id === selectedCategoryId);

  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const estimatedSeverity = aiAnalysis?.estimatedSeverity || currentCategory?.urgencyDefault || 'Medium';

  const handleFinalSubmit = async () => {
    if (!confirmedAccuracy) {
      setSubmissionError('Please check the confirmation box to certify accuracy before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const payload = {
        citizenName,
        citizenPhone: citizenPhone || 'Not provided',
        language,
        categoryId: selectedCategoryId,
        categoryTitle: currentCategory?.title || selectedCategoryId,
        description,
        imageUrl,
        location,
        observationDateTime,
        additionalNotes,
        aiAnalysis: aiAnalysis || undefined,
        priority: estimatedSeverity,
        isHazardous: currentCategory?.isHazardous || false,
        assignedDepartment: currentCategory?.defaultDepartment || 'Municipal Grievance Cell',
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit complaint to municipal database');
      }

      onSuccessfulSubmission(data.report);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmissionError(err.message || 'Error saving report. Please verify connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Step 5 of 5: Review & Final Submission</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.step5Title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          {t.step5Subtitle}
        </p>
      </div>

      {submissionError && (
        <div className="p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      <div className="space-y-5 mb-8">
        {/* Card 1: Citizen & Administrative Area */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{t.summaryCitizenDetails}</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.edit}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Name:</span>
              <span className="font-bold text-white text-sm">{citizenName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Contact Phone:</span>
              <span className="text-slate-200">{citizenPhone || 'None Provided'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Area / Ward:</span>
              <span className="text-slate-200 font-semibold">{location.area}, {location.city}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Problem Category & Priority */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.summaryProblem}</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.edit}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentCategory?.imageUrl && (
                <img
                  src={currentCategory.imageUrl}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border border-cyan-500/30"
                />
              )}
              <div>
                <span className="text-sm font-bold text-white block">
                  {currentCategory?.title}
                </span>
                <span className="text-xs text-slate-400">
                  Department: {currentCategory?.defaultDepartment}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                  Target Priority
                </span>
                <span
                  className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                    estimatedSeverity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : estimatedSeverity === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {estimatedSeverity} Priority
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-cyan-300 block mb-1">Citizen Statement:</span>
            <p className="leading-relaxed">{description}</p>
            {additionalNotes && (
              <p className="mt-1 text-slate-400 italic">Landmark reference: {additionalNotes}</p>
            )}
          </div>
        </div>

        {/* Card 3: Photographic Evidence & AI Vision */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{t.summaryEvidence} & AI Assessment</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.edit}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1.5 font-medium">Original Citizen Photo</span>
              <img
                src={imageUrl}
                alt="Evidence"
                className="w-full h-44 object-cover rounded-xl border border-slate-800 bg-slate-950"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-bold text-cyan-300">AI Vision Score</span>
                <span className="font-mono text-cyan-400">
                  {aiAnalysis?.confidenceScore || 94}% Confidence
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Detected Civic Entity:</span>
                <span className="font-semibold text-white">
                  {aiAnalysis?.detectedCategory || currentCategory?.title}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Classified Damage:</span>
                <span className="text-slate-300">
                  {aiAnalysis?.wasteOrDamageType || 'Structural defect requiring repair'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Advisory Action:</span>
                <span className="text-slate-300">
                  {aiAnalysis?.suggestedAction || 'Deploy standard ward response team.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Location on Map */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{t.summaryLocation}</span>
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.edit}</span>
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800">
            <LeafletMap
              center={[location.latitude, location.longitude]}
              zoom={15}
              interactivePicker={false}
              markers={[
                {
                  id: 'NEW-REPORT',
                  latitude: location.latitude,
                  longitude: location.longitude,
                  title: currentCategory?.title || 'Civic Problem',
                  category: currentCategory?.title || 'Civic',
                  priority: estimatedSeverity,
                  status: 'Ready to Dispatch',
                  address: location.address || `${location.area}, ${location.city}`,
                },
              ]}
              height="200px"
            />
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Location: {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E ({location.landmark || location.address || location.area})
          </p>
        </div>

        {/* Accuracy Declaration Checkbox */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmedAccuracy}
              onChange={(e) => setConfirmedAccuracy(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950"
            />
            <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {t.accuracyDeclaration}
            </span>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-sm font-black shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.submitting}</span>
            </>
          ) : (
            <>
              <span>{t.submitReportButton}</span>
              <Send className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
