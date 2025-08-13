'use client'

import React, { useState, useMemo, useEffect } from 'react'
import powersData from '@/constants/powers.json'
import { Search } from 'lucide-react'

interface Power {
  name: string
  effect: string
}

export default function EffectSearcher() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const powers: Power[] = powersData[0].powers

  // Auto-expand when user starts searching
  useEffect(() => {
    if (searchTerm && isMinimized) {
      setIsMinimized(false)
    }
  }, [searchTerm, isMinimized])

  const filteredPowers = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    const lowerSearchTerm = searchTerm.toLowerCase()
    return powers.filter(power => 
      power.name.toLowerCase().includes(lowerSearchTerm) ||
      power.effect.toLowerCase().includes(lowerSearchTerm)
    )
  }, [searchTerm, powers])

  return (
    <div className="glass rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
      {/* Fixed Header - Always visible */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Title */}
            <div className="flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-200">Effect Searcher</h2>
            </div>
            
            {/* Centered search bar */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for power effects..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg focus:border-yellow-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            {/* Spacer to balance layout */}
            <div className="flex-shrink-0 w-[120px]"></div>
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
            {searchTerm && filteredPowers.length === 0 && (
              <p className="text-gray-400 text-center py-4">No powers found matching "{searchTerm}"</p>
            )}
            
            {filteredPowers.map((power, index) => (
              <div key={index} className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 hover:border-yellow-600/50 transition-all">
                <h3 className="text-lg font-semibold text-white mb-1">{power.name}</h3>
                <p className="text-gray-300 text-sm">{power.effect}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}