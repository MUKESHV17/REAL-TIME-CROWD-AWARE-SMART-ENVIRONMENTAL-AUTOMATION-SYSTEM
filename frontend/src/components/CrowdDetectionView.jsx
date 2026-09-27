import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Users, 
  Activity, 
  ShieldAlert, 
  Cpu, 
  Maximize2,
  Video
} from 'lucide-react';

export default function CrowdDetectionView({ 
  isDetectionRunning, 
  onStartDetection, 
  onStopDetection, 
  stats 
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const peopleCount = stats?.people_count || 0;
  const density = stats?.density || 0.0000;
  const crowdLevel = stats?.crowd_level || 'Unknown';
  const confidence = stats?.crowd_confidence ? Math.round(stats.crowd_confidence * 100) : 0;
  const deviceStatus = (stats?.device_status || 'ON').toUpperCase();

  const toggleFullscreen = () => {
    const videoElem = document.getElementById('camera-stream-img');
    if (videoElem) {
      if (!document.fullscreenElement) {
        videoElem.requestFullscreen().catch(err => console.error(err));
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(err => console.error(err));
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Panel */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" />
              Crowd Analytics & Detection Panel
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Live camera feed processing using YOLOv8 object detector and MobileNet DeepSort real-time tracker.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isDetectionRunning ? (
              <button
                onClick={onStartDetection}
                className="btn-start-detection flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                START DETECTION
              </button>
            ) : (
              <button
                onClick={onStopDetection}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-600/20 transition-all"
              >
                <Square className="w-4 h-4 fill-white" />
                STOP DETECTION
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-xs font-semibold">
              <span className="text-slate-400">System Status:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isDetectionRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {isDetectionRunning ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: People Count */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              PEOPLE COUNT
            </p>
            <p className="text-3xl font-black text-white mt-2">{peopleCount}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Total individuals in frame</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Density */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              DENSITY
            </p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-white">{Number(density).toFixed(4)}</span>
              <span className="text-xs text-slate-400 font-semibold">ppl/m²</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">FOV: 100 m²</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Crowd Level */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              CROWD LEVEL
            </p>
            <p className="text-3xl font-black text-white mt-2 capitalize">{crowdLevel}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Confidence: {confidence}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Device Status */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              DEVICE STATUS
            </p>
            <p className="text-3xl font-black text-white mt-2">{deviceStatus}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Automated IoT Relay</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Live Feed Container */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-400" />
            Live Feed Stream
          </h3>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b101d] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Fullscreen
          </button>
        </div>

        <div className="relative w-full aspect-video bg-[#050811] rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {isDetectionRunning ? (
            <img
              id="camera-stream-img"
              src="http://localhost:5000/video_feed"
              alt="Live Detection Stream"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">Camera Feed Standby</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Click "Start Detection" above to launch real-time YOLOv8 person detection and video streaming.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
