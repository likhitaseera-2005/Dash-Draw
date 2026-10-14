/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../game/audio.ts';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuitToMenu: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuitToMenu,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Game Paused
          </span>
          <h2 className="text-2xl font-black text-white">
            Take a Breather
          </h2>
        </div>

        {/* Audio Toggles */}
        <div className="flex items-center justify-center gap-3 py-1">
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>SFX: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMusic();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              musicEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Music size={16} />
            <span>BGM: {musicEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <Play size={18} className="fill-slate-950" />
            <span>RESUME [Space]</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Restart Level [R]</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onQuitToMenu();
            }}
            className="w-full py-2.5 px-6 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home size={16} />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
