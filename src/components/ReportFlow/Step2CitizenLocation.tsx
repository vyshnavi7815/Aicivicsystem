import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  User,
  Phone,
  Building2,
  Navigation,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { LanguageCode, LocationData } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { LeafletMap } from '../LeafletMap';

interface Step2CitizenLocationProps {
  language: LanguageCode;
  citizenName: string;
  setCitizenName: (val: string) => void;
  citizenPhone: string;
  setCitizenPhone: (val: string) => void;
  location: LocationData;
  setLocation: React.Dispatch<React.SetStateAction<LocationData>>;
  onContinue: () => void;
  onBack: () => void;
}

const CITY_PRESETS = [
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, area: 'Banjara Hills / Ward 98' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, area: 'Koramangala / Ward 151' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, area: 'Andheri West / Ward K-W' },
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, area: 'Connaught Place / NDMC' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, area: 'Anna Nagar / Zone 8' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, area: 'Salt Lake / Bidhannagar' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, area: 'Kothrud / Ward 14' },
];

export const Step2CitizenLocation: React.FC<Step2CitizenLocationProps> = ({
  language,
  citizenName,
  setCitizenName,
  citizenPhone,
  setCitizenPhone,
  location,
  setLocation,
  onContinue,
  onBack,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('locating');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));

        setLocation((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          accuracyMeters: Math.round(position.coords.accuracy),
          address: prev.address || 'Detected via GPS Device Sensor',
        }));

        setGpsStatus('success');
      },
      (error) => {
        console.warn('GPS denied or error:', error.message);
        setGpsStatus('denied');
        setErrorMessage(
          error.code === error.PERMISSION_DENIED
            ? t.gpsDenied
            : 'Unable to retrieve location. Please adjust the pin manually or select a city preset below.'
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handlePinMoved = (lat: number, lng: number) => {
    setLocation((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handlePresetSelect = (preset: (typeof CITY_PRESETS)[0]) => {
    setLocation((prev) => ({
      ...prev,
      city: preset.name,
      area: preset.area,
      latitude: preset.lat,
      longitude: preset.lng,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!location.city.trim() || !location.area.trim()) {
      setErrorMessage('Please provide your city and area locality.');
      return;
    }
    if (!location.latitude || !location.longitude) {
      setErrorMessage('Please select a problem location on the map.');
      return;
    }

    setErrorMessage('');
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Navigation className="w-3.5 h-3.5" />
          <span>Step 2 of 5: Citizen & Location Details</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.step2Title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          {t.step2Subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Citizen Contact */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>1. Citizen Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.fullName} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.mobileNumber}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Address and City */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>2. Civic Administrative Jurisdiction</span>
            </h3>

            {/* Quick city presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
              <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Quick Select:</span>
              {CITY_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`px-2 py-0.5 rounded-md border text-[11px] whitespace-nowrap transition ${
                    location.city === p.name
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.city} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={location.city}
                onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))}
                placeholder={t.cityPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.areaLocality} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={location.area}
                onChange={(e) => setLocation((prev) => ({ ...prev, area: e.target.value }))}
                placeholder={t.areaPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.streetLandmark}
            </label>
            <input
              type="text"
              value={location.landmark || ''}
              onChange={(e) => setLocation((prev) => ({ ...prev, landmark: e.target.value }))}
              placeholder={t.streetPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm"
            />
          </div>
        </div>

        {/* Section 3: Exact Location & Interactive Map */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>3. {t.exactLocation}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.pinAdjustHint}
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={gpsStatus === 'locating'}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-bold transition shadow-sm"
            >
              <Crosshair className={`w-4 h-4 ${gpsStatus === 'locating' ? 'animate-spin text-cyan-400' : ''}`} />
              <span>
                {gpsStatus === 'locating' ? t.locatingGps : t.useCurrentLocation}
              </span>
            </button>
          </div>

          {gpsStatus === 'success' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{t.gpsSuccess} (Accuracy: ~{location.accuracyMeters || 10}m)</span>
            </div>
          )}

          {gpsStatus === 'denied' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{t.gpsDenied}</span>
            </div>
          )}

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-slate-800">
            <LeafletMap
              center={[location.latitude || 17.44, location.longitude || 78.38]}
              zoom={14}
              interactivePicker={true}
              onLocationSelect={handlePinMoved}
              height="280px"
            />
          </div>

          {/* Coordinates Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">{t.coordinates}:</span>
              <span>
                {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-sans">
              Click anywhere on map to reposition pin
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-sm font-black shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
