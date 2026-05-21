/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AlertTriangle, Sparkles, BrainCircuit, RefreshCw, EyeOff, CheckCircle2 } from "lucide-react";
import { MicroTask } from "../types";

interface DistractionModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

// Full array of mock micro-tasks
const MICRO_TASKS_POOL: MicroTask[] = [
  {
    type: "math",
    prompt: "Hệ thống tự động kích hoạt chế độ khôi phục! Hãy giải đố nhanh sau: 3X + 5 = 14. Vậy X bằng mấy?",
    options: ["X = 2", "X = 3", "X = 4"],
    answerIndex: 1, // X = 3 is index 1
  },
  {
    type: "trivia",
    prompt: "Câu đố vui đánh thức hoóc-môn tập trung: Con vật nào sau đây ngủ nhiều nhất trên thế giới (lên tới 22 tiếng mỗi ngày)?",
    options: ["Chú Mèo", "Con Koala (Gấu túi)", "Chú Chó"],
    answerIndex: 1, // Koala is index 1
  },
  {
    type: "physical",
    prompt: "Cơ thể căng cứng làm ứ đọng lưu lượng máu lên não. Hãy hít thật sâu bằng mũi 3 nhịp, từ từ thở ra bằng miệng và vươn vai căng lồng ngực.",
    completionLabel: "Tôi Đã Hoàn Thành Hoàn Hảo!",
  },
];

export function DistractionModal({ isOpen, onComplete, onSkip }: DistractionModalProps) {
  const [selectedTask, setSelectedTask] = useState<MicroTask | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean | null>(null);

  // Initialize a random task when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * MICRO_TASKS_POOL.length);
      setSelectedTask(MICRO_TASKS_POOL[randomIndex]);
      setSelectedOption(null);
      setIsAnsweredCorrectly(null);
    }
  }, [isOpen]);

  if (!isOpen || !selectedTask) return null;

  const handleOptionClick = (idx: number) => {
    setSelectedOption(idx);
    const isCorrect = idx === selectedTask.answerIndex;
    setIsAnsweredCorrectly(isCorrect);

    if (isCorrect) {
      // Small pause for visual feedback before auto-completing
      setTimeout(() => {
        onComplete();
      }, 950);
    }
  };

  const handlePhysicalComplete = () => {
    setIsAnsweredCorrectly(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-slate-950/80 transition-all duration-500 animate-fade-in">
      <div className="absolute inset-0 bg-red-950/5 pointer-events-none" />
      
      {/* Outer Glow Wrapper */}
      <div className="w-full max-w-lg bg-slate-900 border-2 border-red-900/60 rounded-3xl p-6 md:p-8 shadow-2xl shadow-red-950/40 relative overflow-hidden">
        {/* Decorative corner indicator */}
        <div className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-red-500 via-orange-500 to-transparent" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center">
          {/* Pulsating Alert Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="text-[10px] text-red-400 font-mono tracking-[0.2em] uppercase mb-1">
            CẢNH BÁO MẤT TẬP TRUNG
          </span>
          <h2 className="text-xl md:text-2xl font-display font-bold text-slate-100 vietnam-text leading-snug">
            ⚠️ Nhịp độ giảm sút! Hãy lấy lại sự tập trung.
          </h2>
          
          <p className="text-xs text-slate-400 mt-2 max-w-md vietnam-text">
            Chỉ số tập trung EEG của bạn đã giảm dưới mức an toàn (0.40) trong khoảng thời gian vừa qua. Hãy kích hoạt lại nơ-ron bằng hoạt động reset nhanh này!
          </p>
        </div>

        {/* Micro-task Core Display Card */}
        <div className="my-6 p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 text-left relative">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 uppercase font-display tracking-wider vietnam-text">
              {selectedTask.type === "math" && "Thách Thức logic"}
              {selectedTask.type === "trivia" && "Kích Hoạt Kiến Thức"}
              {selectedTask.type === "physical" && "Thiền Định Thể Chất"}
            </span>
          </div>

          <p className="text-sm text-slate-200 font-sans leading-relaxed mb-4 vietnam-text">
            {selectedTask.prompt}
          </p>

          {/* Render Action Choices */}
          {selectedTask.type === "physical" ? (
            <button
              onClick={handlePhysicalComplete}
              className={`w-full py-4.5 px-4 rounded-xl font-bold font-display text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isAnsweredCorrectly
                  ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/30"
                  : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-50 border-emerald-500/30 shadow-lg shadow-emerald-900/25 active:scale-[0.99]"
              }`}
            >
              {isAnsweredCorrectly ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-bounce" />
                  <span className="vietnam-text">Hồi Phục Động Lực Thành Công...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-emerald-100 animate-spin" />
                  <span className="vietnam-text">{selectedTask.completionLabel}</span>
                </>
              )}
            </button>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {selectedTask.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === selectedTask.answerIndex;
                let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700";

                if (selectedOption !== null) {
                  if (isSelected) {
                    btnStyle = isCorrectOption
                      ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                      : "bg-red-950/50 border-red-500/50 text-red-300";
                  } else if (isCorrectOption) {
                    btnStyle = "bg-emerald-950/30 border-emerald-800/50 text-emerald-400";
                  } else {
                    btnStyle = "opacity-40 bg-slate-950 border-slate-900 text-slate-600";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => selectedOption === null && handleOptionClick(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full p-3.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${btnStyle} cursor-pointer`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isSelected && (
                      <span className="text-[10px] font-mono tracking-widest uppercase">
                        {isCorrectOption ? "Chính xác!" : "Sai rồi"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-3 text-xs bg-slate-950 border border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all rounded-xl cursor-pointer"
          >
            Bỏ qua (Tiếp tục mất tập trung)
          </button>
          
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-3 rounded-xl flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Thành công: +10 Xu & XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
