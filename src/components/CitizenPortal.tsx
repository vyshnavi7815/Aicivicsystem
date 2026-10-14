import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { LanguageCode, CivicReport, ReportStatus } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface CitizenPortalProps {
  language: LanguageCode;
  reports: CivicReport[];
  currentCitizenPhone?: string;
  onNavigateToReport: () => void;
  targetComplaintId?: string;
}

const STATUS_STEPS: ReportStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved – Awaiting Verification',
  'Completed',
];

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  language,
  reports,
  currentCitizenPhone,
  onNavigateToReport,
  targetComplaintId,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [searchId, setSearchId] = useState(targetComplaintId || '');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [activeReport, setActiveReport] = useState<CivicReport | null>(
    targetComplaintId ? reports.find((r) => r.id === targetComplaintId) || reports[0] : reports[0] || null
  );
  const [sliderPosition, setSliderPosition] = useState(50); // For before/after slider

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchId.toLowerCase()) ||
      r.categoryTitle.toLowerCase().includes(searchId.toLowerCase()) ||
      r.location.area.toLowerCase().includes(searchId.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === 'All' || r.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPoints = reports.reduce((acc, curr) => acc + (curr.karmaAwarded || 50), 0);

  const getStatusIndex = (status: ReportStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Citizen Header & Karma Points Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0A1224] border border-cyan-500/30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Citizen Portal &bull; పౌర సేవా కేంద్రం</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Civic Grievance Redressal & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time status updates, field crew dispatch logs, and before-and-after photo verification.
          </p>
        </div>

        {/* Karma Points Card */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
              Civic Karma Score
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">{totalPoints}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                Tier: Eco Vigilante
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by Complaint ID or Ward..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-cyan-400 text-white placeholder-slate-500 text-xs sm:text-sm"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {['All', 'Submitted', 'In Progress', 'Resolved – Awaiting Verification', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStatusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left list of reports, Right active details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaints List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-semibold">
            <span>Registered Reports ({filteredReports.length})</span>
            <button
              onClick={onNavigateToReport}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              <span>+ Report New Issue</span>
            </button>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Layers className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No complaints match your search filter.</p>
              <button
                onClick={() => {
                  setSearchId('');
                  setSelectedStatusFilter('All');
                }}
                className="text-xs text-cyan-400 underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = activeReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setActiveReport(report)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-900 to-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                      {report.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        report.priority === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : report.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {report.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={report.imageUrl}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover bg-slate-950 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {report.categoryTitle}
                      </p>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span>{report.location.area}, {report.location.city}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Status: <span className="text-cyan-300 font-semibold">{report.status}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed View of Active Complaint (7 cols) */}
        <div className="lg:col-span-7">
          {activeReport ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black font-mono text-cyan-300">
                      {activeReport.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                      {activeReport.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {activeReport.categoryTitle}
                  </h2>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-400">
                  <span className="block">Logged on:</span>
                  <span className="text-slate-200 font-medium">
                    {new Date(activeReport.createdAt).toLocaleDateString()} at{' '}
                    {new Date(activeReport.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Live Timeline Tracker */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Redressal Progress Timeline</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {STATUS_STEPS.map((stepName, idx) => {
                    const currentIndex = getStatusIndex(activeReport.status);
                    const isDone = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={stepName} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                            isDone
                              ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-cyan-300'
                                : isDone
                                ? 'text-white'
                                : 'text-slate-500'
                            }`}
                          >
                            {stepName}
                          </p>
                          {isCurrent && (
                            <p className="text-[11px] text-cyan-400/80 mt-0.5 font-medium">
                              Active stage &bull; Assigned to {activeReport.assignedDepartment || 'Ward Response Officer'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department & Officer Info */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Assigned Department</span>
                  <span className="font-bold text-white">
                    {activeReport.assignedDepartment || 'Municipal Operations Wing'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Assigned Field Worker / Vehicle</span>
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{activeReport.assignedWorker || 'Squad #04 Dispatched'}</span>
                  </span>
                </div>
              </div>

              {/* Citizen Description */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block">Citizen Statement:</span>
                <p className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-200 leading-relaxed">
                  {activeReport.description}
                </p>
              </div>

              {/* Before and After Proof Viewer */}
              {activeReport.beforeAfterVerification && activeReport.beforeAfterVerification.workerPhotoUrl ? (
                <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-b from-cyan-950/30 to-slate-950 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">
                        AI Before-and-After Resolution Proof
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      {activeReport.beforeAfterVerification.status} ({activeReport.beforeAfterVerification.resolutionScore}% Match)
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    {activeReport.beforeAfterVerification.analysisNotes}
                  </p>

                  {/* Dual image preview */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Before (Citizen Report)
                      </span>
                      <img
                        src={activeReport.imageUrl}
                        alt="Before"
                        className="w-full h-36 object-cover rounded-xl border border-slate-800 bg-slate-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
                        After (Worker Resolution)
                      </span>
                      <img
                        src={activeReport.beforeAfterVerification.workerPhotoUrl}
                        alt="After"
                        className="w-full h-36 object-cover rounded-xl border border-emerald-500/40 bg-slate-950"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center gap-3">
                  <img
                    src={activeReport.imageUrl}
                    alt="Problem"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-white block">Submitted Evidence Photo</span>
                    <p className="text-slate-400 text-[11px]">
                      Awaiting completion photograph from the assigned field supervisor.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              Select a complaint from the left to view timeline details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
