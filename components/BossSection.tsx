"use client";

import { useState } from "react";
import BossSelector from "@/components/BossSelector";
import BossInfoPanel from "@/components/BossInfoPanel";
import { Boss } from "@/types";
import { getImagePath } from "@/utils/images";

type BossSectionProps = {
  bosses: Boss[];
  initialBoss?: Boss | null;
};

export default function BossSection({ bosses, initialBoss }: BossSectionProps) {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(initialBoss || bosses[0]);
  const [showBossInfo, setShowBossInfo] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSelectBoss = (boss: Boss) => {
    setSelectedBoss(boss);
    setShowBossInfo(true);
  };

  return (
    <div className="glass rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
      {/* Fixed Header - Always visible */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {selectedBoss ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-yellow-400 font-semibold text-lg">{selectedBoss.name}</span>
                <span className="text-gray-400 text-base">({selectedBoss.altName})</span>
                
                {/* Weakness Icons */}
                {selectedBoss.negations && (() => {
                  const weaknesses = Object.entries(selectedBoss.negations)
                    .filter(([_, value]) => value < 0);
                  return weaknesses.length > 0 ? (
                    <>
                      <span className="text-gray-600">•</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-400">Weak to:</span>
                        {weaknesses.map(([type, value]) => (
                          <div 
                            key={type} 
                            className="flex items-center gap-1 bg-green-900/30 px-2.5 py-1 rounded cursor-help"
                            title={`Takes ${Math.abs(value)}% more damage from ${type}`}
                          >
                            <img 
                              src={getImagePath(type)} 
                              alt={type}
                              className="w-5 h-5 object-contain"
                            />
                            <span className="text-sm font-medium text-green-400">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null;
                })()}
                
                {/* Resistance and Immunity Icons */}
                {(() => {
                  const resistances = selectedBoss.negations ? 
                    Object.entries(selectedBoss.negations).filter(([_, value]) => value > 20) : [];
                  const immunities = selectedBoss.resistances ? 
                    Object.entries(selectedBoss.resistances).filter(([_, value]) => value === 'Immune' || (typeof value === 'number' && value > 400)) : [];
                  
                  if (resistances.length > 0 || immunities.length > 0) {
                    return (
                      <>
                        <span className="text-gray-600">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-red-400">Resistant to:</span>
                          {resistances.map(([type, value]) => (
                            <div 
                              key={type} 
                              className="flex items-center gap-1 bg-red-900/30 px-2.5 py-1 rounded cursor-help"
                              title={`Takes ${value}% less damage from ${type}`}
                            >
                              <img 
                                src={getImagePath(type)} 
                                alt={type}
                                className="w-5 h-5 object-contain"
                              />
                              <span className="text-sm font-medium text-red-400">+{value}%</span>
                            </div>
                          ))}
                          {immunities.map(([type]) => (
                            <div 
                              key={type} 
                              className="flex items-center gap-1 bg-purple-900/30 px-2.5 py-1 rounded cursor-help"
                              title={`Immune to ${type}`}
                            >
                              <img 
                                src={getImagePath(type)} 
                                alt={type}
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
            ) : (
              <h2 className="text-lg font-semibold text-gray-200">Boss Selection</h2>
            )}
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-4"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isMinimized ? 'max-h-0' : 'max-h-[800px]'
      }`}>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Boss Selector */}
            <BossSelector 
              bosses={bosses}
              selectedBoss={selectedBoss}
              onSelectBoss={handleSelectBoss}
            />

            {/* Boss Info Panel */}
            <BossInfoPanel 
              boss={selectedBoss}
              show={showBossInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}