/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Grid, HelpCircle, Volume2, VolumeX, Music, Award, Sparkles, Compass } from 'lucide-react';
import { LevelRecord } from '../game/types.ts';
import { soundManager } from '../game/audio.ts';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenHowToPlay: () => void;
  onOpenSandbox: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  records: Record<number, LevelRecord>;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenHowToPlay,
  onOpenSandbox,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  records,
}) => {
  // Aggregate stats
  const totalStars = Object.values(records).reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalGems = Object.values(records).reduce((sum, r) => sum + (r.gemsCollected || 0), 0);
  const levelsCleared = Object.values(records).filter((r) => r.completed).length;

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* Decorative Parallax Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-indigo-950 to-slate-950 opacity-90" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-emerald-500/30">
            ✏️
          </div>
          <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
            DASH & DRAW
          </span>
        </div>

        {/* Audio Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className={`p-2.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMusic();
            }}
            className={`p-2.5 rounded-lg border transition-colors ${
              musicEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={musicEnabled ? 'Mute Music' : 'Enable Music'}
          >
            <Music size={18} />
          </button>
        </div>
      </header>

      {/* Main Hero & Actions */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
        {/* Left: Branding & Action CTAs */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
            <Sparkles size={13} />
            <span>2D Physics Drawing Platformer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
            <span className="block text-white drop-shadow-md">Dash & Draw</span>
            <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              The Ultimate Run
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed">
            Sketch bridges over lethal chasms, angle launch ramps over spike traps, and draw turbo tracks to guide Dashy across dangerous terrain to victory!
          </p>

          {/* Player Progress Stats */}
          <div className="flex items-center gap-6 py-2 px-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-sm">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              <div>
                <span className="text-xs text-slate-400 block">Stars</span>
                <span className="font-bold text-slate-100 tabular-nums">{totalStars} / 15</span>
              </div>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-base">💎</span>
              <div>
                <span className="text-xs text-slate-400 block">Gems</span>
                <span className="font-bold text-slate-100 tabular-nums">{totalGems}</span>
              </div>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-base">🏁</span>
              <div>
                <span className="text-xs text-slate-400 block">Cleared</span>
                <span className="font-bold text-slate-100 tabular-nums">{levelsCleared} / 5</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onStartGame();
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Play size={20} className="fill-slate-950" />
              <span>START RUN</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLevelSelect();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Grid size={18} />
              <span>LEVEL SELECT</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenHowToPlay();
              }}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle size={15} />
              <span>How to Play</span>
            </button>
            <span>·</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSandbox();
              }}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Compass size={15} />
              <span>Free Draw Sandbox</span>
            </button>
          </div>
        </div>

        {/* Right: Featured Art Banner Showcase */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            {/* Real generated game artwork */}
            <img
              src="/src/assets/images/dash_draw_hero_cover_1791957177573.jpg"
              alt="Dash & Draw hero running across a drawn neon bridge over a spike chasm"
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover object-center transform group-hover:scale-102 transition-transform duration-500"
              onError={(e) => {
                // Fallback container in accordance with Zero-Broken-Image Policy
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* In-banner quick highlight */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Sketch bridges in real-time</span>
                <span className="text-slate-400">5 Handcrafted Stages + Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-xs text-slate-500 border-t border-slate-900">
        Dash & Draw: The Ultimate Run · Desktop mouse & touch supported
      </footer>
    </div>
  );
};
