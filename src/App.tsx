/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Sparkles,
  Award,
  Eye,
  EyeOff,
  Bell,
  Sliders,
  ChevronRight,
  RotateCcw,
  Volume2,
  X,
  Plus,
  HelpCircle,
  Clock,
  Scissors,
  Trees,
} from "lucide-react";
import { EEGData, GameState, ThemeSkin, ToastMessage } from "./types";
import { ambientSynth } from "./utils/audioEngine";
import { MindForest } from "./components/MindForest";
import { TaskShredder } from "./components/TaskShredder";
import { RewardShop } from "./components/RewardShop";
import { DistractionModal } from "./components/DistractionModal";
import { FocusOrb } from "./components/FocusOrb";

export default function App() {
  // Global XP & Currency State
  const [gameState, setGameState] = useState<GameState>({
    cumulativePoints: 12, // Initial state showing partial forest growth
    spendablePoints: 25, // Close to rewards for instant validation
    themeSkin: "cosmic",
    lofiUnlocked: false,
    lofiPlaying: false,
  });

  // Timer Configuration State (Visual Shrinking Bar instead of numbers)
  const [timerDuration, setTimerDuration] = useState(25 * 60); // Default 25 mins
  const [timerLeft, setTimerLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Simulated EEG Wave Engine State
  const [eeg, setEeg] = useState<EEGData>({
    alpha: 9.8,
    beta: 14.2,
    theta: 5.4,
    focusIndex: 14.2 / (9.8 + 5.4), // 0.93
  });
  
  // Custom simulation slider overrides for testing
  const [simulationMode, setSimulationMode] = useState<"auto" | "distracted" | "highly-focused">("auto");
  const [consecutiveDistractedSeconds, setConsecutiveDistractedSeconds] = useState(0);

  // UI Modes
  const [blackoutMode, setBlackoutMode] = useState(false);
  const [distractionModalOpen, setDistractionModalOpen] = useState(false);
  
  // Custom Toast Controller
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Active Tab State for ADHD tactile/modular layout
  const [activeTab, setActiveTab] = useState<"focus" | "shredder" | "rewards">("focus");

  // Sound Synth Ref
  const synthRef = useRef(ambientSynth);

  // Trigger custom in-app notifications
  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Safe reward allocation function
  const handleAwardPoints = (points: number, reason: string) => {
    setGameState((prev) => ({
      ...prev,
      cumulativePoints: prev.cumulativePoints + points,
      spendablePoints: prev.spendablePoints + points,
    }));
    addToast(`+${points} XP & Xu: ${reason}`, "success");
  };

  // EEG simulation loop (Tick every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      let nextAlpha = eeg.alpha;
      let nextBeta = eeg.beta;
      let nextTheta = eeg.theta;

      if (simulationMode === "highly-focused") {
        // High focus: high beta, repressed sleepy theta/alpha waves
        nextAlpha = parseFloat((7.0 + Math.random() * 1.5).toFixed(1));
        nextBeta = parseFloat((18.0 + Math.random() * 2.5).toFixed(1));
        nextTheta = parseFloat((3.0 + Math.random() * 1.0).toFixed(1));
      } else if (simulationMode === "distracted") {
        // High theta and alpha (daydreaming), low beta
        nextAlpha = parseFloat((11.0 + Math.random() * 2.0).toFixed(1));
        nextBeta = parseFloat((6.2 + Math.random() * 1.0).toFixed(1));
        nextTheta = parseFloat((9.5 + Math.random() * 1.5).toFixed(1));
      } else {
        // Default "Auto Walk" fluctuation
        nextAlpha = parseFloat((8.5 + Math.sin(Date.now() / 8000) * 1.5 + Math.random() * 0.4).toFixed(1));
        nextTheta = parseFloat((5.5 + Math.cos(Date.now() / 12000) * 1.0 + Math.random() * 0.3).toFixed(1));
        nextBeta = parseFloat((13.5 + Math.sin(Date.now() / 5000) * 2.5 + Math.random() * 0.5).toFixed(1));
      }

      const nextFocus = nextBeta / (nextAlpha + nextTheta);
      setEeg({
        alpha: nextAlpha,
        beta: nextBeta,
        theta: nextTheta,
        focusIndex: nextFocus,
      });

      // Handle timer count down
      if (timerActive) {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            handleAwardPoints(50, "Bạn đã hoàn thành trọn vẹn chu kỳ thử thách tập trung! Thật phi thường!");
            return timerDuration;
          }
          return prev - 1;
        });

        // EEG Interception logic
        // If focusIndex < 0.40 for 5 consecutive seconds while timer is active, trigger DistractionEvent
        if (nextFocus < 0.40) {
          setConsecutiveDistractedSeconds((c) => {
            const nextCount = c + 1;
            if (nextCount >= 5) {
              setTimerActive(false); // Pause timer
              setDistractionModalOpen(true);
              addToast("⚠️ Phát hiện nguy cơ xao nhãng liên tục!", "error");
              return 0;
            }
            return nextCount;
          });
        } else {
          setConsecutiveDistractedSeconds(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eeg, simulationMode, timerActive, timerDuration]);

  // Shop purchase integrations
  const handlePurchaseNebula = () => {
    if (gameState.spendablePoints >= 50) {
      setGameState((prev) => ({
        ...prev,
        spendablePoints: prev.spendablePoints - 50,
        themeSkin: "nebula",
      }));
      addToast("Đã kích hoạt Giao diện Tinh Vân tím thẫm mộng mơ!", "success");
    } else {
      addToast("Thiếu Xu! Hãy hoàn thành thêm nhiệm vụ để kiếm đủ 50 Xu.", "error");
    }
  };

  const handlePurchaseLofi = () => {
    if (gameState.spendablePoints >= 30) {
      setGameState((prev) => ({
        ...prev,
        spendablePoints: prev.spendablePoints - 30,
        lofiUnlocked: true,
      }));
      addToast("Nhạc Lofi Sóng Não đã mở khóa! Hãy ấn Bật nhạc.", "success");
    } else {
      addToast("Thiếu Xu! Bạn cần thêm xu để mở khóa bản thu trị trị liệu này.", "error");
    }
  };

  const handleToggleLofi = () => {
    if (!gameState.lofiUnlocked) return;

    const nextPlaying = !gameState.lofiPlaying;
    setGameState((prev) => ({ ...prev, lofiPlaying: nextPlaying }));

    if (nextPlaying) {
      synthRef.current.start();
      addToast("Đang phát Lofi xoa dịu sóng não (10Hz Alpha Binaural)...", "info");
    } else {
      synthRef.current.stop();
      addToast("Đã tắt nhạc lofi.", "info");
    }
  };

  // Timer controls
  const handleToggleTimer = () => {
    setTimerActive(!timerActive);
    addToast(timerActive ? "Đã tạm dừng bộ hẹn giờ." : "Khởi động kén tập trung mới!", "info");
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimerLeft(timerDuration);
    setConsecutiveDistractedSeconds(0);
    addToast("Bộ hẹn giờ đã lập trình về ban đầu.", "info");
  };

  const handleSetPresetDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setTimerDuration(seconds);
    setTimerLeft(seconds);
    setTimerActive(false);
    setConsecutiveDistractedSeconds(0);
    addToast(`Định hướng thời gian mục tiêu: ${minutes} phút.`, "info");
  };

  // Distraction recovery callbacks
  const handleDistractionRecovered = () => {
    setDistractionModalOpen(false);
    // Add +10 to both cumulative and spendable
    setGameState((prev) => ({
      ...prev,
      cumulativePoints: prev.cumulativePoints + 10,
      spendablePoints: prev.spendablePoints + 10,
    }));
    setConsecutiveDistractedSeconds(0);
    setTimerActive(true); // resume timer
    addToast("Tuyệt vời! Đã nạp lại năng lượng tập trung (+10 Xu & XP)", "success");
  };

  const handleDistractionSkipped = () => {
    setDistractionModalOpen(false);
    setConsecutiveDistractedSeconds(0);
    setTimerActive(true); // resume timer
    addToast("Đã bỏ qua. Hãy tự điều tiết nhịp thở nhé!", "info");
  };

  // Calculate shrinking progress bar percentage
  const timerProgress = (timerLeft / timerDuration) * 100;

  // Cleanup synthesizer audio context on unmount
  useEffect(() => {
    return () => {
      synthRef.current.stop();
    };
  }, []);

  return (
    <div
      className={`min-h-screen text-slate-100 transition-all duration-1000 ${
        gameState.themeSkin === "nebula"
          ? "bg-[#140824] bg-radial-at-t from-[#200c3b] via-[#10061e] to-[#080210]"
          : "bg-[#0b0f19] bg-radial-at-t from-[#11192e] via-[#0b0f19] to-[#05070c]"
      } font-sans relative overflow-x-hidden`}
    >
      {/* Toast Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl border flex items-start gap-2 shadow-2xl transition-all duration-300 animate-fade-in ${
              t.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300 shadow-emerald-950/20"
                : t.type === "error"
                ? "bg-red-950/90 border-red-500/30 text-red-300 shadow-red-950/20"
                : "bg-indigo-950/90 border-indigo-500/30 text-indigo-300 shadow-indigo-950/20"
            }`}
          >
            <Bell className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="text-xs font-medium vietnam-text">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Blackout Mode HUD Overlay */}
      {blackoutMode && (
        <div
          onClick={() => setBlackoutMode(false)}
          className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 animate-fade-in"
          title="Ấn vào màn hình để thoát Chế độ Tĩnh Lặng"
        >
          {/* Breathing Orb centered singly */}
          <FocusOrb
            focusIndex={eeg.focusIndex}
            timerProgress={timerProgress}
            isActive={timerActive}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onEnterBlackout={() => setBlackoutMode(false)}
            blackoutActive={true}
          />
          <div className="absolute bottom-10 text-[10px] uppercase font-mono tracking-[0.25em] text-slate-600 animate-pulse text-center px-4 leading-relaxed vietnam-text">
            Chế độ tĩnh lặng đang bật • Ấn bất kỳ đâu trên màn hình để trở về
          </div>
        </div>
      )}

      {/* Distraction Full Screen Recovery Interceptor */}
      <DistractionModal
        isOpen={distractionModalOpen}
        onComplete={handleDistractionRecovered}
        onSkip={handleDistractionSkipped}
      />

      {/* Top Sensory Comfort Header bar */}
      <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-bold text-slate-100 uppercase tracking-wide">
                  La Bàn Tập Trung
                </h1>
                <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.5 rounded-full uppercase">
                  V1.2 ADHD Demo
                </span>
              </div>
              <p className="text-[10px] text-slate-400 vietnam-text">
                Kén bảo vệ tinh thần & điều hòa giác quan tự định hướng
              </p>
            </div>
          </div>

          {/* Points Widget Display */}
          <div className="flex items-center gap-4">
            {/* Total XP level */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-3.5 py-1.8 rounded-xl">
              <Award className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[8px] text-slate-500 font-mono tracking-wider uppercase">TÍCH LŨY</div>
                <div className="text-xs font-mono font-bold text-emerald-300">{gameState.cumulativePoints} XP</div>
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-3.5 py-1.8 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <div>
                <div className="text-[8px] text-slate-500 font-mono tracking-wider uppercase">VÍ TIỀN</div>
                <div className="text-xs font-mono font-bold text-amber-300">{gameState.spendablePoints} Xu</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        
        {/* Monospace ADHD Tab Controller Switcher */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-3 mb-10 bg-slate-950/60 p-3 rounded-2xl border border-slate-900/80 max-w-4xl mx-auto">
          <button
            onClick={() => {
              setActiveTab("focus");
              addToast("Chuyển đến: Kén Tập Trung & EEG", "info");
            }}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "focus"
                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.12)]"
                : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"
            }`}
          >
            <Brain className={`w-4 h-4 ${timerActive ? "animate-pulse text-indigo-400" : ""}`} />
            <span>[01_KÉN_TẬP_TRUNG] {timerActive ? "●" : ""}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("shredder");
              addToast("Chuyển đến: Máy Nghiền Công Việc", "info");
            }}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "shredder"
                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.12)]"
                : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>[02_MÁY_NGHIỀN_VIỆC]</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("rewards");
              addToast("Chuyển đến: Rừng Tâm Trí & Đổi Thưởng", "info");
            }}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === "rewards"
                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.12)]"
                : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent"
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>[03_RỪNG_&_ĐỔI_THƯƠNG]</span>
          </button>
        </div>

        {/* Tab Contents: Render Conditionally with beautiful staggered design */}
        {activeTab === "focus" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Focus Orb Left Column (Grid span 6) */}
            <section style={{ height: "679px" }} className="lg:col-span-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

              <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
                <div>
                  <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase mb-0.5">
                    TÂM ĐIỂM GIÁC QUAN
                  </div>
                  <h2 className="text-lg font-display font-semibold text-slate-200 vietnam-text">
                    Kén Lọc Tạp Âm
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">Sóng Sáng</span>
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    {timerActive ? "Đang đếm" : "Chờ kích"}
                  </span>
                </div>
              </div>

              {/* Primary Visual Timer Shrinking Progress Bar Line */}
              <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-850 my-2 relative z-10">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>Dòng thời gian tuyến tính (Sạch)</span>
                  </span>
                  <span>{timerActive ? "Bộ hẹn lùi đang chảy..." : "Yêu cầu nhấp bắt đầu"}</span>
                </div>
                
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 transition-all duration-1000 ease-linear shadow-[0_0_12px_#6366f1]"
                    style={{ width: `${timerProgress}%` }}
                  />
                </div>
              </div>

              {/* Core focus orb */}
              <FocusOrb
                focusIndex={eeg.focusIndex}
                timerProgress={timerProgress}
                isActive={timerActive}
                onToggleTimer={handleToggleTimer}
                onResetTimer={handleResetTimer}
                onEnterBlackout={() => setBlackoutMode(true)}
                blackoutActive={false}
              />

              {/* Preset Time Selections */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap relative z-10">
                <span className="text-[10px] text-slate-500 font-mono uppercase vietnam-text">
                  Vạch Giờ:
                </span>
                <div className="flex items-center gap-1">
                  {[5, 15, 25, 45].map((m) => {
                    const isCurrent = timerDuration === m * 60;
                    return (
                      <button
                        key={m}
                        onClick={() => handleSetPresetDuration(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                            : "bg-slate-950 border-slate-850 hover:bg-slate-950/60 text-slate-400"
                        }`}
                      >
                        {m}m
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* EEG Simulator Right Column (Grid span 6) */}
            <div style={{ height: "679px" }} className="lg:col-span-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-5 h-5 text-teal-400" />
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-display vietnam-text">
                    Giả Lập Sóng Não (EEG Simulator)
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed vietnam-text">
                  Hệ thống tự động theo dõi tần số não trong thời gian thực. Bạn có thể tự mình chuyển đổi chế độ để mô phỏng trạng thái bị xao nhãng nhằm thử nghiệm chức năng **Distraction Recovery Interceptor** sau 5 giây.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <button
                    onClick={() => {
                      setSimulationMode("auto");
                      addToast("Giả lập: Tự động dao động sóng", "info");
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      simulationMode === "auto"
                        ? "bg-teal-500/15 border-teal-500/40 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.05)]"
                        : "bg-slate-950/80 border-slate-850 hover:bg-slate-900 text-slate-400"
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-wider text-teal-500 uppercase block mb-1">AUTO RUNNING</span>
                    <span className="text-sm font-semibold vietnam-text">Sóng Não Biến Thiên Tự Nhiên</span>
                  </button>

                  <button
                    id="simulate-distracted-button"
                    onClick={() => {
                      setSimulationMode("distracted");
                      addToast("Giả lập: Mất tập trung sâu", "error");
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      simulationMode === "distracted"
                        ? "bg-red-500/15 border-red-500/40 text-red-300 animate-pulse"
                        : "bg-slate-950/80 border-slate-850 hover:bg-slate-900 text-slate-400"
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-wider text-red-400 uppercase block mb-1">DISTRACTED STATE</span>
                    <span className="text-sm font-semibold vietnam-text">Nghiệm Tập Trung Giảm Sâu (Kích hoạt phục hồi)</span>
                  </button>

                  <button
                    onClick={() => {
                      setSimulationMode("highly-focused");
                      addToast("Giả lập: Trạng thái siêu tập trung", "success");
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      simulationMode === "highly-focused"
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                        : "bg-slate-950/80 border-slate-850 hover:bg-slate-900 text-slate-400"
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase block mb-1">ZEN STATE</span>
                    <span className="text-sm font-semibold vietnam-text">Chế Độ Siêu Định Tâm</span>
                  </button>
                </div>
              </div>

              {/* Dynamic stats feedback table */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-400">
                  <div className="flex flex-col">
                    <span className="text-slate-600 text-[10px]">ALPHA (Thư thái)</span>
                    <span className="text-slate-300 text-sm font-semibold mt-1">{eeg.alpha.toFixed(1)} Hz</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-600 text-[10px]">BETA (Tập trung)</span>
                    <span className="text-slate-300 text-sm font-semibold mt-1">{eeg.beta.toFixed(1)} Hz</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-600 text-[10px]">THETA (Mơ màng)</span>
                    <span className="text-slate-300 text-sm font-semibold mt-1">{eeg.theta.toFixed(1)} Hz</span>
                  </div>
                  <div className="flex flex-col border-l border-slate-850 pl-3">
                    <span className="text-indigo-400 text-[10px]">ĐỘ TIÊU ĐIỂM</span>
                    <span className={`text-sm font-bold mt-1 ${eeg.focusIndex >= 0.7 ? "text-emerald-400" : eeg.focusIndex >= 0.4 ? "text-orange-400" : "text-red-400"}`}>
                      {eeg.focusIndex.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Display timer for EEG modal trigger */}
                {timerActive && eeg.focusIndex < 0.40 && (
                  <div className="text-xs bg-red-950/40 border border-red-500/35 p-3.5 rounded-xl text-red-350 flex items-center justify-between animate-pulse">
                    <span className="vietnam-text">Dò xao nhãng liên tục: lớp bảo vệ kích sau:</span>
                    <span className="font-mono text-sm font-bold bg-slate-950 px-2 py-0.5 rounded border border-red-900/60">{consecutiveDistractedSeconds}/5s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Task Shredder */}
        {activeTab === "shredder" && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <TaskShredder onAwardPoints={handleAwardPoints} />
          </div>
        )}

        {/* Tab 3: Rewards & Mind Forest */}
        {activeTab === "rewards" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            <MindForest cumulativePoints={gameState.cumulativePoints} />
            <RewardShop
              spendablePoints={gameState.spendablePoints}
              themeSkin={gameState.themeSkin}
              lofiUnlocked={gameState.lofiUnlocked}
              lofiPlaying={gameState.lofiPlaying}
              onPurchaseNebula={handlePurchaseNebula}
              onPurchaseLofi={handlePurchaseLofi}
              onToggleLofi={handleToggleLofi}
            />
          </div>
        )}

      </main>

      <footer className="mt-16 border-t border-slate-900 bg-slate-950/20 py-8 relative z-10 text-center text-xs text-slate-500">
        <p className="vietnam-text">
          La Bàn Tập Trung — Thiết kế tối giản, thân thiện với người ADHD, tăng vọt nguồn động lực khởi động & chữa lành.
        </p>
        <p className="mt-1">
          &copy; 2026 Google AI Studio ADHD Project. No telemetry. Fully client-contained.
        </p>
      </footer>
    </div>
  );
}
