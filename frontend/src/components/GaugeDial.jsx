import React from 'react';

export default function GaugeDial({ density = 0.01, threshold = 0.05, confidence = 94, crowdLevel = 'Low' }) {
  // Density ratio relative to max threshold (0.10 max scale for visual dial)
  const maxScale = 0.10;
  const percentage = Math.min(100, Math.max(0, (density / maxScale) * 100));
  
  // Circumference of SVG gauge circle (radius r=65 => 2 * pi * 65 = 408.4)
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  // Arc angle spans 240 degrees (2/3 of circle)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  const isSafe = density < threshold;

  return (
    <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-full shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Crowd Density Dial</h3>
          <p className="text-[11px] text-slate-400 font-medium">Real-time ResNet50 analysis</p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${
          isSafe
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }`}>
          {isSafe ? 'SAFE / LOW' : 'HIGH RISK'}
        </span>
      </div>

      {/* SVG Dial */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-48 h-48 transform -rotate-135" viewBox="0 0 160 160">
          {/* Background Arc Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={isSafe ? '#10b981' : '#f43f5e'}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-white">
            {Number(density).toFixed(4)}
          </span>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
            PPL / M²
          </span>
          <span className="text-[11px] font-bold text-emerald-400 mt-1">
            {confidence}% Conf
          </span>
        </div>
      </div>

      {/* Bottom Info Boxes */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-[#0b101d] border border-slate-800/60 rounded-xl p-2.5 text-center">
          <p className="text-[10px] font-medium text-slate-400">Auto Threshold</p>
          <p className="text-xs font-bold text-indigo-400 mt-0.5">
            {threshold.toFixed(4)} ppl/m²
          </p>
        </div>
        <div className="bg-[#0b101d] border border-slate-800/60 rounded-xl p-2.5 text-center">
          <p className="text-[10px] font-medium text-slate-400">Risk Status</p>
          <p className={`text-xs font-bold mt-0.5 ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isSafe ? 'Safe / Low' : 'Elevated'}
          </p>
        </div>
      </div>
    </div>
  );
}
