import React from 'react';
import {
  Flame,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  CloudLightning,
  ShieldAlert,
  BarChart2,
} from 'lucide-react';
import { CivicReport } from '../types';
import { LeafletMap } from './LeafletMap';

interface CivicHotspotsProps {
  reports: CivicReport[];
}

export const CivicHotspots: React.FC<CivicHotspotsProps> = ({ reports }) => {
  // Aggregate reports by area
  const areaMap: Record<string, { count: number; categories: Record<string, number>; reports: CivicReport[] }> = {};

  reports.forEach((r) => {
    const areaKey = r.location.area || r.location.city || 'Ward 104';
    if (!areaMap[areaKey]) {
      areaMap[areaKey] = { count: 0, categories: {}, reports: [] };
    }
    areaMap[areaKey].count += 1;
    areaMap[areaKey].reports.push(r);
    areaMap[areaKey].categories[r.categoryTitle] = (areaMap[areaKey].categories[r.categoryTitle] || 0) + 1;
  });

  const hotspots = Object.entries(areaMap)
    .map(([area, data]) => ({
      area,
      count: data.count,
      primaryCategory: Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Civic Issue',
      riskLevel: data.count >= 3 ? 'High Recurrence' : data.count === 2 ? 'Moderate Recurrence' : 'Low Recurrence',
      reports: data.reports,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#120D1E] border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
          <Flame className="w-4 h-4" />
          <span>AI CIVIC HOTSPOT DETECTION & PREDICTIVE ANALYTICS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Recurring Issue Clusters & Preventive Risk Zones
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
          Aggregated spatial intelligence identifies high-density problem corridors to allow municipal preventive maintenance before citizen escalation.
        </p>
      </div>

      {/* Map with Heat Clusters */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Interactive Geographic Hotspot Map</span>
          </h3>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            {hotspots.length} Identified Problem Zones
          </span>
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
          height="340px"
        />
      </div>

      {/* Hotspots Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {hotspots.map((h, i) => (
          <div
            key={h.area}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Zone Rank #{i + 1}</span>
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  h.count >= 3
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {h.riskLevel}
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{h.area}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary Issue: <span className="text-cyan-300 font-semibold">{h.primaryCategory}</span>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
              <span>Accumulated Reports:</span>
              <span className="font-black text-white text-sm">{h.count} incidents</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-0.5">Recommended Civic Action:</span>
              <span>Deploy specialized inspection squad for weekly preventive audit.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Predictive Analytics Demonstration Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Predictive Monsoon & Infrastructure Vulnerability Forecast
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
            Predictive Model Simulation
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Based on historical water pipeline breaches and storm drainage reports, the AI forecast highlights 3 critical culverts likely to experience waterlogging during upcoming precipitation events.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-rose-400 font-bold block">Indiranagar Sector 4 Culvert</span>
            <span className="text-slate-400 text-[11px] block">Risk Score: 88% Drainage Silt Blockage</span>
            <span className="text-slate-200 block text-[11px]">Recommended: Pre-monsoon super sucker desilting.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-amber-400 font-bold block">Cyber Towers Underpass</span>
            <span className="text-slate-400 text-[11px] block">Risk Score: 76% Rainwater Stagnation</span>
            <span className="text-slate-200 block text-[11px]">Recommended: Install auxiliary high-capacity pump.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-blue-400 font-bold block">Anna Nagar 2nd Avenue Pavement</span>
            <span className="text-slate-400 text-[11px] block">Risk Score: 64% Underground Pipe Weakness</span>
            <span className="text-slate-200 block text-[11px]">Recommended: Acoustic leak detection inspection.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
