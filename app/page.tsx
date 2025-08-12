"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { loadBossDataSync } from "../utils/loadBossData";

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
  health?: number;
  negations?: {
    physical?: number;
    strike?: number;
    slash?: number;
    pierce?: number;
    magic?: number;
    fire?: number;
    lightning?: number;
    holy?: number;
  };
  resistances?: {
    poison?: number | string;
    rot?: number | string;
    bleed?: number | string;
    frost?: number | string;
    sleep?: number | string;
    madness?: string;
    blight?: string;
  };
  poise?: number;
  weaknesses?: string[];
  tips?: string[];
};

const DAY_PHASES: CirclePhase[] = [
  { name: "Exploration", duration: 270, warning: 30, type: "exploration" },
  { name: "Circle 1 Closing", duration: 180, warning: 30, type: "closing" },
  { name: "Between Circles", duration: 210, warning: 30, type: "exploration" },
  { name: "Circle 2 Closing", duration: 180, warning: 30, type: "closing" },
];

// Helper function to get correct image path
const getImagePath = (type: string): string => {
  const imageMap: { [key: string]: string } = {
    // Damage types
    physical: '/images/standard.png',
    strike: '/images/strike.png',
    slash: '/images/slash.png',
    pierce: '/images/pierce.png',
    magic: '/images/magic.png',
    fire: '/images/fire.png',
    lightning: '/images/lightning.png',
    holy: '/images/holy.png',
    // Status effects
    poison: '/images/poison.png',
    rot: '/images/rot.png',
    bleed: '/images/bloodloss.png',
    frost: '/images/frostbite.png',
    sleep: '/images/sleep.png',
    madness: '/images/madness.png',
    blight: '/images/deathblight.png',
  };
  
  return imageMap[type.toLowerCase()] || `/images/${type.toLowerCase()}.png`;
};

const CSV_CONTENT = `Name,,ID,Health,,Phys Dmg Neg,,Strike Dmg Neg,,Slash Dmg Neg,,Pierce Dmg Neg,,Magic Dmg Neg,,Fire Dmg Neg,,Ltng Dmg Neg	,,Holy Dmg Neg,,,Poison Resist,Rot Resist,Bleed Resist,Frost Resist,Sleep Resist,Madness Resist,Blight Resist,Poise
"Gladius, Beast of Night",,75000020,11328,,100,0,100,0,100,0,100,-10,100,0,100,50,100,0,100,-35,,542,252,252,542,154,Immune,Immune,120
"Adel, Baron of Night",,75100020,13140,,100,0,100,0,100,0,100,0,100,0,100,20,100,50,100,0,,154,154,542,154,154,Immune,Immune,150
"Gnoster, Wisdom of Night (Moth)",,75200020,13027,,100,-15,100,-15,100,-25,100,-25,100,50,100,-40,100,10,100,10,,542,154,154,154,542,Immune,Immune,100
"Gnoster, Wisdom of Night (Pest)",,75300020,13027,,100,10,100,-20,100,20,100,-10,100,10,100,-35,100,10,100,10,,252,154,154,154,154,Immune,Immune,150
"Maris, Fathom of Night",,75400020,12687,,100,0,100,20,100,-15,100,10,100,20,100,50,100,-40,100,15,,Immune,252,Immune,252,Immune,Immune,Immune,150
"Libra, Creature of Night",,75610010,13048,,100,0,100,0,100,-10,100,0,100,20,100,-20,100,0,100,-35,,154,154,252,252,Immune,154,Immune,120
"Fulghor, Champion of Nightglow",,76000010,11894,,100,0,100,0,100,0,100,0,100,0,100,0,100,-20,100,30,,154,154,154,154,154,Immune,Immune,155
"Caligo, Miasma of Night",,49000010,12008,,100,0,100,-15,100,15,100,10,100,20,100,-35,100,20,100,20,,252,252,252,542,542,Immune,Immune,160
The Shape of Night,,75800010,4985,,100,0,100,10,100,-15,100,-10,100,0,100,-20,100,0,100,-35,,Immune,252,Immune,Immune,542,Immune,Immune,130
Heolstor the Nightlord,,75802010,10196,,100,0,100,-10,100,10,100,-15,100,0,100,0,100,-20,100,-30,,Immune,252,Immune,Immune,542,Immune,Immune,130`;

const BOSSES: Boss[] = loadBossDataSync(CSV_CONTENT);

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(BOSSES[0]);
  const [showBossInfo, setShowBossInfo] = useState(true);
  const [warningTimes, setWarningTimes] = useState<number[]>([30]);
  const [showWarningDropdown, setShowWarningDropdown] = useState(false);
  const playedWarnings = useRef<Set<number>>(new Set());

  const currentPhase = DAY_PHASES[currentPhaseIndex];
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, [isRunning, timeRemaining, currentPhase, currentPhaseIndex, warningTimes]);

  const startTimer = () => {
    setIsRunning(true);
    setCurrentPhaseIndex(0);
    setTimeRemaining(DAY_PHASES[0].duration);
    playedWarnings.current.clear();
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setTimeRemaining(0);
    playedWarnings.current.clear();
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
    <main className="min-h-screen relative z-10">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse top-20 -left-48" />
        <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse bottom-20 -right-48" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Streamlined Timer Section */}
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
                    {[10, 20, 30, 60, 90]
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
                    {[10, 20, 30, 60, 90].every(s => warningTimes.includes(s)) && (
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

        {/* Boss Information Section */}
        <div className="glass rounded-2xl p-6 backdrop-blur-md border border-white/10 mb-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Boss Grid - Left Side */}
            <div className="grid grid-cols-2 gap-3 h-fit">
              {BOSSES.map((boss, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedBoss(boss);
                    setShowBossInfo(true);
                  }}
                  className={`relative overflow-hidden rounded-lg border transition-all text-sm font-medium h-28 ${
                    selectedBoss?.name === boss.name
                      ? "border-purple-500/50 ring-2 ring-purple-500/50 scale-105"
                      : "border-white/10 hover:border-yellow-500/30 hover:scale-[1.02]"
                  }`}
                  style={{
                    backgroundImage: `url('/images/${boss.name.toLowerCase()}.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 ${
                    selectedBoss?.name === boss.name
                      ? "bg-gradient-to-t from-purple-900/90 via-purple-900/70 to-purple-900/30"
                      : "bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/30"
                  } transition-all hover:from-gray-900/80 hover:via-gray-900/60 hover:to-gray-900/20`} />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-3 text-left">
                    <div className="font-semibold text-base text-white drop-shadow-lg">
                      {boss.name}
                    </div>
                    <div className="text-xs text-gray-200 mt-0.5 drop-shadow-md">
                      {boss.altName}
                    </div>
                    {boss.title && (
                      <div className="text-xs text-gray-300 mt-0.5 drop-shadow-md">{boss.title}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Boss Info Panel - Right Side */}
            <div className={`transition-all ${showBossInfo && selectedBoss ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {selectedBoss && (
                <div className="p-6 bg-black/30 rounded-xl border border-purple-500/30 h-full">
                  {/* Boss Header with Weakness Icons */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-yellow-400">
                        {selectedBoss.name} <span className="text-gray-300 text-lg font-normal">({selectedBoss.altName})</span>
                      </h3>
                      {selectedBoss.title && <p className="text-gray-400 text-sm mt-1">{selectedBoss.title}</p>}
                    </div>
                    
                    {/* Weakness Icons */}
                    {selectedBoss.negations && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-400 mr-2">Weak:</span>
                        {Object.entries(selectedBoss.negations)
                          .filter(([_, value]) => value < 0)
                          .map(([type, value]) => (
                            <div key={type} className="relative group">
                              <img 
                                src={getImagePath(type)} 
                                alt={type}
                                className="w-6 h-6 object-contain"
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {type}: {value}%
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Health/Poise with Resistance Icons */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-6">
                      {selectedBoss.health && (
                        <div>
                          <span className="text-sm text-gray-400">Health:</span>
                          <span className="ml-2 font-semibold">{selectedBoss.health.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedBoss.poise && (
                        <div>
                          <span className="text-sm text-gray-400">Poise:</span>
                          <span className="ml-2 font-semibold">{selectedBoss.poise}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Resistance and Immunity Icons */}
                    {(selectedBoss.negations || selectedBoss.resistances) && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-red-400 mr-2">Resist:</span>
                        
                        {/* Damage Resistances */}
                        {selectedBoss.negations && Object.entries(selectedBoss.negations)
                          .filter(([_, value]) => value > 20)
                          .map(([type, value]) => (
                            <div key={type} className="relative group">
                              <img 
                                src={getImagePath(type)} 
                                alt={type}
                                className="w-6 h-6 object-contain opacity-75"
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {type}: +{value}%
                              </div>
                            </div>
                          ))}
                        
                        {/* Status Immunities with red outline */}
                        {selectedBoss.resistances && Object.entries(selectedBoss.resistances)
                          .filter(([_, value]) => value === 'Immune' || (typeof value === 'number' && value > 400))
                          .map(([type, _value]) => (
                            <div key={type} className="relative group">
                              <img 
                                src={getImagePath(type)} 
                                alt={type}
                                className="w-6 h-6 object-contain ring-2 ring-red-500 rounded"
                              />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                IMMUNE TO {type.toUpperCase()}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-700/50 my-4"></div>

                  {/* Boss Info Grid */}
                  <div className="space-y-4">

                    {/* Damage Negations */}
                    {selectedBoss.negations && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Damage Negations</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(selectedBoss.negations).map(([type, value]) => (
                            <div key={type} className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400 capitalize">{type}:</span>
                              <span className={`font-medium ${
                                value < 0 ? 'text-green-400' : value > 0 ? 'text-red-400' : 'text-gray-300'
                              }`}>
                                {value > 0 ? '+' : ''}{value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Resistances */}
                    {selectedBoss.resistances && (
                      <div>
                        <h4 className="text-sm font-semibold text-orange-400 mb-2">Status Resistances</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(selectedBoss.resistances).map(([type, value]) => (
                            <div key={type} className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400 capitalize">{type}:</span>
                              <span className="font-medium text-gray-300">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          </div>
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