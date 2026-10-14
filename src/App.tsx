/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Globe,
  MapPin,
  Camera,
  CheckCircle2,
  FileText,
  Bot,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LanguageCode, CivicReport, LocationData, AIAnalysisResult } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { Step1Language } from './components/ReportFlow/Step1Language';
import { Step2CitizenLocation } from './components/ReportFlow/Step2CitizenLocation';
import { Step3ProblemSelect } from './components/ReportFlow/Step3ProblemSelect';
import { Step4DescribeUpload } from './components/ReportFlow/Step4DescribeUpload';
import { Step5ReviewSubmit } from './components/ReportFlow/Step5ReviewSubmit';
import { SubmissionSuccessModal } from './components/ReportFlow/SubmissionSuccessModal';
import { CitizenPortal } from './components/CitizenPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { CivicHotspots } from './components/CivicHotspots';
import { RoutePlanner } from './components/RoutePlanner';
import { RewardsLeaderboard } from './components/RewardsLeaderboard';
import { ChatbotModal } from './components/ChatbotModal';

export default function App() {
  // Navigation & Language State
  const [currentTab, setCurrentTab] = useState<string>('report');
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('civicai_lang') as LanguageCode) || 'en';
  });

  // Multilingual persistence
  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('civicai_lang', lang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Report Flow Steps (1 to 5)
  const [reportStep, setReportStep] = useState<number>(1);

  // Form Fields State
  const [citizenName, setCitizenName] = useState('K. S. Rao');
  const [citizenPhone, setCitizenPhone] = useState('9849012345');
  const [location, setLocation] = useState<LocationData>({
    latitude: 17.4435,
    longitude: 78.3772,
    city: 'Hyderabad',
    area: 'Madhapur / Ward 104',
    landmark: 'Near Metro Pillar 1240, Main Road',
    address: 'Madhapur Main Rd, Hitech City, Hyderabad',
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState('garbage-accumulation');
  const [description, setDescription] = useState(
    'A huge pile of community garbage has accumulated near the pedestrian crossing. Stray dogs are scattering waste across the road edge.'
  );
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  );
  const [observationDateTime, setObservationDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [additionalNotes, setAdditionalNotes] = useState('Right opposite the bank ATM.');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  // Success Modal & Submitted Report
  const [submittedReport, setSubmittedReport] = useState<CivicReport | null>(null);
  const [targetComplaintId, setTargetComplaintId] = useState<string>('');

  // Floating Chatbot State
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Global Reports Store loaded from Server
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      }
    } catch (err) {
      console.warn('Failed to fetch reports from backend:', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Update Report (for Admin action)
  const handleUpdateReport = async (id: string, updates: Partial<CivicReport>) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.map((r) => (r.id === id ? data.report : r)));
      }
    } catch (err) {
      console.error('Failed to patch report:', err);
      throw err;
    }
  };

  // Report Submission Complete Handler
  const handleReportSubmitted = (newReport: CivicReport) => {
    setReports((prev) => [newReport, ...prev]);
    setSubmittedReport(newReport);
  };

  const handleTrackComplaintFromModal = (complaintId: string) => {
    setSubmittedReport(null);
    setTargetComplaintId(complaintId);
    setCurrentTab('citizen');
  };

  const handleReportAnother = () => {
    setSubmittedReport(null);
    setReportStep(3); // Start fresh at category selection with location preserved
    setDescription('');
    setImageUrl('');
    setAiAnalysis(null);
    setAdditionalNotes('');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenChat={() => setChatbotOpen(true)}
        pendingReportsCount={reports.filter((r) => r.status === 'Submitted').length}
      />

      {/* Main Tab Container */}
      <main className="flex-1 pb-16">
        {currentTab === 'report' && (
          <div className="space-y-6">
            {/* Step Progress Bar (Steps 1 to 5) */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                  <span className="text-cyan-400">Step {reportStep} of 5</span>
                  <span className="text-slate-300">
                    {reportStep === 1
                      ? '1. Language'
                      : reportStep === 2
                      ? '2. Citizen & Location'
                      : reportStep === 3
                      ? '3. Civic Category'
                      : reportStep === 4
                      ? '4. Photo & AI Vision'
                      : '5. Review & Submit'}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${(reportStep / 5) * 100}%` }}
                  />
                </div>

                {/* Step Dots */}
                <div className="flex justify-between items-center mt-2.5 px-1 text-[11px] font-semibold text-slate-500">
                  {[
                    { step: 1, label: 'Language' },
                    { step: 2, label: 'Location' },
                    { step: 3, label: 'Problem' },
                    { step: 4, label: 'Evidence & AI' },
                    { step: 5, label: 'Submit' },
                  ].map((s) => (
                    <button
                      key={s.step}
                      type="button"
                      disabled={s.step > reportStep}
                      onClick={() => setReportStep(s.step)}
                      className={`cursor-pointer transition flex items-center gap-1 ${
                        reportStep === s.step
                          ? 'text-cyan-400 font-bold'
                          : reportStep > s.step
                          ? 'text-slate-300 hover:text-white'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                          reportStep === s.step
                            ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/30'
                            : reportStep > s.step
                            ? 'bg-slate-700 text-cyan-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {s.step}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1: Language */}
            {reportStep === 1 && (
              <Step1Language
                selectedLanguage={language}
                onSelectLanguage={handleLanguageChange}
                onContinue={() => setReportStep(2)}
              />
            )}

            {/* Step 2: Citizen & Location */}
            {reportStep === 2 && (
              <Step2CitizenLocation
                language={language}
                citizenName={citizenName}
                setCitizenName={setCitizenName}
                citizenPhone={citizenPhone}
                setCitizenPhone={setCitizenPhone}
                location={location}
                setLocation={setLocation}
                onContinue={() => setReportStep(3)}
                onBack={() => setReportStep(1)}
              />
            )}

            {/* Step 3: Problem Selection */}
            {reportStep === 3 && (
              <Step3ProblemSelect
                language={language}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onContinue={() => setReportStep(4)}
                onBack={() => setReportStep(2)}
              />
            )}

            {/* Step 4: Describe & Upload with AI Vision */}
            {reportStep === 4 && (
              <Step4DescribeUpload
                language={language}
                selectedCategoryId={selectedCategoryId}
                onUpdateCategory={setSelectedCategoryId}
                description={description}
                setDescription={setDescription}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                observationDateTime={observationDateTime}
                setObservationDateTime={setObservationDateTime}
                additionalNotes={additionalNotes}
                setAdditionalNotes={setAdditionalNotes}
                aiAnalysis={aiAnalysis}
                setAiAnalysis={setAiAnalysis}
                onContinue={() => setReportStep(5)}
                onBack={() => setReportStep(3)}
              />
            )}

            {/* Step 5: Review & Submit */}
            {reportStep === 5 && (
              <Step5ReviewSubmit
                language={language}
                citizenName={citizenName}
                citizenPhone={citizenPhone}
                location={location}
                selectedCategoryId={selectedCategoryId}
                description={description}
                imageUrl={imageUrl}
                observationDateTime={observationDateTime}
                additionalNotes={additionalNotes}
                aiAnalysis={aiAnalysis}
                onEditStep={(stepNum) => setReportStep(stepNum)}
                onBack={() => setReportStep(4)}
                onSuccessfulSubmission={handleReportSubmitted}
              />
            )}
          </div>
        )}

        {/* Tab 2: Citizen Portal */}
        {currentTab === 'citizen' && (
          <CitizenPortal
            language={language}
            reports={reports}
            currentCitizenPhone={citizenPhone}
            onNavigateToReport={() => {
              setCurrentTab('report');
              setReportStep(3);
            }}
            targetComplaintId={targetComplaintId}
          />
        )}

        {/* Tab 3: Municipal Admin Dashboard */}
        {currentTab === 'admin' && (
          <AdminDashboard
            language={language}
            reports={reports}
            onUpdateReport={handleUpdateReport}
            onRefreshData={fetchReports}
          />
        )}

        {/* Tab 4: Civic Hotspots & Predictive Analytics */}
        {currentTab === 'hotspots' && <CivicHotspots reports={reports} />}

        {/* Tab 5: Route Optimization */}
        {currentTab === 'routes' && <RoutePlanner />}

        {/* Tab 6: Rewards & Karma Leaderboard */}
        {currentTab === 'rewards' && <RewardsLeaderboard />}
      </main>

      {/* Submission Success Modal */}
      {submittedReport && (
        <SubmissionSuccessModal
          report={submittedReport}
          language={language}
          onTrackComplaint={handleTrackComplaintFromModal}
          onReportAnother={handleReportAnother}
        />
      )}

      {/* Floating AI Civic Assistant Trigger Button */}
      <button
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-2xl shadow-cyan-500/40 flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Open CivicBot AI Helpline"
      >
        <Bot className="w-5 h-5 text-slate-950" />
        <span className="hidden sm:inline text-xs font-black tracking-wide">
          Ask CivicBot
        </span>
      </button>

      {/* Chatbot Modal */}
      <ChatbotModal
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-[#05080F] border-t border-slate-800/80 text-slate-500 text-xs py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">CivicAI &bull; Smart Civic Management System</span>
            <span>&bull; Hackathon Edition 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash Vision</span>
            <span>&bull;</span>
            <span>OpenStreetMap & Leaflet</span>
            <span>&bull;</span>
            <span className="text-cyan-400 font-semibold">Toll-Free Helpline: 1913</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
