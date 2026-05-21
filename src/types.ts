/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MicroStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface ShreddedTask {
  id: string;
  originalText: string;
  steps: MicroStep[];
  timestamp: number;
}

export interface EEGData {
  alpha: number;
  beta: number;
  theta: number;
  focusIndex: number;
}

export type ThemeSkin = "cosmic" | "nebula";

export interface GameState {
  cumulativePoints: number;
  spendablePoints: number;
  themeSkin: ThemeSkin;
  lofiUnlocked: boolean;
  lofiPlaying: boolean;
}

export type MicroTaskType = "math" | "trivia" | "physical";

export interface MicroTask {
  type: MicroTaskType;
  prompt: string;
  options?: string[];
  answerIndex?: number; // Index of correct option (for math/trivia)
  completionLabel?: string; // For physical breathing tasks
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
