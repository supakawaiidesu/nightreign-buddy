"use client";

import Timer from "@/components/Timer";
import BossSection from "@/components/BossSection";
import EffectSearcher from "@/components/EffectSearcher";
import WeaponSearcher from "@/components/WeaponSearcher";
import { Boss } from "@/types";
import { WeaponScaling } from "@/utils/weaponData";

interface HomeClientProps {
  bosses: Boss[];
  weapons: WeaponScaling[];
}

export default function HomeClient({ bosses, weapons }: HomeClientProps) {
  return (
    <main className="min-h-screen relative z-10">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse top-20 -left-48" />
        <div className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse bottom-20 -right-48" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Timer Section */}
        <Timer />

        {/* Boss Information Section */}
        <div className="mb-8">
          <BossSection bosses={bosses} />
        </div>

        {/* Effect Searcher Section */}
        <div className="mb-8">
          <EffectSearcher />
        </div>

        {/* Weapon Searcher Section */}
        <div className="mb-8">
          <WeaponSearcher weapons={weapons} />
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