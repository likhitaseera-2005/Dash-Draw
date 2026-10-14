/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, RotateCcw, ArrowRight, Grid, Award } from 'lucide-react';
import { LevelConfig } from '../game/types.ts';
import { soundManager } from '../game/audio.ts';

interface LevelCompleteModalProps {
  level: LevelConfig;
  completionTime: number;
  gemsCollected: number;
  totalGems: number;
  inkRemaining: number;
  maxInk: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  completionTime,
  gemsCollected,
  totalGems,
  inkRemaining,
  maxInk,
  hasNextLevel,
  onNextLevel,
  onReplayLevel,
  onOpenLevelSelect,
}) => {
  // Score calculations
  const basePoints = 1000;
  const gemPoints = gemsCollected * 150;
  const timeBonus = Math.max(0, Math.round((level.targetTimeSeconds - completionTime) * 35));
  const inkBonus = Math.round((inkRemaining / maxInk) * 400);
  const totalScore = basePoints + gemPoints + timeBonus + inkBonus;

  // Star rating
  let stars = 1;
  if (gemsCollected === totalGems) stars = 3;
  else if (gemsCollected >= Math.ceil(totalGems * 0.6)) stars = 2;

  const seconds = completionTime.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Banner Heading */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Course Clear!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {level.name}
          </h2>
        </div>

        {/* Stars Presentation */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition-all duration-300 ${
                starIdx <= stars ? 'scale-110 text-amber-400' : 'text-slate-700 scale-95'
              }`}
            >
              <Star
                size={42}
                className={starIdx <= stars ? 'fill-amber-400 drop-shadow-lg' : ''}
              />
            </div>
          ))}
        </div>

        {/* Score Breakdown Table */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 text-left">
          <div className="flex justify-between items-center text-slate-400">
            <span>Clear Bonus</span>
            <span className="font-mono font-bold text-slate-200 tabular-nums">+{basePoints}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="flex items-center gap-1.5">
              <span>💎 Gems ({gemsCollected}/{totalGems})</span>
            </span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">+{gemPoints}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>⚡ Clear Time ({seconds}s)</span>
            <span className="font-mono font-bold text-cyan-300 tabular-nums">+{timeBonus}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>🎨 Ink Efficiency</span>
            <span className="font-mono font-bold text-emerald-300 tabular-nums">+{inkBonus}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Award size={16} className="text-amber-400" />
              <span>Total Score</span>
            </span>
            <span className="font-mono text-base text-amber-400 tabular-nums">{totalScore}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {hasNextLevel ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>NEXT LEVEL</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLevelSelect();
              }}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ALL LEVELS CLEARED!</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                onReplayLevel();
              }}
              className="flex-1 sm:flex-initial p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Replay Level"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLevelSelect();
              }}
              className="flex-1 sm:flex-initial p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Level Select"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
