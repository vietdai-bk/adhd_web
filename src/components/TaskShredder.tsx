/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Scissors, CheckSquare, Square, Trash2, Zap, Hourglass } from "lucide-react";
import { ShreddedTask, MicroStep } from "../types";

interface TaskShredderProps {
  onAwardPoints: (points: number, reason: string) => void;
}

export function TaskShredder({ onAwardPoints }: TaskShredderProps) {
  const [inputText, setInputText] = useState("");
  const [activeTask, setActiveTask] = useState<ShreddedTask | null>(null);
  const [isShredding, setIsShredding] = useState(false);

  // Focus preset generators for common ADHD tasks
  const generateStepsForTask = (text: string): MicroStep[] => {
    const lowercase = text.toLowerCase();
    
    if (lowercase.includes("học") || lowercase.includes("đọc") || lowercase.includes("read") || lowercase.includes("study")) {
      return [
        { id: "1", text: "Tắt tab gây xao nhãng & lật úp điện thoại (1 phút)", completed: false },
        { id: "2", text: "Đọc đúng 2 trang sách hoặc 1 chương ngắn trước (5 phút)", completed: false },
        { id: "3", text: "Ghi chú nhanh 3 ý chính ra giấy nháp (3 phút)", completed: false },
      ];
    }
    
    if (lowercase.includes("code") || lowercase.includes("lập trình") || lowercase.includes("viết") || lowercase.includes("write")) {
      return [
        { id: "1", text: "Mở trình soạn thảo & viết duy nhất 1 câu khởi đầu hoặc 1 hàm trống (2 phút)", completed: false },
        { id: "2", text: "Lên dàn bài nháp/chức năng chính gồm 3 gạch đầu dòng (3 phút)", completed: false },
        { id: "3", text: "Bật chế độ tập trung và gõ không dừng lại sửa lỗi trong 10 phút", completed: false },
      ];
    }

    if (lowercase.includes("dọn") || lowercase.includes("rửa") || lowercase.includes("nhà") || lowercase.includes("clean")) {
      return [
        { id: "1", text: "Hẹn giờ đúng 5 phút và gom gọn rác vào duy nhất một góc (2 phút)", completed: false },
        { id: "2", text: "Dọn dẹp bề mặt phẳng dễ thấy nhất (bàn làm việc hoặc bồn rửa) (3 phút)", completed: false },
        { id: "3", text: "Cất 5 món đồ về đúng vị trí của chúng (2 phút)", completed: false },
      ];
    }

    // Default template tailored for starting friction
    return [
      { id: "1", text: "Bước chuẩn bị: Chỉ chuẩn bị tài liệu liên quan & hít thở sâu 1 nhịp (1 phút)", completed: false },
      { id: "2", text: "Khởi động cực nhỏ: Làm phần dễ nhất trong đúng 3 phút (3 phút)", completed: false },
      { id: "3", text: "Đà quán tính: Làm tiếp tục không bận tâm đến chất lượng trong 5 phút (5 phút)", completed: false },
    ];
  };

  const handleShred = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsShredding(true);

    // Simulate mechanical slicing delay for psychological sensory satisfaction
    setTimeout(() => {
      const parentTask: ShreddedTask = {
        id: Date.now().toString(),
        originalText: inputText,
        steps: generateStepsForTask(inputText),
        timestamp: Date.now(),
      };

      setActiveTask(parentTask);
      setInputText("");
      setIsShredding(false);
      onAwardPoints(5, "Nghiền nhỏ công việc đã giải tỏa áp lực khởi động!");
    }, 850);
  };

  const toggleStep = (stepId: string) => {
    if (!activeTask) return;

    const updatedSteps = activeTask.steps.map((step) => {
      if (step.id === stepId) {
        const nextState = !step.completed;
        if (nextState) {
          // Award points for completing a micro-task (highly motivating!)
          onAwardPoints(10, `Hoàn thành bước nhỏ: ${step.text.split("(")[0]}`);
        }
        return { ...step, completed: nextState };
      }
      return step;
    });

    // Check if everything is completed
    const allCompleted = updatedSteps.every((s) => s.completed);
    
    setActiveTask({
      ...activeTask,
      steps: updatedSteps,
    });

    if (allCompleted) {
      setTimeout(() => {
        onAwardPoints(15, "Hoàn thành toàn bộ các bước nghiền nhỏ! Đỉnh cao tập trung!");
      }, 500);
    }
  };

  const deleteActiveTask = () => {
    setActiveTask(null);
  };

  return (
    <div id="task-shredder-section" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Scissors className="w-5 h-5" />
        </span>
        <h2 className="text-xl Vietnam-text font-display font-medium text-slate-100">
          Máy Nghiền Công Việc (Task Shredder)
        </h2>
      </div>

      <p className="text-xs text-slate-400 mb-5 vietnam-text">
        ADHD thường sợ khối lượng lớn. Hãy nhập mục tiêu của bạn, chiếc máy này sẽ "nghiền" nó thành 3 hành động dễ thực hiện dưới 5 phút để kích hoạt động lực khởi động!
      </p>

      {!activeTask ? (
        <form onSubmit={handleShred} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Bạn đang thấy choáng ngợp bởi việc gì? (Ví dụ: Học thi học kỳ, Dọn phòng...)"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all Vietnamese"
              disabled={isShredding}
              maxLength={120}
            />
            <span className="absolute right-3 top-3 text-[10px] text-slate-600 font-mono">
              {inputText.length}/120
            </span>
          </div>

          <button
            type="submit"
            disabled={isShredding || !inputText.trim()}
            className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              isShredding || !inputText.trim()
                ? "bg-slate-800/40 text-slate-500 border border-slate-900 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-indigo-50 shadow-lg shadow-indigo-900/20 active:translate-y-px border border-indigo-500/30 cursor-pointer"
            }`}
          >
            {isShredding ? (
              <>
                <Hourglass className="w-4 h-4 animate-spin text-indigo-300" />
                <span className="vietnam-text">Đang cắt vụn áp lực...</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4 text-indigo-200" />
                <span className="vietnam-text">Nghiền Nhỏ Ngay! (+5 XP)</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-slate-950/70 border border-indigo-950/50 rounded-xl p-5 relative overflow-hidden transition-all animate-fade-in">
          {/* Subtle lightning laser line indicator */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />

          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase block mb-1">
                Nhiệm Vụ Đang Nghiền
              </span>
              <h3 className="text-base font-medium text-slate-100 vietnam-text line-through decoration-slate-700/60 decoration-2 italic opacity-90">
                {activeTask.originalText}
              </h3>
            </div>
            <button
              onClick={deleteActiveTask}
              title="Xóa để nhập việc khác"
              className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {activeTask.steps.map((step, idx) => (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                  step.completed
                    ? "bg-emerald-950/10 border-emerald-900/30 text-slate-400"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-750 hover:bg-slate-900/70"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {step.completed ? (
                    <span className="text-emerald-400">
                      <CheckSquare className="w-4.5 h-4.5" />
                    </span>
                  ) : (
                    <span className="text-slate-600 hover:text-indigo-400">
                      <Square className="w-4.5 h-4.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[9px] px-1 bg-slate-950 text-slate-400 rounded border border-slate-800">
                      Bước {idx + 1}
                    </span>
                    {step.completed && (
                      <span className="text-[8px] uppercase bg-emerald-500/10 text-emerald-400 font-mono px-1 rounded">
                        Đã hoàn thành (+10 XP)
                      </span>
                    )}
                  </div>
                  <p className={`vietnam-text ${step.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {activeTask.steps.every((s) => s.completed) && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center text-xs text-emerald-400 font-medium flex items-center justify-center gap-2 animate-pulse vietnam-text">
              <Zap className="w-4 h-4" />
              Bạn đã hoàn thành các bước cực khởi đầu này xuất sắc! Hãy bắt đầu làm việc chính nhé!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
