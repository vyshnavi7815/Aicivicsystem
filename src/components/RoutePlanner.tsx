import React, { useState, useEffect } from 'react';
import {
  Route,
  Truck,
  CheckCircle2,
  Clock,
  Fuel,
  MapPin,
  ArrowRight,
  RefreshCw,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { LeafletMap } from './LeafletMap';

interface RoutePlannerProps {
  onDispatchSquad?: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = () => {
  const [selectedDept, setSelectedDept] = useState('Sanitation & Solid Waste Management');
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const fetchOptimizedRoute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: selectedDept }),
      });
      const data = await res.json();
      if (data.success) {
        setRouteData(data.route);
      }
    } catch (err) {
      console.error('Failed to load optimized route:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimizedRoute();
  }, [selectedDept]);

  const toggleStepCompleted = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0C1B24] border border-emerald-500/30 shadow-2xl">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
          <Route className="w-4 h-4" />
          <span>MUNICIPAL CREW DISPATCH & MULTI-STOP ROUTE OPTIMIZATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Intelligent Field Crew Routing Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
          Calculates the optimal Traveling Salesperson sequence for municipal tipper trucks, road repair vans, and drainage jetting teams based on ticket severity and spatial proximity.
        </p>
      </div>

      {/* Department Selector & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Select Squad:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:border-cyan-400"
          >
            <option value="Sanitation & Solid Waste Management">Sanitation & Garbage Crew (Van #04)</option>
            <option value="Road Infrastructure & Maintenance Wing">Road Pothole Patching Team (Truck #07)</option>
            <option value="Sewerage & Stormwater Drainage Unit">Drainage Jetting & Suction Unit (#02)</option>
            <option value="Municipal Electrical & Lighting Division">Lighting Linesman Van (#05)</option>
          </select>
        </div>

        {routeData && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Est. Distance: <strong className="text-white">{routeData.totalDistanceKm}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Drive + Work: <strong className="text-white">{routeData.estimatedTime}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <Fuel className="w-3.5 h-3.5" />
              <span>{routeData.fuelSaved}</span>
            </div>
          </div>
        )}
      </div>

      {/* Route Map & Turn by Turn Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map View (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Optimized Sequence Path & Geotagged Waypoints</span>
            </h3>
            <span className="text-xs text-slate-400">
              {routeData?.waypoints?.length || 0} Scheduled Stops
            </span>
          </div>

          <LeafletMap
            center={[17.44, 78.38]}
            zoom={13}
            interactivePicker={false}
            markers={
              routeData?.waypoints?.map((w: any) => ({
                id: `STOP #${w.step}: ${w.id}`,
                latitude: w.latitude,
                longitude: w.longitude,
                title: w.title,
                category: w.title,
                priority: w.priority,
                status: 'En Route',
                address: w.address,
              })) || []
            }
            height="380px"
          />
        </div>

        {/* Turn-by-turn Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-semibold">
            <span>Turn-by-Turn Waypoint Manifest</span>
            <span className="text-emerald-400">
              {completedSteps.length} of {routeData?.waypoints?.length || 0} Resolved
            </span>
          </div>

          <div className="space-y-2.5">
            {routeData?.waypoints?.map((wp: any) => {
              const isChecked = completedSteps.includes(wp.step);
              return (
                <div
                  key={wp.step}
                  onClick={() => toggleStepCompleted(wp.step)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition ${
                      isChecked
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-cyan-300 border border-slate-700'
                    }`}
                  >
                    {isChecked ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : wp.step}
                  </div>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-white truncate">{wp.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          wp.priority === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {wp.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 truncate">{wp.address}</p>
                    <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                      Target ETA: +{wp.estimatedMinutes} mins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
