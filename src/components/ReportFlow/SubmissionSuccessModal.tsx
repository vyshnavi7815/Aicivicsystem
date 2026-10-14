import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  Calendar,
  Share2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import { LanguageCode, CivicReport } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface SubmissionSuccessModalProps {
  report: CivicReport;
  language: LanguageCode;
  onTrackComplaint: (id: string) => void;
  onReportAnother: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  report,
  language,
  onTrackComplaint,
  onReportAnother,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(report.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#070B14] border border-cyan-500/40 p-6 sm:p-8 text-white shadow-2xl shadow-cyan-500/20 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration icon badge */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-xl shadow-cyan-500/30 mb-5">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5] text-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Titles */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          {t.successTitle}
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
          {t.successMessage}
        </p>

        {/* Prominent Complaint ID Container */}
        <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 mb-6 space-y-2">
          <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-widest block">
            {t.complaintIdLabel}
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-300 tracking-wider">
              {report.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
              title="Copy Complaint ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <span className="text-[11px] text-emerald-400 font-medium block">
              Complaint ID copied to clipboard!
            </span>
          )}
        </div>

        {/* Report metadata chip */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 text-left text-xs space-y-1.5 text-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Category:</span>
            <span className="font-bold text-white">{report.categoryTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Ward Location:</span>
            <span className="text-slate-300 font-medium">{report.location.area}, {report.location.city}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Priority Assigned:</span>
            <span className={`font-bold ${report.priority === 'Critical' ? 'text-rose-400' : 'text-cyan-400'}`}>
              {report.priority}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Initial Status:</span>
            <span className="text-cyan-300 font-semibold">{t.statusSubmitted}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
            <span className="text-slate-500">Civic Karma Earned:</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> +50 Karma Points
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onTrackComplaint(report.id)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>{t.trackComplaintButton}</span>
          </button>

          <button
            type="button"
            onClick={onReportAnother}
            className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
          >
            {t.submitAnotherButton}
          </button>
        </div>
      </div>
    </div>
  );
};
