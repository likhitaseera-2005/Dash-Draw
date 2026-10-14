/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Grid } from 'lucide-react';
import { LevelConfig } from '../game/types.ts';
import { soundManager } from '../game/audio.ts';

interface GameOverModalProps {
  level: LevelConfig;
  onRetry: () => void;
  onOpenLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  level,
  onRetry,
  onOpenLevelSelect,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-rose-950/50">
          💥
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
            Wiped Out!
          </span>
          <h2 className="text-2xl font-black text-white">
            Trip & Tumble!
          </h2>
          <p className="text-xs text-slate-400">
            Fell into hazard or bottomless abyss in {level.subtitle}.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
          💡 <span className="font-semibold text-emerald-400">Pro tip:</span> Switch to Draw Mode first to inspect the chasm and draw a safety bridge before running!
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onRetry();
            }}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
          >
            <RotateCcw size={17} />
            <span>QUICK RETRY [R]</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLevelSelect();
            }}
            className="w-full py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Grid size={15} />
            <span>Select Different Level</span>
          </button>
        </div>
      </div>
    </div>
  );
};
