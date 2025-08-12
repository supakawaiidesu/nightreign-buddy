"use client";

import { useState } from "react";
import Timer from "@/components/Timer";
import BossSelector from "@/components/BossSelector";
import BossInfoPanel from "@/components/BossInfoPanel";
import { Boss } from "@/types";
import { BOSSES } from "@/constants";

export default function Home() {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(BOSSES[0]);
  const [showBossInfo, setShowBossInfo] = useState(true);

  const handleSelectBoss = (boss: Boss) => {
    setSelectedBoss(boss);
    setShowBossInfo(true);
  };

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
        <div className="glass rounded-2xl p-6 backdrop-blur-md border border-white/10 mb-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Boss Selector */}
            <BossSelector 
              bosses={BOSSES}
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