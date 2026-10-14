import React, { useState } from 'react';
import {
  ShieldAlert,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Send,
  Sparkles,
  Camera,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  GitMerge,
  Eye,
  FileCheck2,
} from 'lucide-react';
import { LanguageCode, CivicReport, PriorityLevel, ReportStatus, VerificationResult } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { LeafletMap } from './LeafletMap';

interface AdminDashboardProps {
  language: LanguageCode;
  reports: CivicReport[];
  onUpdateReport: (id: string, updates: Partial<CivicReport>) => Promise<void>;
  onRefreshData: () => void;
}

const DEPARTMENTS = [
  'Sanitation & Solid Waste Management',
  'Road Infrastructure & Maintenance Wing',
  'Sewerage & Stormwater Drainage Unit',
  'Water Supply & Quality Board',
  'Municipal Electrical & Lighting Division',
  'Disaster Management & Drainage Control',
  'Horticulture & Emergency Clearing',
  'Enforcement & Environmental Protection Cell',
  'Underground Drainage Safety Taskforce',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  reports,
  onUpdateReport,
  onRefreshData,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Selected officer profile simulation
  const [officerRole, setOfficerRole] = useState<'commissioner' | 'ward_officer' | 'field_engineer'>('ward_officer');
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(reports[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Action form state
  const [editPriority, setEditPriority] = useState<PriorityLevel>('Medium');
  const [editStatus, setEditStatus] = useState<ReportStatus>('In Progress');
  const [editDepartment, setEditDepartment] = useState('');
  const [editWorker, setEditWorker] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [workerPhotoUrl, setWorkerPhotoUrl] = useState('');
  const [isVerifyingAI, setIsVerifyingAI] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<VerificationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sync modal when selectedReport changes
  React.useEffect(() => {
    if (selectedReport) {
      setEditPriority(selectedReport.priority);
      setEditStatus(selectedReport.status);
      setEditDepartment(selectedReport.assignedDepartment || DEPARTMENTS[0]);
      setEditWorker(selectedReport.assignedWorker || '');
      setRejectionReason(selectedReport.rejectionReason || '');
      setWorkerPhotoUrl(selectedReport.beforeAfterVerification?.workerPhotoUrl || '');
      setVerificationFeedback(selectedReport.beforeAfterVerification || null);
    }
  }, [selectedReport]);

  // Key stats
  const totalReports = reports.length;
  const newCount = reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
  const criticalCount = reports.filter((r) => r.priority === 'Critical' || r.priority === 'High').length;
  const inProgressCount = reports.filter((r) => r.status === 'Assigned' || r.status === 'In Progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved – Awaiting Verification' || r.status === 'Completed').length;

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || r.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Handle Save Triage Action
  const handleSaveAction = async () => {
    if (!selectedReport) return;
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const updates: Partial<CivicReport> = {
        priority: editPriority,
        status: editStatus,
        assignedDepartment: editDepartment,
        assignedWorker: editWorker || 'Field Response Team Assigned',
        rejectionReason: editStatus === 'Rejected' ? rejectionReason : undefined,
        beforeAfterVerification: verificationFeedback || selectedReport.beforeAfterVerification,
      };

      await onUpdateReport(selectedReport.id, updates);
      setSaveSuccessMsg('Report triage updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err: any) {
      alert('Error updating report: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Run AI Before/After Verification
  const handleRunAiVerification = async () => {
    if (!selectedReport || !workerPhotoUrl) {
      alert('Please provide or upload an after-repair photograph to verify.');
      return;
    }

    setIsVerifyingAI(true);
    try {
      const res = await fetch('/api/gemini/verify-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beforeImage: selectedReport.imageUrl,
          afterImage: workerPhotoUrl,
          categoryTitle: selectedReport.categoryTitle,
        }),
      });

      const data = await res.json();
      if (data.success && data.verification) {
        setVerificationFeedback({
          ...data.verification,
          workerPhotoUrl,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'AI Municipal Verification Engine',
        });
        if (data.verification.status === 'Appears Resolved') {
          setEditStatus('Completed');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifyingAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0A1224] border border-cyan-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>MUNICIPAL COMMAND & CONTROL CENTER &bull; వార్డు కార్యాలయం</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Municipal Officer Grievance Redressal Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Automated AI triage, field worker dispatch management, and dual-photo verification.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 pl-2 font-medium">Role:</span>
          {(['ward_officer', 'commissioner', 'field_engineer'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setOfficerRole(role)}
              className={`px-3 py-1.5 rounded-xl font-bold transition capitalize ${
                officerRole === role
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Total Complaints', value: totalReports, color: 'text-cyan-400', border: 'border-cyan-500/30' },
          { label: 'New Submissions', value: newCount, color: 'text-blue-400', border: 'border-blue-500/30' },
          { label: 'High / Critical', value: criticalCount, color: 'text-rose-400', border: 'border-rose-500/30' },
          { label: 'In Progress', value: inProgressCount, color: 'text-amber-400', border: 'border-amber-500/30' },
          { label: 'Resolved / Verified', value: resolvedCount, color: 'text-emerald-400', border: 'border-emerald-500/30' },
          { label: 'Avg Resolution Time', value: '18.5h', color: 'text-purple-400', border: 'border-purple-500/30' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl bg-slate-900/80 border ${stat.border} shadow-lg space-y-1`}
          >
            <span className="text-[11px] text-slate-400 font-semibold block leading-tight">
              {stat.label}
            </span>
            <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Map View of all Active Incidents */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>City-Wide Geographic Incidents & Priority Markers</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pins color-coded: Red (Critical) &bull; Orange (High) &bull; Yellow (Medium) &bull; Green (Low)
            </p>
          </div>
          <button
            onClick={onRefreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Feed</span>
          </button>
        </div>

        <LeafletMap
          center={[17.44, 78.38]}
          zoom={13}
          interactivePicker={false}
          markers={reports.map((r) => ({
            id: r.id,
            latitude: r.location.latitude,
            longitude: r.location.longitude,
            title: r.categoryTitle,
            category: r.categoryTitle,
            priority: r.priority,
            status: r.status,
            address: `${r.location.area}, ${r.location.city}`,
          }))}
          height="320px"
        />
      </div>

      {/* Triage & Management Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Filterable Complaints Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by ID, category, or area..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
                >
                  <option value="All">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved – Awaiting Verification">Awaiting Verification</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto no-scrollbar pr-1">
              {filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {report.id}
                        </span>
                        {report.duplicateReportsCount ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 font-semibold">
                            <GitMerge className="w-2.5 h-2.5" />
                            <span>{report.duplicateReportsCount} Nearby DUP</span>
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            report.priority === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300'
                              : report.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {report.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {report.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={report.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-white truncate">{report.categoryTitle}</p>
                        <p className="text-slate-400 truncate">{report.location.area}, {report.location.city}</p>
                        <p className="text-[11px] text-cyan-300/80 truncate mt-0.5">
                          {report.aiAnalysis?.visibleEvidenceSummary || report.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Officer Action & Dispatch Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedReport ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {selectedReport.id}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Action & Triage Redressal
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Citizen: {selectedReport.citizenName}
                </span>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Priority & Status Controls */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Confirm Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Lifecycle Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ReportStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-semibold"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved – Awaiting Verification">Awaiting Verification</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Department Assignment */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-300 block">Dispatch Department</label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Worker Assignment */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-300 block">Assigned Squad / Worker Name</label>
                <input
                  type="text"
                  value={editWorker}
                  onChange={(e) => setEditWorker(e.target.value)}
                  placeholder="e.g. Sanitary Supervisor Raghu / Truck TS-09-GA-4412"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              {/* If status is Rejected: Reason */}
              {editStatus === 'Rejected' && (
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-rose-300 block">Rejection Reason</label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="State reason (e.g. Private property outside municipal boundary)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/40 text-white placeholder-slate-500"
                  />
                </div>
              )}

              {/* Before and After Dual-Photo Verification section */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Before-and-After Verification</span>
                  </span>
                  {verificationFeedback && (
                    <span className="text-[10px] font-bold text-emerald-400">
                      {verificationFeedback.status} ({verificationFeedback.resolutionScore}%)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block mb-1">Citizen Before Photo</span>
                    <img
                      src={selectedReport.imageUrl}
                      alt="Before"
                      className="w-full h-24 object-cover rounded-lg border border-slate-800"
                    />
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">Worker After Photo</span>
                    {workerPhotoUrl ? (
                      <img
                        src={workerPhotoUrl}
                        alt="After"
                        className="w-full h-24 object-cover rounded-lg border border-cyan-500/40"
                      />
                    ) : (
                      <div className="w-full h-24 rounded-lg border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 text-center text-slate-500">
                        <Camera className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">No photo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workerPhotoUrl}
                    onChange={(e) => setWorkerPhotoUrl(e.target.value)}
                    placeholder="Worker photo URL (e.g. Unsplash or file)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Demo preset sample resolution photo
                      setWorkerPhotoUrl('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-[11px] text-cyan-300 font-semibold"
                  >
                    Sample Photo
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiVerification}
                  disabled={isVerifyingAI || !workerPhotoUrl}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isVerifyingAI ? 'animate-spin' : ''}`} />
                  <span>{isVerifyingAI ? 'Running AI Comparison...' : 'Run AI Before-and-After Verification'}</span>
                </button>
              </div>

              {/* Submit Triage Update Button */}
              <button
                type="button"
                onClick={handleSaveAction}
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isSaving ? 'Updating Record...' : 'Apply Redressal Action & Notify Citizen'}</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 rounded-3xl bg-slate-900/40 border border-slate-800">
              Select a complaint from the list to review AI recommendations and assign field crews.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
