/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Navigation, Users, EyeOff, Play, Pause, RotateCcw } from "lucide-react";

interface FocusOrbProps {
  focusIndex: number;
  timerProgress: number; // Percent 0-100 indicating timer elapsed
  isActive: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onEnterBlackout: () => void;
  blackoutActive: boolean;
}

export function FocusOrb({
  focusIndex,
  timerProgress,
  isActive,
  onToggleTimer,
  onResetTimer,
  onEnterBlackout,
  blackoutActive,
}: FocusOrbProps) {
  // Determine state labels, color glows and animated classes
  let stateLabel = "";
  let stateColorClass = "";
  let stateBgClass = "";
  let glowOuterClass = "";
  let orbAnimationClass = "";

  if (focusIndex >= 0.7) {
    stateLabel = "Đang tập trung";
    stateColorClass = "text-emerald-400";
    stateBgClass = "bg-emerald-500/10 border-emerald-500/30";
    glowOuterClass = "from-emerald-500/20 to-teal-500/5";
    orbAnimationClass = "animate-orb-focused";
  } else if (focusIndex >= 0.4) {
    stateLabel = "Đang xao nhãng";
    stateColorClass = "text-orange-400";
    stateBgClass = "bg-orange-500/10 border-orange-500/30";
    glowOuterClass = "from-orange-500/20 to-amber-500/5";
    orbAnimationClass = "animate-orb-wavering";
  } else {
    stateLabel = "Mất tập trung";
    stateColorClass = "text-red-400";
    stateBgClass = "bg-red-500/10 border-red-500/30";
    glowOuterClass = "from-red-500/20 to-rose-500/5";
    orbAnimationClass = "animate-orb-distracted";
  }

  // Convert timer progress to a decreasing circumference offset
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[420px] relative">
      {/* Background radial soft light */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr ${glowOuterClass} opacity-45 blur-3xl pointer-events-none transition-all duration-1000`} />

      {/* Outer spinning ring decoration */}
      <div className="absolute w-[270px] h-[270px] border border-dashed border-slate-800 rounded-full animate-orbit-ring pointer-events-none" style={{ animationDuration: "40s" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500/40 rounded-full shadow-[0_0_8px_#6366f1]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500/40 rounded-full shadow-[0_0_6px_#14b8a6]" />
      </div>

      {/* Main Focus Orb Visualizer */}
      <div className="relative w-60 h-60 flex items-center justify-center rounded-full">
        
        {/* React SVG Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          {/* Base track */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            className="stroke-slate-950 fill-none"
            strokeWidth="3"
          />
          {/* Active Progress */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            className="stroke-indigo-500/50 fill-none transition-all duration-300"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Breathing Inner Glowing Orb Element */}
        <div
          id="central-focus-orb"
          className={`w-44 h-44 rounded-full flex flex-col items-center justify-center border text-center transition-all duration-700 bg-slate-950/90 shadow-2xl relative ${orbAnimationClass} ${stateBgClass}`}
        >
          {/* EEG Index text */}
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
            SÓNG NÃO ĐO
          </span>
          <div className="text-3xl font-display font-medium text-slate-100 mt-1">
            {focusIndex.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            beta / (alpha+theta)
          </span>

          {/* Focused Badge Indicator */}
          <div className={`mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-transparent ${stateColorClass} bg-slate-950/60`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span className="vietnam-text">{stateLabel}</span>
          </div>
        </div>
      </div>

      {/* Below Orb controls and state indicators */}
      {!blackoutActive && (
        <div className="w-full max-w-sm mt-6 flex flex-col items-center gap-5 z-10 animate-fade-in">
          {/* Play/Pause control center */}
          <div className="flex items-center gap-4">
            <button
              onClick={onResetTimer}
              title="Đặt lại thời gian"
              className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-850 rounded-2xl active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>

            <button
              id="start-focus-button"
              onClick={onToggleTimer}
              className={`py-4 px-10 rounded-2xl text-sm font-semibold flex items-center gap-3 active:scale-[0.98] transition-all border shadow-lg cursor-pointer ${
                isActive
                  ? "bg-slate-950 text-orange-400 border-orange-500/20 shadow-orange-950/5 hover:bg-slate-900"
                  : "bg-indigo-650 hover:bg-indigo-600 text-indigo-50 border-indigo-500/30 shadow-indigo-950/20"
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4.5 h-4.5" />
                  <span className="vietnam-text">Tạm Dừng Thử Thách</span>
                </>
              ) : (
                <>
                  <Play className="w-4.5 h-4.5 text-indigo-200" />
                  <span className="vietnam-text">Bắt Đầu Ngay</span>
                </>
              )}
            </button>

            <button
              onClick={onEnterBlackout}
              title="Tập trung tối giản (Blackout Mode)"
              className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-850 rounded-2xl active:scale-95 transition-all cursor-pointer"
            >
              <EyeOff className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Social Proof Body Doubling Section */}
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-850/60 px-4 py-2.5 rounded-xl text-slate-400 text-xs">
            <div className="flex items-center justify-center w-5 h-5 bg-teal-500/10 rounded-full">
              <Users className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            </div>
            <span className="vietnam-text">
              Có <strong className="text-teal-400 font-mono">3 người khác</strong> đang cùng tập trung học với bạn!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
