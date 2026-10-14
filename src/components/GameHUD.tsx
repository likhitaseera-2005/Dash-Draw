/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, RotateCcw, Undo2, Trash2, Home, Volume2, VolumeX, Sparkles, Zap, ArrowUpCircle } from 'lucide-react';
import { StrokeType, PlayMode, LevelConfig } from '../game/types.ts';
import { soundManager } from '../game/audio.ts';

interface GameHUDProps {
  level: LevelConfig;
  playMode: PlayMode;
  onTogglePlayMode: () => void;
  inkRemaining: number;
  maxInk: number;
  gemsCollected: number;
  totalGems: number;
  elapsedTime: number;
  progressPercent: number;
  currentStrokeType: StrokeType;
  onChangeStrokeType: (type: StrokeType) => void;
  onUndoStroke: () => void;
  onClearStrokes: () => void;
  onRestartLevel: () => void;
  onOpenPause: () => void;
  strokeCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  level,
  playMode,
  onTogglePlayMode,
  inkRemaining,
  maxInk,
  gemsCollected,
  totalGems,
  elapsedTime,
  progressPercent,
  currentStrokeType,
  onChangeStrokeType,
  onUndoStroke,
  onClearStrokes,
  onRestartLevel,
  onOpenPause,
  strokeCount,
  soundEnabled,
  onToggleSound,
}) => {
  const inkPercent = Math.max(0, Math.min(100, Math.round((inkRemaining / maxInk) * 100)));
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = (elapsedTime % 60).toFixed(1).padStart(4, '0');

  // Ink color based on depletion
  let inkColor = 'bg-emerald-500';
  let inkBorder = 'border-emerald-400';
  if (inkPercent < 25) {
    inkColor = 'bg-rose-500 animate-pulse';
    inkBorder = 'border-rose-400';
  } else if (inkPercent < 50) {
    inkColor = 'bg-amber-500';
    inkBorder = 'border-amber-400';
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans">
      {/* Top Header Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-xl pointer-events-auto">
        {/* Left: Level Info & Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenPause();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Pause Menu [Esc]"
          >
            <Home size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                {level.name}
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">· {level.subtitle}</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">
              {playMode === 'DRAW_PREP' ? '✏️ Draw Mode (Prepare path)' : '⚡ Run Mode (Dashing!)'}
            </span>
          </div>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="flex-1 max-w-xs w-full flex items-center gap-2 px-2">
          <span className="text-xs font-bold text-slate-400">0%</span>
          <div className="relative flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-400">🏁</span>
        </div>

        {/* Right: Gems, Time & Ink Meter */}
        <div className="flex items-center gap-4">
          {/* Gems Counter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <span className="text-sm">💎</span>
            <span className="text-xs font-bold text-amber-300 tabular-nums">
              {gemsCollected}/{totalGems}
            </span>
          </div>

          {/* Time Counter */}
          <div className="text-xs font-mono font-bold text-slate-200 tabular-nums bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            {minutes}:{seconds}
          </div>

          {/* Ink Tube Meter */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
            <span className="text-xs font-semibold text-slate-300">Ink</span>
            <div className={`w-20 sm:w-28 h-3.5 bg-slate-950 rounded-full overflow-hidden border ${inkBorder} p-0.5`}>
              <div
                className={`h-full rounded-full transition-all duration-100 ${inkColor}`}
                style={{ width: `${inkPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-200 tabular-nums">
              {inkPercent}%
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="w-full max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl px-4 py-3 shadow-2xl pointer-events-auto">
        {/* Pencil Type Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundManager.playClick();
              onChangeStrokeType('solid');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentStrokeType === 'solid'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>Bridge</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onChangeStrokeType('bounce');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentStrokeType === 'bounce'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpCircle size={14} />
            <span>Bounce</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onChangeStrokeType('speed');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentStrokeType === 'speed'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={14} />
            <span>Turbo</span>
          </button>
        </div>

        {/* Undo / Clear Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundManager.playUndo();
              onUndoStroke();
            }}
            disabled={strokeCount === 0}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              strokeCount > 0
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Undo Last Stroke [Z]"
          >
            <Undo2 size={14} />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            onClick={() => {
              soundManager.playUndo();
              onClearStrokes();
            }}
            disabled={strokeCount === 0}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              strokeCount > 0
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Clear All Strokes [C]"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestartLevel();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            title="Restart Level [R]"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Retry</span>
          </button>
        </div>

        {/* Primary Run / Pause Big Action Button */}
        <div>
          <button
            onClick={() => {
              soundManager.playClick();
              onTogglePlayMode();
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 ${
              playMode === 'DRAW_PREP'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/30'
            }`}
          >
            {playMode === 'DRAW_PREP' ? (
              <>
                <Play size={18} className="fill-slate-950" />
                <span>DASH! [Space]</span>
              </>
            ) : (
              <>
                <Pause size={18} />
                <span>PAUSE [Space]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
