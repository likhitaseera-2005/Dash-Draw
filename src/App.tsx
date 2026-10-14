/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  LevelConfig,
  LevelRecord,
  DrawnStroke,
  CharacterState,
  Point,
  StrokeType,
  PlayMode,
  GameScreen,
} from './game/types.ts';
import { LEVELS } from './game/levels.ts';
import { soundManager } from './game/audio.ts';
import { ParticleSystem } from './game/particles.ts';
import { updatePhysics, calculateStrokeLength, dist } from './game/physics.ts';
import { GameRenderer } from './game/renderer.ts';
import { MainMenu } from './components/MainMenu.tsx';
import { GameHUD } from './components/GameHUD.tsx';
import { LevelCompleteModal } from './components/LevelCompleteModal.tsx';
import { GameOverModal } from './components/GameOverModal.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { HowToPlayModal } from './components/HowToPlayModal.tsx';
import { LevelSelectModal } from './components/LevelSelectModal.tsx';

const STORAGE_KEY_RECORDS = 'dash_draw_records_v1';
const STORAGE_KEY_SETTINGS = 'dash_draw_settings_v1';

export default function App() {
  // Screens & Navigation
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Level & Progression State
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [level, setLevel] = useState<LevelConfig>(() => JSON.parse(JSON.stringify(LEVELS[0])));
  const [records, setRecords] = useState<Record<number, LevelRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      1: { unlocked: true, completed: false, highScore: 0, bestTime: 0, gemsCollected: 0, maxGems: 4, stars: 0 },
    };
  });

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Gameplay State
  const [playMode, setPlayMode] = useState<PlayMode>('DRAW_PREP');
  const [currentStrokeType, setCurrentStrokeType] = useState<StrokeType>('solid');
  const [strokes, setStrokes] = useState<DrawnStroke[]>([]);
  const [inkRemaining, setInkRemaining] = useState<number>(LEVELS[0].maxInk);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gemCombo, setGemCombo] = useState(0);

  // Canvas & Engine References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ParticleSystem>(new ParticleSystem());
  const rendererRef = useRef<GameRenderer | null>(null);

  // Camera viewport
  const camRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Physics character state ref for 60fps loop
  const charRef = useRef<CharacterState>({
    x: LEVELS[0].spawnPoint.x,
    y: LEVELS[0].spawnPoint.y,
    vx: 0,
    vy: 0,
    radius: 14,
    height: 32,
    onGround: true,
    groundNormal: { x: 0, y: -1 },
    groundType: 'platform',
    groundAngle: 0,
    isDead: false,
    hasFinished: false,
    runCycle: 0,
    facing: 1,
    isAirborne: false,
    squash: 1,
    dustTimer: 0,
    speedBoostTimer: 0,
    shieldTimer: 0,
  });

  // Interactive drawing refs
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const activePointerIdRef = useRef<number | null>(null);

  // Load sound preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setMusicEnabled(parsed.musicEnabled ?? true);
        soundManager.setSoundEnabled(parsed.soundEnabled ?? true);
        soundManager.setMusicEnabled(parsed.musicEnabled ?? true);
      }
    } catch {}
  }, []);

  const saveSettings = (sound: boolean, music: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ soundEnabled: sound, musicEnabled: music }));
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
    saveSettings(next, musicEnabled);
  };

  const toggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    soundManager.setMusicEnabled(next);
    saveSettings(soundEnabled, next);
  };

  // Reset/Initialize Level
  const initLevel = useCallback((lvlConfig: LevelConfig, mode: PlayMode = 'DRAW_PREP') => {
    const freshLevel: LevelConfig = JSON.parse(JSON.stringify(lvlConfig));
    setLevel(freshLevel);
    setStrokes([]);
    setInkRemaining(lvlConfig.maxInk);
    setIsGameOver(false);
    setIsLevelComplete(false);
    setPlayMode(mode);
    setElapsedTime(0);
    setGemCombo(0);
    particlesRef.current.clear();

    charRef.current = {
      x: freshLevel.spawnPoint.x,
      y: freshLevel.spawnPoint.y,
      vx: 0,
      vy: 0,
      radius: 14,
      height: 32,
      onGround: true,
      groundNormal: { x: 0, y: -1 },
      groundType: 'platform',
      groundAngle: 0,
      isDead: false,
      hasFinished: false,
      runCycle: 0,
      facing: 1,
      isAirborne: false,
      squash: 1,
      dustTimer: 0,
      speedBoostTimer: 0,
      shieldTimer: 0,
    };

    camRef.current = {
      x: Math.max(0, freshLevel.spawnPoint.x - 200),
      y: 0,
    };
  }, []);

  const startLevel = (idx: number) => {
    setCurrentLevelIndex(idx);
    initLevel(LEVELS[idx]);
    setScreen('PLAYING');
    setIsPaused(false);
  };

  // Switch to Run Mode
  const togglePlayMode = useCallback(() => {
    setPlayMode((prev) => {
      const next = prev === 'DRAW_PREP' ? 'RUNNING' : 'DRAW_PREP';
      if (next === 'RUNNING' && charRef.current.vx === 0) {
        charRef.current.vx = 4.2;
      }
      return next;
    });
  }, []);

  // Stroke operations
  const handleUndo = useCallback(() => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setInkRemaining((curr) => Math.min(level.maxInk, curr + last.length));
      return prev.slice(0, prev.length - 1);
    });
  }, [level.maxInk]);

  const handleClearStrokes = useCallback(() => {
    setStrokes([]);
    setInkRemaining(level.maxInk);
  }, [level.maxInk]);

  const handleRestart = useCallback(() => {
    initLevel(level, playMode);
    setIsPaused(false);
  }, [initLevel, level, playMode]);

  // Main 60fps Game Simulation & Rendering Loop
  useEffect(() => {
    if (screen !== 'PLAYING') return;

    let animId: number;
    let lastTime = performance.now();
    let tickCount = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current = new GameRenderer(ctx);

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      tickCount++;

      // Resize canvas to actual screen bounds
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const viewportW = canvas.width;
      const viewportH = canvas.height;

      // 1. Physics Step (only when RUNNING and not paused/gameover/complete)
      if (playMode === 'RUNNING' && !isPaused && !isGameOver && !isLevelComplete) {
        setElapsedTime((prev) => prev + dt);

        const phys = updatePhysics(
          charRef.current,
          strokes,
          level.platforms,
          level.obstacles,
          level.gems,
          level.inkPickups || [],
          level.finishGate,
          level.worldHeight,
          now * 0.001
        );

        charRef.current = phys.char;

        // Sound & Particle events
        if (phys.bounced) {
          soundManager.playBounce();
          particlesRef.current.addBounceSparks(charRef.current.x, charRef.current.y + 12);
        }

        if (phys.boosted) {
          soundManager.playSpeedBoost();
        }

        if (phys.collectedGems.length > 0) {
          setGemCombo((c) => {
            const nextCombo = c + 1;
            soundManager.playGem(nextCombo);
            return nextCombo;
          });
          phys.collectedGems.forEach((gemId) => {
            const gem = level.gems.find((g) => g.id === gemId);
            if (gem) {
              particlesRef.current.addGemSparkles(gem.x, gem.y);
            }
          });
        }

        if (phys.collectedInks.length > 0) {
          phys.collectedInks.forEach((inkId) => {
            const ink = (level.inkPickups || []).find((k) => k.id === inkId);
            if (ink) {
              setInkRemaining((curr) => Math.min(level.maxInk, curr + ink.amount));
              particlesRef.current.addDrawSparks(ink.x, ink.y, '#38bdf8');
            }
          });
        }

        if (phys.hitHazard && !isGameOver) {
          soundManager.playHurt();
          particlesRef.current.addCrashDebris(charRef.current.x, charRef.current.y);
          setIsGameOver(true);
        }

        if (phys.reachedGoal && !isLevelComplete) {
          soundManager.playVictory();
          particlesRef.current.addVictoryConfetti(
            level.finishGate.x + level.finishGate.width / 2,
            level.finishGate.y
          );
          setIsLevelComplete(true);

          // Save records
          const gemsNum = level.gems.filter((g) => g.collected).length;
          const starsNum = gemsNum === level.gems.length ? 3 : gemsNum >= Math.ceil(level.gems.length * 0.6) ? 2 : 1;
          const clearScore = 1000 + gemsNum * 150 + Math.max(0, Math.round((level.targetTimeSeconds - elapsedTime) * 35));

          setRecords((prev) => {
            const existing = prev[level.id];
            const updated: LevelRecord = {
              unlocked: true,
              completed: true,
              highScore: Math.max(existing?.highScore || 0, clearScore),
              bestTime: existing?.bestTime && existing.bestTime > 0 ? Math.min(existing.bestTime, elapsedTime) : elapsedTime,
              gemsCollected: Math.max(existing?.gemsCollected || 0, gemsNum),
              maxGems: level.gems.length,
              stars: Math.max(existing?.stars || 0, starsNum),
            };

            const nextUnlockedId = level.id + 1;
            const nextRecords = {
              ...prev,
              [level.id]: updated,
              ...(LEVELS.find((l) => l.id === nextUnlockedId)
                ? {
                    [nextUnlockedId]: {
                      ...(prev[nextUnlockedId] || {
                        unlocked: true,
                        completed: false,
                        highScore: 0,
                        bestTime: 0,
                        gemsCollected: 0,
                        maxGems: 4,
                        stars: 0,
                      }),
                      unlocked: true,
                    },
                  }
                : {}),
            };

            try {
              localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(nextRecords));
            } catch {}

            return nextRecords;
          });
        }

        // Running dust emission
        if (charRef.current.onGround && tickCount % 5 === 0) {
          particlesRef.current.addDust(charRef.current.x - 6, charRef.current.y + 14);
        }
      }

      // 2. Camera Tracking (smooth lerp toward runner)
      const targetCamX = charRef.current.x - viewportW * 0.32 + charRef.current.vx * 15;
      const targetCamY = Math.max(0, Math.min(level.worldHeight - viewportH, charRef.current.y - viewportH * 0.55));

      camRef.current.x += (targetCamX - camRef.current.x) * 0.08;
      camRef.current.y += (targetCamY - camRef.current.y) * 0.08;

      // Clamp camera
      camRef.current.x = Math.max(0, Math.min(level.worldWidth - viewportW, camRef.current.x));
      camRef.current.y = Math.max(0, Math.min(Math.max(0, level.worldHeight - viewportH), camRef.current.y));

      // 3. Particle System Update
      particlesRef.current.update();

      // 4. Render Frame
      rendererRef.current?.render(
        level,
        charRef.current,
        strokes,
        currentPointsRef.current,
        currentStrokeType,
        particlesRef.current,
        camRef.current.x,
        camRef.current.y,
        viewportW,
        viewportH,
        now * 0.001
      );
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [screen, playMode, isPaused, isGameOver, isLevelComplete, level, strokes, currentStrokeType, elapsedTime]);

  // Pointer Drawing Input Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isGameOver || isLevelComplete || isPaused) return;
    if (inkRemaining <= 5) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture pointer
    canvas.setPointerCapture(e.pointerId);
    activePointerIdRef.current = e.pointerId;
    isDrawingRef.current = true;

    const rect = canvas.getBoundingClientRect();
    const wx = e.clientX - rect.left + camRef.current.x;
    const wy = e.clientY - rect.top + camRef.current.y;

    currentPointsRef.current = [{ x: wx, y: wy }];
    soundManager.playDraw();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || e.pointerId !== activePointerIdRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const wx = e.clientX - rect.left + camRef.current.x;
    const wy = e.clientY - rect.top + camRef.current.y;

    const pts = currentPointsRef.current;
    if (pts.length > 0) {
      const lastPt = pts[pts.length - 1];
      const d = dist(lastPt, { x: wx, y: wy });

      // Add point if moved at least 6px
      if (d >= 6) {
        if (inkRemaining < d) {
          // Out of ink, commit current stroke
          finishCurrentStroke();
          return;
        }

        setInkRemaining((curr) => Math.max(0, curr - d));
        currentPointsRef.current.push({ x: wx, y: wy });

        // Spawn visual drawing sparks from pen
        const color = currentStrokeType === 'solid' ? '#10b981' : currentStrokeType === 'bounce' ? '#fbbf24' : '#06b6d4';
        particlesRef.current.addDrawSparks(wx, wy, color);
      }
    }
  };

  const finishCurrentStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    activePointerIdRef.current = null;

    const pts = currentPointsRef.current;
    if (pts.length >= 2) {
      const strokeLen = calculateStrokeLength(pts);
      const newStroke: DrawnStroke = {
        id: `stroke_${Date.now()}_${Math.random()}`,
        points: [...pts],
        type: currentStrokeType,
        length: strokeLen,
      };
      setStrokes((prev) => [...prev, newStroke]);
    }
    currentPointsRef.current = [];
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId === activePointerIdRef.current) {
      finishCurrentStroke();
    }
  };

  // Keyboard Shortcuts (Space, R, Z, C, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'PLAYING') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isGameOver) {
          handleRestart();
        } else if (isLevelComplete) {
          handleNextLevel();
        } else {
          togglePlayMode();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestart();
      } else if (e.code === 'KeyZ') {
        e.preventDefault();
        handleUndo();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        handleClearStrokes();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isGameOver, isLevelComplete, togglePlayMode, handleRestart, handleUndo, handleClearStrokes]);

  const handleNextLevel = () => {
    const nextIdx = currentLevelIndex + 1;
    if (nextIdx < LEVELS.length) {
      startLevel(nextIdx);
    } else {
      setScreen('MENU');
    }
  };

  // Calculate live progress percentage towards finish flag
  const finishX = level.finishGate.x;
  const spawnX = level.spawnPoint.x;
  const currentX = charRef.current.x;
  const progressPercent = Math.max(0, Math.min(100, Math.round(((currentX - spawnX) / (finishX - spawnX)) * 100)));
  const gemsCollectedCount = level.gems.filter((g) => g.collected).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {screen === 'MENU' && (
        <MainMenu
          onStartGame={() => startLevel(0)}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenSandbox={() => {
            const sandboxIdx = LEVELS.findIndex((l) => l.theme === 'sandbox');
            if (sandboxIdx >= 0) startLevel(sandboxIdx);
          }}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={toggleSound}
          onToggleMusic={toggleMusic}
          records={records}
        />
      )}

      {screen === 'PLAYING' && (
        <>
          {/* Main 2D Game Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={finishCurrentStroke}
            className="w-full h-full cursor-crosshair touch-none"
          />

          {/* In-Game HUD */}
          <GameHUD
            level={level}
            playMode={playMode}
            onTogglePlayMode={togglePlayMode}
            inkRemaining={inkRemaining}
            maxInk={level.maxInk}
            gemsCollected={gemsCollectedCount}
            totalGems={level.gems.length}
            elapsedTime={elapsedTime}
            progressPercent={progressPercent}
            currentStrokeType={currentStrokeType}
            onChangeStrokeType={setCurrentStrokeType}
            onUndoStroke={handleUndo}
            onClearStrokes={handleClearStrokes}
            onRestartLevel={handleRestart}
            onOpenPause={() => setIsPaused(true)}
            strokeCount={strokes.length}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />

          {/* Victory Modal */}
          {isLevelComplete && (
            <LevelCompleteModal
              level={level}
              completionTime={elapsedTime}
              gemsCollected={gemsCollectedCount}
              totalGems={level.gems.length}
              inkRemaining={inkRemaining}
              maxInk={level.maxInk}
              hasNextLevel={currentLevelIndex + 1 < LEVELS.length}
              onNextLevel={handleNextLevel}
              onReplayLevel={handleRestart}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
            />
          )}

          {/* Game Over Modal */}
          {isGameOver && (
            <GameOverModal
              level={level}
              onRetry={handleRestart}
              onOpenLevelSelect={() => setShowLevelSelect(true)}
            />
          )}

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              onResume={() => setIsPaused(false)}
              onRestart={handleRestart}
              onQuitToMenu={() => {
                setIsPaused(false);
                setScreen('MENU');
              }}
              soundEnabled={soundEnabled}
              musicEnabled={musicEnabled}
              onToggleSound={toggleSound}
              onToggleMusic={toggleMusic}
            />
          )}
        </>
      )}

      {/* Level Select Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          records={records}
          currentLevelId={level.id}
          onSelectLevel={(selectedLevel) => {
            const idx = LEVELS.findIndex((l) => l.id === selectedLevel.id);
            if (idx >= 0) {
              startLevel(idx);
              setShowLevelSelect(false);
            }
          }}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* How To Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
