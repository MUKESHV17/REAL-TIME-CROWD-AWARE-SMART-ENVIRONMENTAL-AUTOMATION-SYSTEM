import React from 'react';
import { ShieldCheck, Cpu, Database, Server, Zap, CheckCircle2 } from 'lucide-react';

export default function SecurityModelsView({ systemInfo }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          Security Architecture & AI Models Breakdown
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Deep learning models and system execution pipeline configuration active on local backend server.
        </p>
      </div>

      {/* Grid of Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Model 1: YOLOv8 */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              YOLOv8 Object Detection Engine
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Model path: <code className="text-emerald-300 font-mono">yolov8n.pt</code>. Performs single-stage real-time bounding box detection for person tracking.
          </p>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Confidence Threshold: <strong>0.30</strong></span>
            <span>Target Class: <strong>Person (0)</strong></span>
          </div>
        </div>

        {/* Model 2: ResNet50 */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              ResNet-50 Density Classifier
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Loaded
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Custom PyTorch model with convolutional density head. Estimates overall density map and classifies crowd risk levels.
          </p>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Field of View: <strong>100 m²</strong></span>
            <span>Density Limit: <strong>0.05 ppl/m²</strong></span>
          </div>
        </div>

        {/* DeepSORT Tracking */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-teal-400" />
              DeepSORT MobileNet Embedder
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
              Tracking
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time deep association metric tracker. Assigns persistent unique IDs across video frames to prevent double counting.
          </p>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Max Track Age: <strong>50 frames</strong></span>
            <span>Cosine Distance: <strong>0.4</strong></span>
          </div>
        </div>

        {/* Hardware & Relay */}
        <div className="bg-[#131b2e] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Hardware Relay & Accelerator
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Apple MPS GPU
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Raspberry Pi GPIO Pin 17 controller with mock fallback. Accelerated using Metal Performance Shaders (MPS) GPU acceleration.
          </p>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>GPIO Pin: <strong>17 (BCM)</strong></span>
            <span>Device: <strong>{systemInfo?.device || 'mps'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
