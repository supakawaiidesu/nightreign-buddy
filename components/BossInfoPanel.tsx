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
        {/* Health and Poise Stats */}
        <div className="flex gap-6 mb-6">
          {boss.health && (
            <div>
              <span className="text-sm text-gray-400">Health:</span>
              <span className="ml-2 font-semibold text-lg">{boss.health.toLocaleString()}</span>
            </div>
          )}
          {boss.poise && (
            <div>
              <span className="text-sm text-gray-400">Poise:</span>
              <span className="ml-2 font-semibold text-lg">{boss.poise}</span>
            </div>
          )}
        </div>

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