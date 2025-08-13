"use client";

import { Boss } from "@/types";

type BossSelectorProps = {
  bosses: Boss[];
  selectedBoss: Boss | null;
  onSelectBoss: (boss: Boss) => void;
};

export default function BossSelector({ bosses, selectedBoss, onSelectBoss }: BossSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 h-fit">
      {bosses.map((boss, index) => (
        <button
          key={index}
          onClick={() => onSelectBoss(boss)}
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
              {boss.name} {boss.altName && <span className="font-normal text-sm">({boss.altName})</span>}
            </div>
            {boss.title && (
              <div className="text-xs text-gray-300 mt-0.5 drop-shadow-md">{boss.title}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}