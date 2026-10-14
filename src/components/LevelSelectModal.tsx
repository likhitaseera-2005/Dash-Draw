/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Star, Lock, Play, Compass } from 'lucide-react';
import { LevelConfig, LevelRecord } from '../game/types.ts';
import { LEVELS } from '../game/levels.ts';
import { soundManager } from '../game/audio.ts';

interface LevelSelectModalProps {
  records: Record<number, LevelRecord>;
  currentLevelId: number;
  onSelectLevel: (level: LevelConfig) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  records,
  currentLevelId,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Stages
            </span>
            <h2 className="text-2xl font-black text-white">Select Course</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {LEVELS.map((level) => {
            const isSandbox = level.theme === 'sandbox';
            const rec = records[level.id];
            // Level 1 is always unlocked; others unlocked if completed previous level or if unlocked in records
            const isUnlocked = isSandbox || level.id === 1 || rec?.unlocked || records[level.id - 1]?.completed;
            const isSelected = level.id === currentLevelId;
            const stars = rec?.stars || 0;
            const bestTime = rec?.bestTime ? `${rec.bestTime.toFixed(1)}s` : '--';

            return (
              <button
                key={level.id}
                disabled={!isUnlocked}
                onClick={() => {
                  soundManager.playClick();
                  onSelectLevel(level);
                }}
                className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    : 'bg-slate-950/40 border-slate-900/60 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                      {isSandbox ? 'Creative Mode' : `Stage ${level.id}`}
                    </span>
                    {isUnlocked ? (
                      !isSandbox && (
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={s <= stars ? 'fill-amber-400' : 'text-slate-700'}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <Lock size={15} className="text-slate-500" />
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">
                    {level.subtitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {level.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60 mt-3">
                  {isSandbox ? (
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                      <Compass size={14} />
                      <span>Unlimited Ink</span>
                    </span>
                  ) : (
                    <>
                      <span>Best: <strong className="text-slate-200 tabular-nums">{bestTime}</strong></span>
                      <span>Gems: <strong className="text-amber-300 tabular-nums">{rec?.gemsCollected || 0}/{level.gems.length}</strong></span>
                    </>
                  )}
                  {isUnlocked && (
                    <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Play size={13} className="fill-emerald-400" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
