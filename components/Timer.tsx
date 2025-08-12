"use client";

import { useState, useEffect, useRef } from "react";
import { CirclePhase } from "@/types";
import { DAY_PHASES, WARNING_TIME_OPTIONS } from "@/constants";

type TimerProps = {
  onPhaseChange?: (phaseIndex: number) => void;
};

export default function Timer({ onPhaseChange }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [warningTimes, setWarningTimes] = useState<number[]>([30]);
  const [showWarningDropdown, setShowWarningDropdown] = useState(false);
  const playedWarnings = useRef<Set<number>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPhase = DAY_PHASES[currentPhaseIndex];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWarningDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Check all warning times
        warningTimes.forEach((warningTime) => {
          if (
            newTime <= warningTime &&
            newTime > warningTime - 1 &&
            !playedWarnings.current.has(warningTime)
          ) {
            playWarningSound();
            playedWarnings.current.add(warningTime);
          }
        });

        if (newTime <= 0) {
          playedWarnings.current.clear();
          
          if (currentPhaseIndex < DAY_PHASES.length - 1) {
            const nextPhaseIndex = currentPhaseIndex + 1;
            setCurrentPhaseIndex(nextPhaseIndex);
            onPhaseChange?.(nextPhaseIndex);
            return DAY_PHASES[nextPhaseIndex].duration;
          } else {
            // End of cycle - stop timer
            setIsRunning(false);
            return 0;
          }
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentPhase, currentPhaseIndex, warningTimes, onPhaseChange]);

  const startTimer = () => {
    setIsRunning(true);
    setCurrentPhaseIndex(0);
    setTimeRemaining(DAY_PHASES[0].duration);
    playedWarnings.current.clear();
    onPhaseChange?.(0);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setTimeRemaining(0);
    playedWarnings.current.clear();
    onPhaseChange?.(0);
  };

  const addWarningTime = (time: number) => {
    if (!warningTimes.includes(time)) {
      setWarningTimes([...warningTimes, time].sort((a, b) => b - a));
    }
    setShowWarningDropdown(false);
  };

  const removeWarningTime = (time: number) => {
    setWarningTimes(warningTimes.filter(t => t !== time));
  };

  const playWarningSound = () => {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.3;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (!currentPhase) return 0;
    return ((currentPhase.duration - timeRemaining) / currentPhase.duration) * 100;
  };

  return (
    <div className="glass rounded-2xl p-4 backdrop-blur-md border border-white/10 mb-8 relative z-20">
      {/* Phase Progress Bar */}
      <div className="mb-3">
        <div className="flex h-14 bg-gray-900 rounded-xl overflow-hidden shadow-inner">
          {DAY_PHASES.map((phase, index) => {
            const phasePercentage = (phase.duration / DAY_PHASES.reduce((acc, p) => acc + p.duration, 0)) * 100;
            const isActive = index === currentPhaseIndex;
            const isPast = index < currentPhaseIndex;
            
            return (
              <div
                key={index}
                className={`relative flex-shrink-0 transition-all duration-300 ${
                  phase.type === 'closing' ? 'bg-red-950/70' : 'bg-green-950/70'
                } ${isActive ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}
                style={{ width: `${phasePercentage}%` }}
              >
                {/* Phase progress fill */}
                {isActive && (
                  <div
                    className={`absolute inset-0 transition-all duration-1000 ease-linear ${
                      phase.type === 'closing' 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                    }`}
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                )}
                {isPast && (
                  <div className={`absolute inset-0 ${
                    phase.type === 'closing' ? 'bg-red-800/80' : 'bg-green-800/80'
                  }`} />
                )}
                
                {/* Phase label with timer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-sm font-semibold ${isActive ? 'text-white drop-shadow-lg' : 'text-gray-300'}`}>
                    {phase.name}
                  </span>
                  {isActive && (
                    <span className="text-xs text-white/90 font-mono mt-0.5">
                      {formatTime(timeRemaining)}
                    </span>
                  )}
                </div>
                
                {/* Warning indicator */}
                {isActive && warningTimes.some(wt => timeRemaining <= wt && timeRemaining > 0) && (
                  <div className="absolute top-1 right-1">
                    <svg className="w-4 h-4 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex justify-between items-center">
        {/* Warning Controls - Left Side */}
        <div className="flex items-center gap-2">
          {/* Add Warning Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowWarningDropdown(!showWarningDropdown)}
              className="px-4 py-2 glass rounded-lg text-sm font-medium border border-white/20 hover:border-yellow-500/50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Warning
            </button>
            
            {/* Dropdown Menu */}
            {showWarningDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-white/20 rounded-lg shadow-xl z-50">
                {WARNING_TIME_OPTIONS
                  .filter(seconds => !warningTimes.includes(seconds))
                  .map((seconds) => (
                    <button
                      key={seconds}
                      onClick={() => addWarningTime(seconds)}
                      className="block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {seconds < 60 ? `${seconds} seconds` : `${seconds / 60} minute${seconds > 60 ? 's' : ''}`}
                    </button>
                  ))}
                {WARNING_TIME_OPTIONS.every(s => warningTimes.includes(s)) && (
                  <div className="px-4 py-2 text-sm text-gray-500">All warnings added</div>
                )}
              </div>
            )}
          </div>

          {/* Active Warning Tags */}
          {warningTimes.map((time) => (
            <div
              key={time}
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-sm"
            >
              <button
                onClick={() => removeWarningTime(time)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-yellow-300 font-medium">
                {time < 60 ? `${time}s` : `${time / 60}m`}
              </span>
            </div>
          ))}
        </div>

        {/* Timer Controls - Right Side */}
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg font-semibold text-black hover:scale-105 transition-transform text-sm"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform text-sm"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-6 py-2 glass rounded-lg font-semibold border border-white/20 hover:border-purple-500/50 transition-all text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}