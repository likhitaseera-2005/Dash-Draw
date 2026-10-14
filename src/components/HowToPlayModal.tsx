/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, ArrowUpCircle, Zap, MousePointer, Smartphone, Keyboard } from 'lucide-react';
import { soundManager } from '../game/audio.ts';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Guide & Mechanics
            </span>
            <h2 className="text-2xl font-black text-white">How to Play</h2>
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

        {/* Core Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles size={16} />
              <span>1. Solid Bridge Line</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard green neon ink. Forms sturdy platforms and bridges over pits, or smooth ramps to scale high ledges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ArrowUpCircle size={16} />
              <span>2. Bouncy Spring Line</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Amber trampoline line. Step onto it to fling Dashy high into the sky, leaping over massive walls or snatching airborne gems!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Zap size={16} />
              <span>3. Turbo Speed Line</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cyan rocket track. Supercharges Dashy with sudden forward acceleration, clearing wide gaps with high momentum.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span>🎨 Strategic Ink Meter</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Drawing uses ink! Keep an eye on your vial in the top bar. You can Undo (Z) or Clear (C) strokes to reclaim full ink capacity.
            </p>
          </div>
        </div>

        {/* Controls Guide */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Keyboard size={16} className="text-emerald-400" />
            <span>Controls & Shortcuts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <MousePointer size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Left Click & Drag</span>
                <span className="text-slate-400 text-[11px]">Draw ink path anywhere</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <Smartphone size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Touch & Drag</span>
                <span className="text-slate-400 text-[11px]">Draw directly with fingers</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Space</span>
              <span className="text-slate-300">Toggle Draw / Dash Mode</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">R</span>
              <span className="text-slate-300">Instant Restart Level</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Z</span>
              <span className="text-slate-300">Undo Last Drawn Line</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">C</span>
              <span className="text-slate-300">Clear All Lines</span>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
