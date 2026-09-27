import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import CrowdDetectionView from './components/CrowdDetectionView';
import SmartDevicesView from './components/SmartDevicesView';
import AnalyticsLogsView from './components/AnalyticsLogsView';
import SecurityModelsView from './components/SecurityModelsView';
import LoginModal from './components/LoginModal';

const API_BASE_URL = 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDetectionRunning, setIsDetectionRunning] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);

  // System stats state with defaults
  const [stats, setStats] = useState({
    people_count: 1,
    density: 0.0100,
    device_status: 'on',
    crowd_level: 'Unknown',
    crowd_confidence: 0.94,
    tracked_ids: [1],
    tracking_info: [],
    processing_time: 35,
    fps: 28.5,
    frame_count: 100
  });

  // Devices state with defaults matching backend initial setup
  const [devices, setDevices] = useState({
    'fan': { name: 'Ceiling Fan', state: true, speed: 30, room: 'Living Room', type: 'fan' },
    'light': { name: 'Smart Light', state: true, brightness: 40, room: 'Living Room', type: 'light' },
    'tv': { name: 'Smart TV', state: true, volume: 10, room: 'Living Room', type: 'tv' }
  });

  // Fetch backend status periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/detection_status`);
        if (res.ok) {
          const data = await res.json();
          setIsDetectionRunning(data.running || false);
          if (data.stats) {
            setStats(prev => ({ ...prev, ...data.stats }));
          }
        }
      } catch (err) {
        // Backend fallback polling silent handle
      }
    };

    const fetchDevices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/devices`);
        if (res.ok) {
          const data = await res.json();
          if (data.devices) {
            setDevices(data.devices);
          }
        }
      } catch (err) {}
    };

    fetchStatus();
    fetchDevices();

    const interval = setInterval(() => {
      fetchStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch system info once
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/system_info`)
      .then(res => res.json())
      .then(data => setSystemInfo(data))
      .catch(() => {});
  }, []);

  // Handler: Start Detection
  const handleStartDetection = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/start_detection`, { method: 'POST' });
      if (res.ok) {
        setIsDetectionRunning(true);
      }
    } catch (err) {
      console.error('Failed to start detection:', err);
      setIsDetectionRunning(true); // UI fallback toggle
    }
  };

  // Handler: Stop Detection
  const handleStopDetection = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stop_detection`, { method: 'POST' });
      if (res.ok) {
        setIsDetectionRunning(false);
      }
    } catch (err) {
      console.error('Failed to stop detection:', err);
      setIsDetectionRunning(false);
    }
  };

  // Handler: Toggle Device ON/OFF
  const handleToggleDevice = async (deviceId, newState) => {
    // Optimistic UI update
    setDevices(prev => ({
      ...prev,
      [deviceId]: { ...prev[deviceId], state: newState }
    }));

    try {
      await fetch(`${API_BASE_URL}/api/device/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: deviceId, state: newState })
      });
    } catch (err) {
      console.error('Error toggling device:', err);
    }
  };

  // Handler: Device Control Slider Update
  const handleControlDevice = async (deviceId, controlType, value) => {
    setDevices(prev => ({
      ...prev,
      [deviceId]: { 
        ...prev[deviceId], 
        [controlType]: value,
        state: value > 0 ? true : prev[deviceId].state
      }
    }));

    try {
      await fetch(`${API_BASE_URL}/api/device/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: deviceId, control: controlType, value })
      });
    } catch (err) {
      console.error('Error controlling device:', err);
    }
  };

  // Handler: Add Device
  const handleAddDevice = async (deviceData) => {
    const tempId = `dev-${Date.now()}`;
    const newDev = {
      name: deviceData.name,
      room: deviceData.room,
      type: deviceData.type,
      state: false,
      speed: deviceData.type === 'fan' ? 0 : undefined,
      brightness: deviceData.type === 'light' ? 0 : undefined,
      volume: deviceData.type === 'tv' ? 0 : undefined,
      temperature: deviceData.type === 'ac' ? 22 : undefined,
    };

    setDevices(prev => ({ ...prev, [tempId]: newDev }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/device/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.device_id && data.device) {
          setDevices(prev => {
            const next = { ...prev };
            delete next[tempId];
            next[data.device_id] = data.device;
            return next;
          });
        }
      }
    } catch (err) {}
  };

  // Handler: Remove Device
  const handleRemoveDevice = async (deviceId) => {
    setDevices(prev => {
      const next = { ...prev };
      delete next[deviceId];
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/api/device/remove/${deviceId}`, {
        method: 'DELETE'
      });
    } catch (err) {}
  };

  return (
    <div className="flex min-h-screen bg-[#090d16] text-slate-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {/* Top Header */}
        <Header
          isDetectionRunning={isDetectionRunning}
          onStartDetection={handleStartDetection}
          onStopDetection={handleStopDetection}
          stats={stats}
          isAuthenticated={isAuthenticated}
          onOpenAuth={() => setShowAuthModal(true)}
        />

        {/* Dynamic View Rendering based on activeTab */}
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            devices={devices}
            onToggleDevice={handleToggleDevice}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'detection' && (
          <CrowdDetectionView
            isDetectionRunning={isDetectionRunning}
            onStartDetection={handleStartDetection}
            onStopDetection={handleStopDetection}
            stats={stats}
          />
        )}

        {activeTab === 'devices' && (
          <SmartDevicesView
            devices={devices}
            onToggleDevice={handleToggleDevice}
            onControlDevice={handleControlDevice}
            onAddDevice={handleAddDevice}
            onRemoveDevice={handleRemoveDevice}
          />
        )}

        {activeTab === 'logs' && (
          <AnalyticsLogsView stats={stats} />
        )}

        {activeTab === 'models' && (
          <SecurityModelsView systemInfo={systemInfo} />
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => setIsAuthenticated(true)}
      />
    </div>
  );
}
