"use client";

import { Boss } from "@/types";
import { getImagePath } from "@/utils/images";

type BossInfoPanelProps = {
  boss: Boss | null;
  show: boolean;
};

export default function BossInfoPanel({ boss, show }: BossInfoPanelProps) {
  if (!boss || !show) {
    return <div className="opacity-0 pointer-events-none" />;
  }

  return (
    <div className="transition-all opacity-100">
      <div className="p-6 bg-black/30 rounded-xl border border-purple-500/30 h-full">
        {/* Boss Header with Weakness Icons */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-400">
              {boss.name} <span className="text-gray-300 text-lg font-normal">({boss.altName})</span>
            </h3>
            {boss.title && <p className="text-gray-400 text-sm mt-1">{boss.title}</p>}
          </div>
          
          {/* Weakness Icons */}
          {boss.negations && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-400 mr-2">Weak:</span>
              {Object.entries(boss.negations)
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
            {boss.health && (
              <div>
                <span className="text-sm text-gray-400">Health:</span>
                <span className="ml-2 font-semibold">{boss.health.toLocaleString()}</span>
              </div>
            )}
            {boss.poise && (
              <div>
                <span className="text-sm text-gray-400">Poise:</span>
                <span className="ml-2 font-semibold">{boss.poise}</span>
              </div>
            )}
          </div>
          
          {/* Resistance and Immunity Icons */}
          {(boss.negations || boss.resistances) && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-400 mr-2">Resist:</span>
              
              {/* Damage Resistances */}
              {boss.negations && Object.entries(boss.negations)
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
              {boss.resistances && Object.entries(boss.resistances)
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
          {boss.negations && (
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-2">Damage Negations</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(boss.negations).map(([type, value]) => (
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
          {boss.resistances && (
            <div>
              <h4 className="text-sm font-semibold text-orange-400 mb-2">Status Resistances</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(boss.resistances).map(([type, value]) => (
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
    </div>
  );
}