import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Layers 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isAuthenticated, onOpenAuth }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detection', label: 'Crowd Detection', icon: Video, badge: 'LIVE' },
    { id: 'devices', label: 'Smart Devices', icon: Cpu },
    { id: 'logs', label: 'Analytics & Logs', icon: FileText },
    { id: 'models', label: 'Security & Models', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-[#0d1322] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg text-white tracking-tight">CrowdPulse</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Crowd & IoT Hub</p>
          </div>
        </div>

        {/* Menu Navigation Section */}
        <div className="mb-2">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-3">
            Menu Navigation
          </p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Account */}
      <div className="pt-4 border-t border-slate-800/60 space-y-3">
        <button
          onClick={onOpenAuth}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          {isAuthenticated ? (
            <>
              <LogOut className="w-4 h-4" /> Sign Out
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" /> Sign In / Register
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-medium">
          <span>System v2.4 Pro</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
            MPS GPU Active
          </span>
        </div>
      </div>
    </aside>
  );
}
