"use client";

import { useState, useEffect, useRef } from "react";

type CirclePhase = {
  name: string;
  duration: number; // in seconds
  warning: number; // warning time before end in seconds
  type: "exploration" | "closing";
};

type Boss = {
  name: string;
  altName: string;
  title: string;
  weaknesses?: string[];
  resistances?: string[];
  tips?: string[];
};

const DAY_PHASES: CirclePhase[] = [
  { name: "Exploration", duration: 270, warning: 30, type: "exploration" },
  { name: "Circle 1 Closing", duration: 180, warning: 30, type: "closing" },
  { name: "Between Circles", duration: 210, warning: 30, type: "exploration" },
  { name: "Circle 2 Closing", duration: 180, warning: 30, type: "closing" },
];

const BOSSES: Boss[] = [
  { name: "Gladius", altName: "Tricephalos", title: "Beast of Night" },
  { name: "Adel", altName: "Gaping Maw", title: "Baron of Knight" },
  { name: "Gnoster", altName: "Sentient Pest", title: "Wisdom of Night" },
  { name: "Maris", altName: "Augur", title: "Fathom of Night" },
  { name: "Libra", altName: "Equilibrius Beast", title: "Creature of Night" },
  { name: "Fulghor", altName: "Darkdrift Knight", title: "Champion of Nightglow" },
  { name: "Caligo", altName: "Fissure in the Fog", title: "Miasma of Night" },
  { name: "Heolstor", altName: "Night Aspect", title: "the Nightlord" },
];

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [showBossInfo, setShowBossInfo] = useState(false);
  const hasPlayedWarning = useRef(false);

  const currentPhase = DAY_PHASES[currentPhaseIndex];

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        if (
          newTime <= currentPhase.warning &&
          newTime > currentPhase.warning - 1 &&
          !hasPlayedWarning.current
        ) {
          playWarningSound();
          hasPlayedWarning.current = true;
        }

        if (newTime <= 0) {
          hasPlayedWarning.current = false;
          
          if (currentPhaseIndex < DAY_PHASES.length - 1) {
            setCurrentPhaseIndex((prev) => prev + 1);
            return DAY_PHASES[currentPhaseIndex + 1].duration;
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
  }, [isRunning, timeRemaining, currentPhase, currentPhaseIndex]);

  const startTimer = () => {
    setIsRunning(true);
    setCurrentPhaseIndex(0);
    setTimeRemaining(DAY_PHASES[0].duration);
    hasPlayedWarning.current = false;
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setTimeRemaining(0);
    hasPlayedWarning.current = false;
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
    <main className="min-h-screen relative z-10">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse top-20 -left-48" />
        <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse bottom-20 -right-48" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
            Nightreign Buddy
          </h1>
          <p className="text-gray-400 text-lg">Your companion for the eternal cycle</p>
        </header>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-8 mb-12">
          {/* Phase Timeline - Left Side */}
          <div className="glass rounded-2xl p-6 backdrop-blur-md border border-white/10 h-fit">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Day Cycle</h3>
            <div className="space-y-3">
              {DAY_PHASES.map((phase, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    index === currentPhaseIndex 
                      ? "bg-yellow-500/20 border border-yellow-500/50" 
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      phase.type === "closing" ? "bg-red-500" : "bg-green-500"
                    }`} />
                    <span className={index === currentPhaseIndex ? "font-semibold" : ""}>
                      {phase.name}
                    </span>
                  </div>
                  <span className="text-gray-400 font-mono text-sm">{formatTime(phase.duration)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Total cycle: {formatTime(DAY_PHASES.reduce((acc, phase) => acc + phase.duration, 0))}
              </p>
            </div>
          </div>

          {/* Main Timer Card */}
          <div className="glass rounded-3xl p-8 md:p-12 backdrop-blur-md border border-white/10 hover:border-yellow-500/30 transition-all duration-500">
            {/* Current Phase Status */}
            <div className="text-center mb-10">
              <p className="text-2xl text-gray-300 mb-2">
                {currentPhase ? currentPhase.name : "Ready to Begin"}
              </p>
              <div className="inline-flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentPhase?.type === 'closing' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                <span className="text-sm text-gray-400">
                  {currentPhase?.type === 'closing' ? 'Circle Closing' : 'Safe to Explore'}
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="mb-10">
              <div className="text-7xl md:text-8xl font-mono font-bold text-center mb-6 tracking-wider">
                {formatTime(timeRemaining)}
              </div>
              
              {/* Progress Bar */}
              {currentPhase && (
                <div className="relative">
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                        currentPhase.type === "closing" 
                          ? "bg-gradient-to-r from-red-500 to-red-600" 
                          : "bg-gradient-to-r from-green-500 to-emerald-600"
                      }`}
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  {timeRemaining <= currentPhase.warning && timeRemaining > 0 && (
                    <div className="absolute -bottom-8 left-0 right-0 text-center">
                      <p className="text-red-400 font-semibold animate-pulse flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {currentPhase.name} ending soon!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mt-12">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl font-bold text-lg text-black overflow-hidden hover:scale-105 transition-transform"
                >
                  <span className="relative z-10">Start Timer</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-bold text-lg overflow-hidden hover:scale-105 transition-transform"
                >
                  <span className="relative z-10">Stop</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="px-8 py-4 glass rounded-xl font-bold text-lg border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Boss Selector Section */}
        <div className="glass rounded-2xl p-8 backdrop-blur-md border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">Boss Information</h2>
          
          {/* Boss Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-6">
            {BOSSES.map((boss, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedBoss(boss);
                  setShowBossInfo(true);
                }}
                className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                  selectedBoss?.name === boss.name
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                    : "glass border-white/10 hover:border-yellow-500/30 hover:bg-white/5"
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">
                    {boss.name} <span className="text-xs text-gray-400 font-normal">({boss.altName})</span>
                  </div>
                  {boss.title && (
                    <div className="text-xs text-gray-400 mt-1">{boss.title}</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Boss Info Panel */}
          {showBossInfo && selectedBoss && (
            <div className="mt-6 p-6 bg-black/30 rounded-xl border border-purple-500/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">
                    {selectedBoss.name} <span className="text-gray-300 text-lg font-normal">({selectedBoss.altName})</span>
                  </h3>
                  {selectedBoss.title && <p className="text-gray-400 text-sm mt-1">{selectedBoss.title}</p>}
                </div>
                <button
                  onClick={() => setShowBossInfo(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Placeholder Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-green-400 mb-2">Weaknesses</h4>
                  <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-2">Resistances</h4>
                  <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Tips</h4>
                  <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Content Area - Placeholder for future features */}
        <div className="glass rounded-2xl p-8 backdrop-blur-md border border-white/10">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">More features coming soon</p>
            <p className="text-sm">Spreadsheet data • Wiki links • Build guides • And more...</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </main>
  );
}