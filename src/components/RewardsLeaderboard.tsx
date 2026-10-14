import React from 'react';
import {
  Award,
  Sparkles,
  Trophy,
  ShieldCheck,
  Medal,
  Star,
  Gift,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { LeaderboardUser } from '../types';

const SAMPLE_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user-1',
    displayName: 'Aarav K.',
    avatarSeed: 'AK',
    city: 'Hyderabad',
    points: 850,
    reportsSubmitted: 14,
    reportsResolved: 12,
    badges: [
      { id: 'b1', name: 'Clean City Pioneer', icon: '🏛️', description: 'Submitted 10+ verified sanitation reports' },
      { id: 'b2', name: 'Road Safety Vigilante', icon: '🛣️', description: 'Flagged 5+ dangerous road craters' },
      { id: 'b3', name: 'Eco Guardian', icon: '🌱', description: 'Reported illegal tree felling and dumping' },
    ],
  },
  {
    id: 'user-2',
    displayName: 'Priya M.',
    avatarSeed: 'PM',
    city: 'Bengaluru',
    points: 720,
    reportsSubmitted: 11,
    reportsResolved: 9,
    badges: [
      { id: 'b1', name: 'Drainage Patrol', icon: '🌊', description: 'Prevented monsoon culvert blockages' },
      { id: 'b2', name: 'Civic Hawk', icon: '🦅', description: 'High AI Vision evidence accuracy rate (>95%)' },
    ],
  },
  {
    id: 'user-3',
    displayName: 'Rohan S.',
    avatarSeed: 'RS',
    city: 'Mumbai',
    points: 640,
    reportsSubmitted: 9,
    reportsResolved: 8,
    badges: [
      { id: 'b1', name: 'Safety Sentinel', icon: '⚡', description: 'Reported exposed electrical hazards immediately' },
    ],
  },
  {
    id: 'user-4',
    displayName: 'Ananya D.',
    avatarSeed: 'AD',
    city: 'Hyderabad',
    points: 580,
    reportsSubmitted: 8,
    reportsResolved: 7,
    badges: [
      { id: 'b1', name: 'Streetlight Watch', icon: '💡', description: 'Identified 6 unlit neighborhood corridors' },
    ],
  },
  {
    id: 'user-5',
    displayName: 'Vikram S.',
    avatarSeed: 'VS',
    city: 'Chennai',
    points: 490,
    reportsSubmitted: 7,
    reportsResolved: 6,
    badges: [
      { id: 'b1', name: 'Water Warrior', icon: '💧', description: 'Reported high-pressure pipeline breaches' },
    ],
  },
];

export const RewardsLeaderboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#1F1707] border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
          <Trophy className="w-4 h-4" />
          <span>CITIZEN RECOGNITION & CIVIC KARMA GAMIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Citizen Civic Karma Leaderboard & Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
          Earn points and smart-city honors for reporting authentic, verified civic problems. Points can be redeemed for property tax rebates and municipal commendation certificates.
        </p>
      </div>

      {/* Point Rules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>+50 Karma Points</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Awarded when an authentic civic issue report is submitted with geotagged photo evidence and validated by AI Vision.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>+100 Karma Points</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Awarded when the municipal field squad completes the repair and before-and-after photo evidence is approved.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Gift className="w-4 h-4" />
            <span>Municipal Rewards</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Top 10 monthly citizens receive official Mayor Commendations and up to 5% rebate on urban local body property tax!
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Top Civic Changemakers &bull; Privacy-Conscious Ranking</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Cycle: October 2026</span>
        </div>

        <div className="space-y-3">
          {SAMPLE_LEADERBOARD.map((user, idx) => (
            <div
              key={user.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                idx === 0
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    idx === 0
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-950'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{user.displayName}</span>
                    <span className="text-[11px] text-slate-400">({user.city})</span>
                  </div>

                  {/* Badges list */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {user.badges.map((b) => (
                      <span
                        key={b.id}
                        title={b.description}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-cyan-300 border border-slate-700 font-medium"
                      >
                        <span>{b.icon}</span>
                        <span>{b.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:justify-end text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Reports</span>
                  <span className="font-bold text-white">{user.reportsResolved} / {user.reportsSubmitted} Resolved</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Civic Karma</span>
                  <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{user.points} pts</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
