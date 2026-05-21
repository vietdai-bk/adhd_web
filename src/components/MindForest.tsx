/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Trees, Sprout, Leaf, TreePine, Sparkles, Milestone } from "lucide-react";

interface MindForestProps {
  cumulativePoints: number;
}

export function MindForest({ cumulativePoints }: MindForestProps) {
  // Determine current Zen Level
  const currentLevel = Math.max(1, Math.floor(cumulativePoints / 50) + 1);
  const xpInCurrentLevel = cumulativePoints % 50;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 50) * 100));

  // Determine standard grid items to show
  const gridCells = Array.from({ length: 12 });

  // Helper to determine what kind of plant is unlocked at each cell based on cumulativePoints
  const getPlantForCell = (index: number) => {
    const requiredPoints = index * 15; // Unlocks sequentially
    const isUnlocked = cumulativePoints >= requiredPoints;

    if (!isUnlocked) {
      return {
        type: "locked",
        color: "text-slate-800",
        label: "Hạt giống mầm",
        icon: null,
      };
    }

    // Different plant states based on how far in the forest
    if (index % 4 === 0) {
      return {
        type: "pine",
        color: "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]",
        label: "Thông pha lê",
        icon: TreePine,
      };
    } else if (index % 3 === 0) {
      return {
        type: "sprout",
        color: "text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]",
        label: "Chồi non Tinh vân",
        icon: Sprout,
      };
    } else if (index % 2 === 0) {
      return {
        type: "leaf",
        color: "text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]",
        label: "Lá ngọc lục bảo",
        icon: Leaf,
      };
    } else {
      return {
        type: "ancient",
        color: "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]",
        label: "Đại thụ Tâm trí",
        icon: Trees,
      };
    }
  };

  return (
    <div id="mind-forest-section" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Trees className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-display font-medium text-slate-100 vietnam-text">
              Rừng Tâm Trí (Mind Forest)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 vietnam-text">
            Cây cối phát triển dựa trên độ tập trung của bạn. Điểm tích lũy không bao giờ giảm.
          </p>
        </div>

        {/* Level badge */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Độ Thăng Tiến</div>
            <div className="text-sm font-semibold text-emerald-400 vietnam-text">Cấp Độ {currentLevel}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-display font-bold">
            {currentLevel}
          </div>
        </div>
      </div>

      {/* Levels and global stats progress */}
      <div className="mb-6 bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-400 vietnam-text font-mono">Điểm vĩnh viễn: {cumulativePoints} XP</span>
          <span className="text-emerald-400 font-mono">{progressPercent}% đến Cấp {currentLevel + 1}</span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Forest Grid Map */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-4 bg-slate-950/70 border border-slate-800/50 rounded-xl relative overflow-hidden">
        {/* Sparkle starry background decorations */}
        <div className="absolute top-4 left-10 text-slate-600/20 animate-twinkle">
          <Sparkles className="w-3 h-3" />
        </div>
        <div className="absolute bottom-10 right-12 text-slate-600/35 animate-twinkle" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-1/2 left-1/2 text-slate-600/15 animate-twinkle" style={{ animationDelay: "2s" }}>
          <Sparkles className="w-5 h-5" />
        </div>

        {gridCells.map((_, index) => {
          const plant = getPlantForCell(index);
          const requiredPoints = index * 15;
          const isUnlocked = cumulativePoints >= requiredPoints;

          return (
            <div
              key={index}
              id={`forest-cell-${index}`}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg relative transition-all duration-300 border ${
                isUnlocked
                  ? "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/30 hover:border-slate-700/60"
                  : "bg-slate-950/90 border-slate-900/50"
              }`}
              title={isUnlocked ? plant.label : `Khóa (Cần ${requiredPoints} XP)`}
            >
              {isUnlocked && plant.icon ? (
                <div className="flex flex-col items-center gap-1">
                  <plant.icon className={`${plant.color} w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 hover:scale-110`} />
                  <span className="text-[9px] text-slate-500 font-mono truncate max-w-full px-1">
                    {plant.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
                  <span className="text-[8px] text-slate-600 font-mono mt-1">
                    {requiredPoints} XP
                  </span>
                </div>
              )}

              {/* Absolute coordinates for brutalist feel */}
              <span className="absolute bottom-1 right-1 text-[7px] text-slate-700 font-mono">
                {String.fromCharCode(65 + Math.floor(index / 4))}{index % 4}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-lime-500/10 border border-lime-500/20 inline-block" />
          <span>Lá ngọc (0+ XP)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-teal-500/10 border border-teal-500/20 inline-block" />
          <span>Chồi non (45+ XP)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 inline-block" />
          <span>Thông đá (60+ XP)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block" />
          <span>Đại thụ tâm trí (120+ XP)</span>
        </div>
      </div>
    </div>
  );
}
