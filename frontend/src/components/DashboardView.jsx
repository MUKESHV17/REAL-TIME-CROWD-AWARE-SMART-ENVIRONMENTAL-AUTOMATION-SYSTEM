import React from 'react';
import { 
  Video, 
  Users, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Fan, 
  Lightbulb, 
  Tv, 
  ExternalLink,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import GaugeDial from './GaugeDial';
import TrendChart from './TrendChart';

export default function DashboardView({ stats, devices, onToggleDevice, onNavigateTab }) {
  const peopleCount = stats?.people_count || 0;
  const density = stats?.density || 0.0100;
  const crowdLevel = stats?.crowd_level || 'Unknown';
  const crowdConfidence = stats?.crowd_confidence ? Math.round(stats.crowd_confidence * 100) : 94;

  const deviceList = Object.entries(devices || {}).map(([id, dev]) => ({
    id,
    ...dev
  }));

  const activeDevicesCount = deviceList.filter(d => d.state).length;
  const totalDevicesCount = deviceList.length || 3;

  const getDeviceIcon = (type, name) => {
    const lname = (name || '').toLowerCase();
    if (lname.includes('fan') || type === 'fan') return Fan;
    if (lname.includes('light') || type === 'light') return Lightbulb;
    if (lname.includes('tv') || type === 'tv') return Tv;
    return Sliders;
  };

  const getDeviceSettingText = (device) => {
    if (device.speed !== undefined) return `${device.speed}% Speed`;
    if (device.brightness !== undefined) return `${device.brightness}% Brightness`;
    if (device.volume !== undefined) return `${device.volume}% Volume`;
    if (device.temperature !== undefined) return `${device.temperature}°C Temp`;
    return device.state ? 'Active' : 'Off';
  };

  return (
    <div className="space-y-6">
      {/* Hero Venue Card */}
      <div className="glass-card-purple rounded-3xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              Main Venue Zone • Camera 01 Active
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Living Room / Main Hall
            </h2>
            <p className="text-xs text-slate-300 max-w-xl font-medium">
              Automated density monitoring and smart device control powered by ResNet50 & YOLOv8.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('detection')}
            className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold text-white gradient-button-purple shadow-xl self-start md:self-auto shrink-0"
          >
            <Video className="w-4 h-4" />
            Open Live Stream
          </button>
        </div>

        {/* Bottom Hero Stats Strip */}
        <div className="mt-6 pt-5 border-t border-indigo-500/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span><strong className="text-white">{peopleCount}</strong> People Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span><strong className="text-white">{Number(density).toFixed(4)}</strong> Density</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span><strong className="text-white">{activeDevicesCount} / {totalDevicesCount}</strong> Devices On</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Status: <strong className="text-emerald-400">Normal</strong></span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: People Count */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              PEOPLE COUNT
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">{peopleCount}</span>
              <span className="text-xs text-slate-400 font-medium">tracked</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              YOLOv8 Real-time Detection
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Crowd Density */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              CROWD DENSITY
            </p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-white">{Number(density).toFixed(4)}</span>
              <span className="text-xs text-slate-400 font-medium">ppl/m²</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-2">
              Threshold: <strong className="text-teal-400">0.0500 ppl/m²</strong>
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Risk Level */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              RISK LEVEL
            </p>
            <div className="mt-2">
              <span className="text-3xl font-black text-white capitalize">{crowdLevel}</span>
            </div>
            <p className="text-[11px] font-medium text-indigo-400 mt-2">
              ResNet50 Confidence: <strong>{crowdConfidence}%</strong>
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Row: Devices Overview (Left) & Dial + Trend (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Devices Overview */}
        <div className="lg:col-span-2 bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">Devices Overview</h3>
                <p className="text-xs text-slate-400 font-medium">
                  {activeDevicesCount} active smart devices connected
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('devices')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Manage Devices <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Devices Table / List */}
            <div className="space-y-3">
              {deviceList.map((device) => {
                const Icon = getDeviceIcon(device.type, device.name);
                return (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b101d] border border-slate-800/60 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{device.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {(device.type || 'Controller').toUpperCase()} Controller
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Status Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        device.state
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${device.state ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        {device.state ? 'ON' : 'OFF'}
                      </span>

                      {/* Room */}
                      <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
                        {device.room || 'Living Room'}
                      </span>

                      {/* Setting */}
                      <span className="text-xs font-semibold text-slate-400 min-w-[90px] text-right">
                        {getDeviceSettingText(device)}
                      </span>

                      {/* Quick Power Toggle */}
                      <button
                        onClick={() => onToggleDevice(device.id, !device.state)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          device.state ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          device.state ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Dial & Trend Chart */}
        <div className="space-y-6">
          <GaugeDial 
            density={density} 
            threshold={0.0500} 
            confidence={crowdConfidence} 
            crowdLevel={crowdLevel} 
          />
          <TrendChart history={[density]} />
        </div>
      </div>
    </div>
  );
}
