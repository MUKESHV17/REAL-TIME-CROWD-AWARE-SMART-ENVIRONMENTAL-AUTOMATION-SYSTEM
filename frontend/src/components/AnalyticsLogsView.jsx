import React, { useState, useEffect } from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';

export default function AnalyticsLogsView({ stats }) {
  const [logs, setLogs] = useState([
    { timestamp: '21:05:17', camera: 'Cam #0', count: 0, density: '0.0000', device: 'ON', risk: 'unknown' },
    { timestamp: '08:40:12', camera: 'Cam #0', count: 4, density: '0.0400', device: 'OFF', risk: 'Safe' },
    { timestamp: '08:35:00', camera: 'Cam #0', count: 6, density: '0.0600', device: 'ON', risk: 'Moderate' },
    { timestamp: '08:30:00', camera: 'Cam #0', count: 2, density: '0.0200', device: 'OFF', risk: 'Safe' },
  ]);

  useEffect(() => {
    if (stats && stats.frame_count) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newEntry = {
        timestamp: timeStr,
        camera: 'Cam #0',
        count: stats.people_count || 0,
        density: Number(stats.density || 0).toFixed(4),
        device: (stats.device_status || 'off').toUpperCase(),
        risk: stats.crowd_level || 'Safe'
      };
      setLogs(prev => [newEntry, ...prev.slice(0, 19)]);
    }
  }, [stats]);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Camera ID', 'People Count', 'Density (ppl/m²)', 'Device Relay', 'Risk Assessment'];
    const rows = logs.map(l => [l.timestamp, l.camera, l.count, l.density, l.device, l.risk]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'density_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskBadge = (risk) => {
    const r = (risk || '').toLowerCase();
    if (r.includes('safe') || r === 'low') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Safe</span>;
    }
    if (r.includes('moderate') || r === 'medium') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Moderate</span>;
    }
    if (r.includes('high')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">High Risk</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">unknown</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Analytics & Telemetry Logs
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              CSV log history recorded from Apple Silicon MPS GPU inference runs (<code className="text-indigo-300">density_log.csv</code>).
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            Export CSV Log
          </button>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Recent Telemetry Records
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Total Entries: <strong className="text-white">{logs.length}</strong>
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">CAMERA ID</th>
                <th className="py-3 px-4">PEOPLE COUNT</th>
                <th className="py-3 px-4">DENSITY (PPL/M²)</th>
                <th className="py-3 px-4">DEVICE RELAY</th>
                <th className="py-3 px-4 text-right">RISK ASSESSMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-300">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-400">{log.camera}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{log.count}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{log.density}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.device === 'ON' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {log.device}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {getRiskBadge(log.risk)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
