'use client';

import { useState, useMemo } from 'react';
import { WeaponScaling, getWeaponRecommendation, getScalingColor } from '@/utils/weaponData';
import { Search, HelpCircle } from 'lucide-react';

interface WeaponSearcherProps {
  weapons: WeaponScaling[];
}

const characterOrder = ['Wylder', 'Guardian', 'Ironeye', 'Duchess', 'Raider', 'Revenant', 'Recluse', 'Executor'];

export default function WeaponSearcher({ weapons }: WeaponSearcherProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const filteredWeapons = useMemo(() => {
    return weapons.filter(weapon => 
      weapon.weapon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (weapon.hasStatus && weapon.hasStatus.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [weapons, searchTerm]);

  const tooltipContent = [
    "Tables shows weapon Attack Power at lv12 with no relics.",
    "Only base status build up is listed next to weapon.",
    "Elemental infusions alter scaling during exploration.",
    "Starting weapons perform similarly to unique purple once upgraded.",
    "Adding status via Relic reduces ~20% AP.",
    "All unique AoWs scale off 1 handed AP."
  ];

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg p-6 border border-yellow-600/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          Weapon Scaling Guide
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <HelpCircle size={20} />
            </button>
            {showTooltip && (
              <div className="absolute left-0 top-8 bg-gray-900 border border-gray-700 rounded-lg p-4 w-96 z-50 text-sm">
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
        <div className="text-sm text-gray-400">
          <span className="text-green-400">■</span> Best
          <span className="text-yellow-400 ml-3">■</span> Average
          <span className="text-red-400 ml-3">■</span> Worst
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search weapons or status effects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white"
        />
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredWeapons.map((weapon, index) => {
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
                  
                  return (
                    <div key={character} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{character}</div>
                      <div 
                        className="text-lg font-bold rounded px-2 py-1"
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
  );
}