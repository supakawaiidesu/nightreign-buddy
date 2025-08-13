'use client'

import React, { useState, useMemo } from 'react'
import powersData from '@/constants/powers.json'
import '@/styles/EffectSearcher.css'

interface Power {
  name: string
  effect: string
}

export default function EffectSearcher() {
  const [searchTerm, setSearchTerm] = useState('')
  const powers: Power[] = powersData[0].powers

  const filteredPowers = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    const lowerSearchTerm = searchTerm.toLowerCase()
    return powers.filter(power => 
      power.name.toLowerCase().includes(lowerSearchTerm) ||
      power.effect.toLowerCase().includes(lowerSearchTerm)
    )
  }, [searchTerm, powers])

  return (
    <div className="effect-searcher">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Effect Searcher</h2>
      
      <div className="search-container mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for power effects..."
          className="search-input"
        />
      </div>

      <div className="results-container">
        {searchTerm && filteredPowers.length === 0 && (
          <p className="no-results">No powers found matching "{searchTerm}"</p>
        )}
        
        {filteredPowers.map((power, index) => (
          <div key={index} className="power-item">
            <h3 className="power-name">{power.name}</h3>
            <p className="power-effect">{power.effect}</p>
          </div>
        ))}
      </div>
    </div>
  )
}