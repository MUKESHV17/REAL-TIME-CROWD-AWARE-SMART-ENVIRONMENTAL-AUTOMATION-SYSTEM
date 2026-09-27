import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function TrendChart({ history = [] }) {
  // Generate sample trend line data if history is short
  const dataPoints = history.length >= 5 
    ? history.slice(-10).map(h => typeof h === 'number' ? h : h.density || 0)
    : [0.01, 0.012, 0.008, 0.015, 0.01, 0.02, 0.014, 0.01, 0.018, 0.010];

  const maxVal = Math.max(0.05, ...dataPoints);
  const width = 300;
  const height = 80;

  // Map values to SVG coordinates
  const points = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * width;
    const y = height - (val / maxVal) * (height - 10);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Crowd Density Trend</h3>
            <p className="text-[11px] text-slate-400 font-medium">Real-time Telemetry (ppl/m²)</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Live Updates
        </span>
      </div>

      <div className="relative pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <polygon
            points={`0,${height} ${points} ${width},${height}`}
            fill="url(#chartGradient)"
          />

          {/* Line Stroke */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Current Latest Point Dot */}
          {dataPoints.length > 0 && (
            <circle
              cx={width}
              cy={height - (dataPoints[dataPoints.length - 1] / maxVal) * (height - 10)}
              r="4"
              fill="#10b981"
              className="animate-ping"
            />
          )}
        </svg>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-2">
          <span>10 samples ago</span>
          <span>Just now</span>
        </div>
      </div>
    </div>
  );
}
