import React, { useState } from 'react';
import { 
  Plus, 
  Info, 
  Fan, 
  Lightbulb, 
  Tv, 
  Thermometer, 
  Sliders, 
  Trash2,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function SmartDevicesView({ 
  devices, 
  onToggleDevice, 
  onControlDevice, 
  onAddDevice, 
  onRemoveDevice 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState('fan');
  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('Living Room');

  const deviceList = Object.entries(devices || {}).map(([id, dev]) => ({
    id,
    ...dev
  }));

  const getDeviceIcon = (type, name) => {
    const lname = (name || '').toLowerCase();
    if (lname.includes('fan') || type === 'fan') return Fan;
    if (lname.includes('light') || type === 'light') return Lightbulb;
    if (lname.includes('tv') || type === 'tv') return Tv;
    if (lname.includes('ac') || type === 'ac') return Thermometer;
    return Sliders;
  };

  const getControlConfig = (device) => {
    const lname = (device.name || '').toLowerCase();
    if (device.type === 'fan' || lname.includes('fan')) {
      return { key: 'speed', label: 'Speed Control', unit: '%', value: device.speed || 0 };
    }
    if (device.type === 'light' || lname.includes('light')) {
      return { key: 'brightness', label: 'Brightness', unit: '%', value: device.brightness || 0 };
    }
    if (device.type === 'tv' || lname.includes('tv')) {
      return { key: 'volume', label: 'Volume', unit: '%', value: device.volume || 0 };
    }
    if (device.type === 'ac' || lname.includes('ac')) {
      return { key: 'temperature', label: 'Temperature', unit: '°C', value: device.temperature || 22 };
    }
    return { key: 'speed', label: 'Setting', unit: '%', value: 50 };
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddDevice({ type: newType, name: newName, room: newRoom });
    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Smart IoT Device Automation
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Hardware GPIO relays and Flask API control for venue fans, lights, and smart appliances.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Device
          </button>
        </div>

        {/* Rule Alert Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 font-medium">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Automated Crowd Density Rule:</strong> When crowd density reaches{' '}
            <strong className="text-teal-400">0.0100 ppl/m²</strong> (1+ person detected), ceiling fans and HVAC automatically activate via backend GPIO.
          </span>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          CONNECTED SMART DEVICES ({deviceList.length})
        </h3>
      </div>

      {/* Devices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deviceList.map((device) => {
          const Icon = getDeviceIcon(device.type, device.name);
          const control = getControlConfig(device);

          return (
            <div
              key={device.id}
              className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{device.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{device.room || 'Living Room'}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${device.state ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span className="text-[10px] text-slate-400 font-medium">
                        {device.state ? 'Online & Active' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Power Toggle Switch */}
                <button
                  onClick={() => onToggleDevice(device.id, !device.state)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    device.state ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    device.state ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Slider Control */}
              <div className="pt-2 border-t border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">{control.label}</span>
                  <span className="font-bold text-white">
                    {control.value}{control.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={control.value}
                  onChange={(e) => onControlDevice(device.id, control.key, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Delete button (visible on hover) */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onRemoveDevice(device.id)}
                  className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Device Box */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0b101d] border-2 border-dashed border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 group transition-all min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-300 group-hover:text-white">Add New Device</h4>
          <p className="text-[11px] text-slate-500 font-medium">Connect a new smart device to IoT relay</p>
        </button>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Smart Device</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Device Name</label>
                <input
                  type="text"
                  placeholder="e.g. Living Room Fan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Device Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="fan">Ceiling Fan</option>
                  <option value="light">Smart Light</option>
                  <option value="tv">Smart TV</option>
                  <option value="ac">Air Conditioner (AC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room / Zone</label>
                <input
                  type="text"
                  placeholder="e.g. Living Room"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
                >
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
