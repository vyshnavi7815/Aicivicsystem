export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  sampleGreeting: string;
}

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved – Awaiting Verification'
  | 'Completed'
  | 'Rejected';

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  area: string;
  landmark?: string;
  accuracyMeters?: number;
}

export interface AIAnalysisResult {
  detectedCategory: string;
  categoryMatched: boolean;
  confidenceScore: number; // 0 - 100
  estimatedSeverity: PriorityLevel;
  wasteOrDamageType: string;
  visibleEvidenceSummary: string;
  suggestedAction: string;
  publicSafetyRisk: 'None' | 'Moderate' | 'High' | 'Imminent Danger';
  isDuplicateSuspect?: boolean;
  duplicateConfidence?: number;
  flaggedForReview?: boolean;
  flagReason?: string;
}

export interface VerificationResult {
  status: 'Appears Resolved' | 'Partially Resolved' | 'Still Visible' | 'Needs Manual Review';
  resolutionScore: number; // 0 - 100
  analysisNotes: string;
  workerPhotoUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface CivicReport {
  id: string; // e.g. CIVIC-2026-X892
  citizenName: string;
  citizenPhone: string;
  language: LanguageCode;
  categoryId: string;
  categoryTitle: string;
  description: string;
  imageUrl: string;
  location: LocationData;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  priority: PriorityLevel;
  priorityReason?: string;
  aiAnalysis?: AIAnalysisResult;
  assignedDepartment?: string;
  assignedWorker?: string;
  beforeAfterVerification?: VerificationResult;
  duplicateOfId?: string; // If merged into another incident
  duplicateReportsCount?: number;
  rejectionReason?: string;
  publicNotes?: string[];
  karmaAwarded?: number;
  isHazardous?: boolean;
}

export interface CivicCategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  iconName: string;
  isHazardous: boolean;
  defaultDepartment: string;
  urgencyDefault: PriorityLevel;
}

export interface LeaderboardUser {
  id: string;
  displayName: string;
  avatarSeed: string;
  city: string;
  points: number;
  reportsSubmitted: number;
  reportsResolved: number;
  badges: { id: string; name: string; icon: string; description: string }[];
}

export interface RouteWaypoint {
  id: string;
  reportId: string;
  title: string;
  location: LocationData;
  priority: PriorityLevel;
  estimatedMinutes: number;
  assignedVehicle: string;
}
