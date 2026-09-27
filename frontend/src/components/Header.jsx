import React from 'react';
import { Play, Square, LogIn, LogOut, Activity } from 'lucide-react';

export default function Header({ 
  isDetectionRunning, 
  onStartDetection, 
  onStopDetection, 
  stats, 
  isAuthenticated, 
  onOpenAuth 
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Good evening, Administrator <span className="animate-bounce inline-block">👋</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Here's real-time AI vision telemetry and IoT automation for your venue today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Pill */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
          isDetectionRunning 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isDetectionRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
          }`} />
          <div className="flex flex-col">
            <span className="text-[10px] leading-tight uppercase font-bold tracking-wider">
              {isDetectionRunning ? 'AI VISION ACTIVE' : 'SYSTEM STANDBY'}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              {isDetectionRunning ? `${stats?.people_count || 0} People Detected` : 'Click Start Detection'}
            </span>
          </div>
        </div>

        {/* Start / Stop Buttons */}
        {!isDetectionRunning ? (
          <button
            onClick={onStartDetection}
            className="btn-start-detection flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            Start Detection
          </button>
        ) : (
          <button
            onClick={onStopDetection}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-600/20 transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            Stop Feed
          </button>
        )}

        {/* Login / Logout Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all"
        >
          {isAuthenticated ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
          {isAuthenticated ? 'Logout' : 'Login / Sign Up'}
        </button>
      </div>
    </header>
  );
}
