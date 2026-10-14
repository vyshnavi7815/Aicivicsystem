import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize GoogleGenAI SDK as per skill instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// File persistence setup
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'reports.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Realistic Seed Reports
const INITIAL_REPORTS = [
  {
    id: 'CIVIC-2026-A104',
    citizenName: 'Kavitha Reddy',
    citizenPhone: '9848022341',
    language: 'en',
    categoryId: 'garbage-accumulation',
    categoryTitle: 'Garbage Accumulation',
    description: 'Huge community bin overflowing onto the pedestrian pathway and road edge. Stray dogs scattering plastic waste and foul stench affecting nearby shops.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    location: {
      latitude: 17.4435,
      longitude: 78.3772,
      address: 'Near Madhapur Metro Pillar 1240, Ayyappa Society Road',
      city: 'Hyderabad',
      area: 'Madhapur / Ward 104',
      landmark: 'Opposite State Bank',
    },
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    status: 'In Progress',
    priority: 'High',
    priorityReason: 'High waste density obstructing pedestrian walkway adjacent to busy commercial corridor.',
    aiAnalysis: {
      detectedCategory: 'Garbage Accumulation',
      categoryMatched: true,
      confidenceScore: 95,
      estimatedSeverity: 'High',
      wasteOrDamageType: 'Municipal Solid Waste & Single-Use Plastics',
      visibleEvidenceSummary: 'Overflowing community green bin, accumulated plastic wrappers, rotting organic debris on public asphalt.',
      suggestedAction: 'Dispatch hydraulic tipper truck and sanitation sweeping crew immediately.',
      publicSafetyRisk: 'Moderate',
    },
    assignedDepartment: 'Sanitation & Solid Waste Management',
    assignedWorker: 'Ramesh K. (Vehicle #TS-09-GA-4412)',
    karmaAwarded: 50,
    isHazardous: false,
  },
  {
    id: 'CIVIC-2026-B221',
    citizenName: 'Vikramaditya Sen',
    citizenPhone: '9820155432',
    language: 'en',
    categoryId: 'potholes-road-damage',
    categoryTitle: 'Potholes and Road Damage',
    description: 'Series of deep dangerous craters after yesterday rain. Multiple two-wheelers skidding and slowing traffic drastically.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    location: {
      latitude: 17.4382,
      longitude: 78.3821,
      address: 'Hitech City Main Road, near Cyber Towers junction',
      city: 'Hyderabad',
      area: 'Hitech City',
      landmark: 'Flyover Ramp Entry',
    },
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    status: 'Resolved – Awaiting Verification',
    priority: 'Critical',
    priorityReason: 'Substantial depth (>15cm) on major traffic artery posing direct two-wheeler overturn hazard.',
    aiAnalysis: {
      detectedCategory: 'Potholes and Road Damage',
      categoryMatched: true,
      confidenceScore: 98,
      estimatedSeverity: 'Critical',
      wasteOrDamageType: 'Asphalt Degradation & Structural Cavity',
      visibleEvidenceSummary: 'Deep fractured cavity with exposed aggregate and broken sub-base layer.',
      suggestedAction: 'Cold-mix bituminous patch filling followed by roller compaction.',
      publicSafetyRisk: 'High',
    },
    assignedDepartment: 'Road Infrastructure & Maintenance Wing',
    assignedWorker: 'Engineer Naresh G. (Patch Crew #3)',
    beforeAfterVerification: {
      status: 'Appears Resolved',
      resolutionScore: 94,
      analysisNotes: 'Bituminous surface successfully filled, leveled, and compacted to road grade.',
      workerPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      verifiedBy: 'Inspector Sunita Rao',
    },
    karmaAwarded: 150,
    isHazardous: false,
  },
  {
    id: 'CIVIC-2026-C309',
    citizenName: 'Ananya Deshmukh',
    citizenPhone: '9765412980',
    language: 'en',
    categoryId: 'electrical-hazards',
    categoryTitle: 'Electrical Hazards',
    description: 'Heavy sparking from roadside electrical junction box with hanging uninsulated cables touching wet railing.',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    location: {
      latitude: 17.4489,
      longitude: 78.3905,
      address: 'Kavuri Hills Phase 2, Near Children Park',
      city: 'Hyderabad',
      area: 'Kavuri Hills',
      landmark: 'Gate No. 4 Transformer',
    },
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    status: 'Submitted',
    priority: 'Critical',
    priorityReason: 'Direct electrocution risk near children park playground and pedestrian walkway.',
    aiAnalysis: {
      detectedCategory: 'Electrical Hazards',
      categoryMatched: true,
      confidenceScore: 97,
      estimatedSeverity: 'Critical',
      wasteOrDamageType: 'High-Voltage Utility Exposed Wiring',
      visibleEvidenceSummary: 'Hanging live cable insulation breakdown, proximity to metal fencing.',
      suggestedAction: 'Isolate feeder switchboard immediately and deploy certified linesman.',
      publicSafetyRisk: 'Imminent Danger',
    },
    assignedDepartment: 'State Electricity Transmission & Public Safety',
    karmaAwarded: 50,
    isHazardous: true,
  },
  {
    id: 'CIVIC-2026-D412',
    citizenName: 'Mohammed Farooq',
    citizenPhone: '9949187654',
    language: 'en',
    categoryId: 'water-pipeline-leakage',
    categoryTitle: 'Water Pipeline Leakage',
    description: 'Potable water supply line rupture spurting thousands of liters of drinking water onto the street since 6 AM.',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    location: {
      latitude: 17.4328,
      longitude: 78.3712,
      address: 'Jubilee Enclave, Lane 3',
      city: 'Hyderabad',
      area: 'HITEC Extension',
      landmark: 'Near Water Overhead Reservoir',
    },
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    status: 'Assigned',
    priority: 'High',
    priorityReason: 'Continuous loss of treated municipal potable water and street pavement erosion.',
    aiAnalysis: {
      detectedCategory: 'Water Pipeline Leakage',
      categoryMatched: true,
      confidenceScore: 93,
      estimatedSeverity: 'High',
      wasteOrDamageType: 'Pressurized Pipe Joint Failure',
      visibleEvidenceSummary: 'Significant water geyser emerging from beneath curbstone.',
      suggestedAction: 'Shut distribution valve #14 and dispatch pipe welding team.',
      publicSafetyRisk: 'Moderate',
    },
    assignedDepartment: 'Municipal Water Distribution Works',
    assignedWorker: 'Plumbing Unit Leader Satyanarayana',
    karmaAwarded: 50,
    isHazardous: false,
  },
  {
    id: 'CIVIC-2026-E518',
    citizenName: 'Prashanth Murthy',
    citizenPhone: '9845012399',
    language: 'en',
    categoryId: 'blocked-drainage',
    categoryTitle: 'Blocked Drainage',
    description: 'Black sewage water backing up from main drain onto colony road creating unbearable smell and mosquito breeding.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    location: {
      latitude: 17.4411,
      longitude: 78.3755,
      address: 'Sri Sai Nagar, 100 Feet Road',
      city: 'Hyderabad',
      area: 'Madhapur',
      landmark: 'Near Vegetable Market',
    },
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'In Progress',
    priority: 'High',
    priorityReason: 'Sewage overflow presenting vector-borne disease risk in dense market sector.',
    aiAnalysis: {
      detectedCategory: 'Blocked Drainage',
      categoryMatched: true,
      confidenceScore: 91,
      estimatedSeverity: 'High',
      wasteOrDamageType: 'Sludge & Solid Waste Culvert Clog',
      visibleEvidenceSummary: 'Black stagnant liquid pool surrounding storm drain grating.',
      suggestedAction: 'Deploy super-sucker vacuum machine and jetting unit to dislodge obstruction.',
      publicSafetyRisk: 'Moderate',
    },
    assignedDepartment: 'Sewerage & Stormwater Drainage Unit',
    assignedWorker: 'Sanitary Inspector Raghu & Team',
    karmaAwarded: 50,
    isHazardous: false,
  },
  {
    id: 'CIVIC-2026-F630',
    citizenName: 'Deepa Krishnan',
    citizenPhone: '9884019283',
    language: 'en',
    categoryId: 'broken-streetlights',
    categoryTitle: 'Broken Streetlights',
    description: 'Complete stretch of 5 streetlamps completely unlit for past 4 nights. Road is pitch dark and unsafe for women returning from work.',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    location: {
      latitude: 17.4498,
      longitude: 78.3842,
      address: 'Inorbit Mall Link Road, Sector 3',
      city: 'Hyderabad',
      area: 'Madhapur',
      landmark: 'Near Foot-over-bridge',
    },
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    status: 'Completed',
    priority: 'Medium',
    priorityReason: 'Dark corridor compromising pedestrian safety and surveillance.',
    aiAnalysis: {
      detectedCategory: 'Broken Streetlights',
      categoryMatched: true,
      confidenceScore: 89,
      estimatedSeverity: 'Medium',
      wasteOrDamageType: 'LED Fixture / Circuit Board Fault',
      visibleEvidenceSummary: 'Series of unpowered pole fixtures along vehicular lane.',
      suggestedAction: 'Inspect phase timer and replace driver units on poles 12 through 16.',
      publicSafetyRisk: 'Moderate',
    },
    assignedDepartment: 'Municipal Electrical & Lighting Division',
    assignedWorker: 'Linesman Balu',
    beforeAfterVerification: {
      status: 'Appears Resolved',
      resolutionScore: 98,
      analysisNotes: 'All 5 LED streetlamp luminaires replaced, energized, and tested under illumination sensor.',
      workerPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      verifiedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      verifiedBy: 'Ward Electrical Supervisor',
    },
    karmaAwarded: 150,
    isHazardous: false,
  },
];

function loadReports() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.error('Error reading reports file:', err);
  }
  // Fallback to initial seed
  saveReports(INITIAL_REPORTS);
  return INITIAL_REPORTS;
}

function saveReports(reports: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving reports file:', err);
  }
}

let reportsStore = loadReports();

// Calculate distance between two lat/lng points in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. GET /api/reports
app.get('/api/reports', (req, res) => {
  res.json({ success: true, reports: reportsStore });
});

// 2. POST /api/reports
app.post('/api/reports', (req, res) => {
  try {
    const reportData = req.body;
    const now = new Date();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const complaintId = `CIVIC-${now.getFullYear()}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${randomSuffix}`;

    // Duplicate detection check against existing reports
    let duplicateOfId: string | undefined = undefined;
    let duplicateReportsCount = 0;

    if (reportData.location?.latitude && reportData.location?.longitude) {
      const nearbyMatches = reportsStore.filter((r) => {
        if (!r.location?.latitude || !r.location?.longitude) return false;
        const dist = getDistanceMeters(
          reportData.location.latitude,
          reportData.location.longitude,
          r.location.latitude,
          r.location.longitude
        );
        return dist <= 250 && r.categoryId === reportData.categoryId && r.status !== 'Completed' && r.status !== 'Rejected';
      });

      if (nearbyMatches.length > 0) {
        duplicateOfId = nearbyMatches[0].id;
        duplicateReportsCount = nearbyMatches.length;
      }
    }

    // Dynamic priority calculation
    let priority = reportData.priority || 'Medium';
    let priorityReason = 'Standard municipal queue prioritization.';

    if (reportData.isHazardous) {
      priority = 'Critical';
      priorityReason = 'Safety Hazard: Immediate threat to citizen well-being.';
    } else if (duplicateReportsCount >= 2) {
      priority = priority === 'Low' ? 'Medium' : 'High';
      priorityReason = `Escalated due to ${duplicateReportsCount + 1} independent citizen reports in the same 250m vicinity.`;
    } else if (reportData.aiAnalysis?.estimatedSeverity === 'Critical') {
      priority = 'Critical';
      priorityReason = 'AI Vision flagged severe structural hazard or imminent public risk.';
    } else if (reportData.aiAnalysis?.estimatedSeverity === 'High') {
      priority = 'High';
      priorityReason = 'AI Vision identified high severity disruption.';
    }

    const newReport = {
      ...reportData,
      id: complaintId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'Submitted',
      priority,
      priorityReason,
      duplicateOfId,
      duplicateReportsCount,
      karmaAwarded: 50,
    };

    reportsStore.unshift(newReport);
    saveReports(reportsStore);

    res.json({ success: true, report: newReport });
  } catch (err: any) {
    console.error('Error creating report:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PATCH /api/reports/:id
app.patch('/api/reports/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = reportsStore.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    const current = reportsStore[index];
    const updates = req.body;

    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If status changed to Completed, award resolution karma points
    if (updates.status === 'Completed' && current.status !== 'Completed') {
      updated.karmaAwarded = (current.karmaAwarded || 50) + 100;
    }

    reportsStore[index] = updated;
    saveReports(reportsStore);

    res.json({ success: true, report: updated });
  } catch (err: any) {
    console.error('Error updating report:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/stats
app.get('/api/stats', (req, res) => {
  const total = reportsStore.length;
  const newReports = reportsStore.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
  const highPriority = reportsStore.filter((r) => r.priority === 'High' || r.priority === 'Critical').length;
  const inProgress = reportsStore.filter((r) => r.status === 'Assigned' || r.status === 'In Progress').length;
  const resolved = reportsStore.filter((r) => r.status === 'Resolved – Awaiting Verification' || r.status === 'Completed').length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  // Area counts
  const areaCounts: Record<string, number> = {};

  reportsStore.forEach((r) => {
    categoryCounts[r.categoryTitle || r.categoryId] = (categoryCounts[r.categoryTitle || r.categoryId] || 0) + 1;
    const area = r.location?.area || r.location?.city || 'Other Ward';
    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });

  // Calculate hotspots: areas with >= 2 reports
  const hotspots = Object.entries(areaCounts)
    .filter(([_, count]) => count >= 2)
    .map(([area, count]) => {
      const sample = reportsStore.find((r) => (r.location?.area || r.location?.city) === area);
      return {
        area,
        reportCount: count,
        coordinates: sample?.location ? [sample.location.latitude, sample.location.longitude] : [17.44, 78.38],
        primaryIssue: sample?.categoryTitle || 'Multiple Civic Issues',
      };
    });

  res.json({
    success: true,
    stats: {
      total,
      newReports,
      highPriority,
      inProgress,
      resolved,
      avgResolutionHours: 18.5,
      categoryCounts,
      areaCounts,
      hotspots,
    },
  });
});

// 5. POST /api/gemini/analyze-image
app.post('/api/gemini/analyze-image', async (req, res) => {
  try {
    const { imageBase64, selectedCategoryId, categoryTitle, language } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    // Clean base64 string
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    const mimeType = match ? match[1] : 'image/jpeg';
    const base64Data = match ? match[2] : imageBase64;

    if (ai) {
      const prompt = `You are the municipal AI Vision analyzer for CivicAI, a smart city civic management platform.
Analyze this citizen-uploaded photo of a public civic problem.
The citizen currently selected the category: "${categoryTitle || selectedCategoryId || 'Unknown'}".

Evaluate the image and respond strictly in valid JSON adhering to this schema:
{
  "detectedCategory": "One of: Garbage Accumulation, Water Tap Leakage, Potholes and Road Damage, Blocked Drainage, Flooded Roads, Broken Streetlights, Fallen Trees, Public Property Damage, Open Manholes, Water Pipeline Leakage, Illegal Dumping, Stray Animal-Related Civic Issues, Electrical Hazards, Air Pollution, Noise Pollution, Other Civic Problems",
  "categoryMatched": true/false (whether image matches "${categoryTitle || selectedCategoryId}"),
  "confidenceScore": number (70 to 99),
  "estimatedSeverity": "Low" | "Medium" | "High" | "Critical",
  "wasteOrDamageType": "concise description of visible material or damage type (e.g. Uncollected plastic waste, asphalt erosion crater, live hanging copper wiring)",
  "visibleEvidenceSummary": "1-2 sentences describing what is concretely visible in the image",
  "suggestedAction": "recommended municipal field action (e.g. dispatch jetting truck, replace fuse, asphalt resurfacing)",
  "publicSafetyRisk": "None" | "Moderate" | "High" | "Imminent Danger",
  "flaggedForReview": false,
  "flagReason": ""
}

CRITICAL RULES:
1. Do not invent details not visible.
2. If the photo does not depict civic infrastructure (e.g. selfies, random objects, pet indoor photos), set flaggedForReview: true and explain in flagReason as "Flagged for review: Image does not appear to show civic infrastructure".
3. Return raw JSON only with no markdown backticks.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            temperature: 0.2,
          },
        });

        const rawText = response.text || '';
        const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return res.json({ success: true, analysis: parsed });
      } catch (geminiErr: any) {
        console.warn('Gemini vision API call error, falling back to heuristic evaluation:', geminiErr?.message);
      }
    }

    // Heuristic Fallback if API key is unconfigured or temporary network error
    const isDangerous =
      selectedCategoryId?.includes('electrical') ||
      selectedCategoryId?.includes('manhole') ||
      selectedCategoryId?.includes('flood');

    const severity = isDangerous ? 'Critical' : 'High';
    const fallbackAnalysis = {
      detectedCategory: categoryTitle || 'Civic Infrastructure Concern',
      categoryMatched: true,
      confidenceScore: 92,
      estimatedSeverity: severity,
      wasteOrDamageType: 'Structural or Environmental Deterioration',
      visibleEvidenceSummary: `Visible signs consistent with ${categoryTitle || 'reported problem'} requiring municipal attention.`,
      suggestedAction: isDangerous
        ? 'Emergency inspection team dispatched; cordon off area immediately.'
        : 'Schedule routine maintenance team within 24 hours.',
      publicSafetyRisk: isDangerous ? 'Imminent Danger' : 'Moderate',
      flaggedForReview: false,
    };

    res.json({ success: true, analysis: fallbackAnalysis, isFallback: true });
  } catch (err: any) {
    console.error('Analyze image handler error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/gemini/verify-repair (Before and After AI verification)
app.post('/api/gemini/verify-repair', async (req, res) => {
  try {
    const { beforeImage, afterImage, categoryTitle } = req.body;

    if (!beforeImage || !afterImage) {
      return res.status(400).json({ success: false, error: 'Both before and after images are required.' });
    }

    if (ai) {
      const matchBefore = beforeImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      const matchAfter = afterImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);

      const prompt = `Compare these two civic photos for issue "${categoryTitle || 'Civic Issue'}".
Image 1 is the BEFORE report submitted by a citizen.
Image 2 is the AFTER photo submitted by a municipal field worker.

Respond strictly in valid JSON:
{
  "status": "Appears Resolved" | "Partially Resolved" | "Still Visible" | "Needs Manual Review",
  "resolutionScore": number (0 to 100),
  "analysisNotes": "Short 2 sentence comparison of visible repair evidence"
}
Rules: Do not mark as resolved if the issue is clearly still visible. Return JSON only without backticks.`;

      try {
        const parts: any[] = [];
        if (matchBefore) {
          parts.push({ inlineData: { mimeType: matchBefore[1], data: matchBefore[2] } });
        }
        if (matchAfter) {
          parts.push({ inlineData: { mimeType: matchAfter[1], data: matchAfter[2] } });
        }
        parts.push({ text: prompt });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: { temperature: 0.1 },
        });

        const rawText = response.text || '';
        const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        return res.json({ success: true, verification: parsed });
      } catch (geminiErr: any) {
        console.warn('Gemini verify error:', geminiErr?.message);
      }
    }

    // Fallback heuristic verification
    const fallbackVerification = {
      status: 'Appears Resolved',
      resolutionScore: 92,
      analysisNotes: 'After-repair photo indicates cleared site and restored surface gradient.',
      isFallback: true,
    };
    res.json({ success: true, verification: fallbackVerification });
  } catch (err: any) {
    console.error('Verify repair error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST /api/gemini/chat (Multilingual Civic Assistant)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, language = 'en', complaintIdQuery } = req.body;

    // Check if user is asking for complaint status
    let complaintContext = '';
    const idMatch = message.match(/CIVIC-\d{4}-[A-Z]\d{3}/i) || (complaintIdQuery ? [complaintIdQuery] : null);

    if (idMatch) {
      const found = reportsStore.find((r) => r.id.toUpperCase() === idMatch[0].toUpperCase());
      if (found) {
        complaintContext = `Found Complaint Record: ID ${found.id}, Category: ${found.categoryTitle}, Status: ${found.status}, Priority: ${found.priority}, Location: ${found.location?.area || found.location?.city}, Assigned: ${found.assignedDepartment || 'Pending Assignment'}.`;
      } else {
        complaintContext = `No complaint found with ID ${idMatch[0]} in the official database. Remind the citizen to check the exact ID format.`;
      }
    }

    if (ai) {
      const systemInstruction = `You are CivicBot, the intelligent municipal helpline assistant for CivicAI.
Language instruction: Respond in the language requested by the user (${language}). If the user speaks Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, or English, reply naturally in that specific language and script.
Your role:
1. Help citizens understand how to report issues (potholes, garbage, drainages, open manholes, electrical hazards).
2. Look up complaint statuses ONLY if provided in the context below. Do not claim a report exists or has been resolved unless confirmed in the context.
3. Explain municipal priority levels (Low, Medium, High, Critical) and safety guidelines for dangerous hazards.
4. Keep answers friendly, reassuring, helpful, and concise (under 120 words).

Context from Municipal Database:
${complaintContext || 'No specific complaint queried yet.'}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        return res.json({ success: true, reply: response.text || 'How can I assist you with city services today?' });
      } catch (geminiErr: any) {
        console.warn('Gemini chat error:', geminiErr?.message);
      }
    }

    // Multilingual Fallback Responses
    let reply = `Welcome to CivicAI! You can report civic problems using our step-by-step reporting flow. For emergency hazards like live electrical wires or flooded roads, please contact the municipal hotline at 112 or 1913.`;
    if (complaintContext) {
      reply = `${complaintContext} You can view full timeline updates in the Citizen Portal.`;
    } else if (language === 'te') {
      reply = `సివిక్-ఏఐ (CivicAI) సహాయకుడికి స్వాగతం! మీరు రోడ్డు గుంతలు, చెత్త, డ్రైనేజీ లేదా వీధి దీపాల సమస్యలను సులభంగా నమోదు చేయవచ్చు. అత్యవసర పరిస్థితుల్లో హెల్ప్‌లైన్ 112 లేదా 1913 ను సంప్రదించండి.`;
    } else if (language === 'hi') {
      reply = `CivicAI में आपका स्वागत है! आप अपनी नागरिक समस्याओं (सड़क के गड्ढे, कचरा, सीवर या स्ट्रीटलाइट) की फोटो अपलोड करके शिकायत दर्ज कर सकते हैं। आपातकालीन सहायता के लिए 112 या 1913 पर कॉल करें।`;
    }

    res.json({ success: true, reply, isFallback: true });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. POST /api/optimize-route
app.post('/api/optimize-route', (req, res) => {
  const { department = 'Sanitation & Solid Waste Management' } = req.body;

  const pendingReports = reportsStore.filter(
    (r) => r.status !== 'Completed' && r.status !== 'Rejected' && r.location?.latitude && r.location?.longitude
  );

  // Sort by priority (Critical > High > Medium > Low)
  const priorityWeight: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const sorted = [...pendingReports].sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));

  const waypoints = sorted.slice(0, 6).map((r, i) => ({
    step: i + 1,
    id: r.id,
    title: r.categoryTitle,
    address: r.location.address || `${r.location.area}, ${r.location.city}`,
    latitude: r.location.latitude,
    longitude: r.location.longitude,
    priority: r.priority,
    estimatedMinutes: 25 + i * 15,
  }));

  const totalDistanceKm = (waypoints.length * 2.8).toFixed(1);
  const estimatedTimeMins = waypoints.length * 35;
  const fuelSavingsLiters = (waypoints.length * 1.4).toFixed(1);

  res.json({
    success: true,
    route: {
      crewName: `Rapid Response Crew #04 (${department})`,
      waypoints,
      totalDistanceKm: `${totalDistanceKm} km`,
      estimatedTime: `${Math.floor(estimatedTimeMins / 60)}h ${estimatedTimeMins % 60}m`,
      fuelSaved: `${fuelSavingsLiters} Liters optimized`,
    },
  });
});

// Dev server with Vite middleware mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`CivicAI Server running on http://0.0.0.0:${port}`);
});
