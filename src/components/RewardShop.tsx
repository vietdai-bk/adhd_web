/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins, Check, Sparkles, Volume2, VolumeX, Music, Moon } from "lucide-react";
import { ThemeSkin } from "../types";

interface RewardShopProps {
  spendablePoints: number;
  themeSkin: ThemeSkin;
  lofiUnlocked: boolean;
  lofiPlaying: boolean;
  onPurchaseNebula: () => void;
  onPurchaseLofi: () => void;
  onToggleLofi: () => void;
}

export function RewardShop({
  spendablePoints,
  themeSkin,
  lofiUnlocked,
  lofiPlaying,
  onPurchaseNebula,
  onPurchaseLofi,
  onToggleLofi,
}: RewardShopProps) {
  return (
    <div id="reward-shop-section" style={{ height: "493.344px" }} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Coins className="w-5 h-5" />
          </span>
          <h2 className="text-xl vietnam-text font-display font-medium text-slate-100">
            Cửa Hàng Đổi Thưởng
          </h2>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-400">
          <Coins className="w-4 h-4 animate-pulse" />
          <span className="font-mono text-sm font-bold tracking-tight">
            {spendablePoints}
          </span>
          <span className="text-[10px] text-amber-500/70 uppercase font-mono tracking-wider">Xu</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6 vietnam-text">
        Dành tặng bản thân phần thưởng bằng số "Xu thăng hoa" kiếm được khi nỗ lực tập trung. Chữa lành và tùy biến không gian làm việc.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Item 1: Nebula Theme */}
        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Moon className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                Giao diện lấp lánh
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 vietnam-text">
              Giao Diện Tinh Vân (Nebula Space)
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed vietnam-text">
              Chuyển đổi toàn nền không gian làm việc sang màu sắc tím thẫm mộng mơ tinh vân mang đầy cảm hứng sáng tạo.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm font-mono text-slate-400">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>50 Xu</span>
            </div>

            {themeSkin === "nebula" ? (
              <span className="text-xs text-purple-400 font-medium font-mono flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl">
                <Check className="w-3.5 h-3.5" />
                <span>Đang dùng</span>
              </span>
            ) : (
              <button
                onClick={onPurchaseNebula}
                className="text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all bg-purple-600 hover:bg-purple-500 text-purple-50 hover:shadow-lg hover:shadow-purple-900/15 border border-purple-500/30 active:scale-[0.98] cursor-pointer"
              >
                Đổi Ngay (50)
              </button>
            )}
          </div>
        </div>

        {/* Item 2: Lofi Music Generator */}
        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <Music className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono uppercase bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20">
                Sóng não sóng vỗ
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 vietnam-text">
              Nhạc Lofi Xoa Dịu Sóng Não
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed vietnam-text">
              Hệ thống tổng hợp sóng não binaural đồng hành cùng lofi màng rác để tiêu giảm tạp âm bên ngoài, tạo kén an toàn.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm font-mono text-slate-400">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>30 Xu</span>
            </div>

            {lofiUnlocked ? (
              <button
                onClick={onToggleLofi}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1 cursor-pointer border ${
                  lofiPlaying
                    ? "bg-emerald-550/20 hover:bg-emerald-555/30 text-emerald-400 border-emerald-500/30 animate-pulse"
                    : "bg-pink-650/40 hover:bg-pink-500/20 text-pink-300 border-pink-500/20"
                }`}
              >
                {lofiPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>Đang tắt nhạc</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-pink-400" />
                    <span>Bật Nhạc Lofi</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onPurchaseLofi}
                className="text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all bg-pink-600 hover:bg-pink-500 text-pink-50 hover:shadow-lg hover:shadow-pink-900/15 border border-pink-500/30 active:scale-[0.98] cursor-pointer"
              >
                Mở Khóa (30)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
