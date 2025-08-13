'use client';

import { useState, useMemo, useEffect } from 'react';
import { WeaponScaling, getWeaponRecommendation, getScalingColor } from '@/utils/weaponData';
import { Search, HelpCircle, ChevronDown } from 'lucide-react';

interface WeaponSearcherProps {
  weapons: WeaponScaling[];
}

const characterOrder = ['Wylder', 'Guardian', 'Ironeye', 'Duchess', 'Raider', 'Revenant', 'Recluse', 'Executor'];

export default function WeaponSearcher({ weapons }: WeaponSearcherProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Auto-expand when user starts searching
  useEffect(() => {
    if (searchTerm && isMinimized) {
      setIsMinimized(false);
    }
  }, [searchTerm, isMinimized]);

  const filteredAndSortedWeapons = useMemo(() => {
    let filtered = weapons.filter(weapon => 
      weapon.weapon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (weapon.hasStatus && weapon.hasStatus.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort by character if selected
    if (sortBy !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortBy.toLowerCase() as keyof WeaponScaling] as number;
        const bValue = b[sortBy.toLowerCase() as keyof WeaponScaling] as number;
        return bValue - aValue; // Sort descending (highest first)
      });
    }

    return filtered;
  }, [weapons, searchTerm, sortBy]);

  const tooltipContent = [
    "Tables shows weapon Attack Power at lv12 with no relics.",
    "Only base status build up is listed next to weapon.",
    "Elemental infusions alter scaling during exploration.",
    "Starting weapons perform similarly to unique purple once upgraded.",
    "Adding status via Relic reduces ~20% AP.",
    "All unique AoWs scale off 1 handed AP."
  ];

  return (
    <div className="glass rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
      {/* Fixed Header - Always visible */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Title with tooltip */}
            <div className="flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                Weapon Scaling Guide
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <HelpCircle size={16} />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-0 top-6 bg-gray-900 border border-gray-700 rounded-lg p-4 w-96 z-50 text-sm">
                      <h3 className="text-yellow-400 font-semibold mb-2">Notes:</h3>
                      <ul className="text-gray-300 space-y-1">
                        {tooltipContent.map((note, index) => (
                          <li key={index} className="text-xs">• {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </h2>
            </div>

            {/* Centered search bar with sort dropdown */}
            <div className="flex-1 flex justify-center gap-2">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search weapons or status effects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white text-sm"
                />
              </div>
              
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg hover:border-yellow-500 transition-colors text-sm text-gray-300"
                >
                  <span>Sort: {sortBy === 'default' ? 'Default' : sortBy}</span>
                  <ChevronDown size={16} />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute top-full mt-1 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 min-w-[150px]">
                    <button
                      onClick={() => {
                        setSortBy('default');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                        sortBy === 'default' ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      Default Order
                    </button>
                    {characterOrder.map(character => (
                      <button
                        key={character}
                        onClick={() => {
                          setSortBy(character);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                          sortBy === character ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        Best for {character}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legend aligned to the right */}
            <div className="flex-shrink-0 text-sm text-gray-400 flex items-center gap-3">
              <span className="text-green-400">■</span> Best
              <span className="text-yellow-400">■</span> Average
              <span className="text-red-400">■</span> Worst
            </div>
          </div>

          {/* Collapse button */}
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
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredAndSortedWeapons.map((weapon, index) => {
              const scalingValues = characterOrder.map(char => 
                weapon[char.toLowerCase() as keyof WeaponScaling] as number
              );
              
              return (
                <div key={index} className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 hover:border-yellow-600/50 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {weapon.weapon}
                        {weapon.hasStatus && (
                          <span className="ml-2 text-sm text-purple-400">({weapon.hasStatus})</span>
                        )}
                      </h3>
                      <p className="text-sm text-yellow-400 mt-1">
                        Best for: {getWeaponRecommendation(weapon)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                    {characterOrder.map((character) => {
                      const value = weapon[character.toLowerCase() as keyof WeaponScaling] as number;
                      const color = getScalingColor(value, scalingValues);
                      const isHighlighted = sortBy === character;
                      
                      return (
                        <div key={character} className="text-center">
                          <div className="text-xs text-gray-400 mb-1">{character}</div>
                          <div 
                            className={`text-lg font-bold rounded px-2 py-1 ${
                              isHighlighted ? 'ring-2 ring-yellow-400' : ''
                            }`}
                            style={{ 
                              backgroundColor: `${color}20`,
                              color: color,
                              border: `1px solid ${color}40`
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}