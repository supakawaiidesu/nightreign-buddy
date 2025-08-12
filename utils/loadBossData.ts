import { parseBossCSV, mapBossName, generateWeaknessesAndTips, BossDataFromCSV } from './parseBossData';

export type Boss = {
  name: string;
  altName: string;
  title: string;
  health?: number;
  negations?: {
    physical?: number;
    strike?: number;
    slash?: number;
    pierce?: number;
    magic?: number;
    fire?: number;
    lightning?: number;
    holy?: number;
  };
  resistances?: {
    poison?: number | string;
    rot?: number | string;
    bleed?: number | string;
    frost?: number | string;
    sleep?: number | string;
    madness?: string;
    blight?: string;
  };
  poise?: number;
  weaknesses?: string[];
  tips?: string[];
};

// Base boss information (names and titles)
const BASE_BOSSES: Boss[] = [
  { name: "Gladius", altName: "Tricephalos", title: "Beast of Night" },
  { name: "Adel", altName: "Gaping Maw", title: "Baron of Night" },
  { name: "Gnoster", altName: "Sentient Pest", title: "Wisdom of Night" },
  { name: "Maris", altName: "Augur", title: "Fathom of Night" },
  { name: "Libra", altName: "Equilibrius Beast", title: "Creature of Night" },
  { name: "Fulghor", altName: "Darkdrift Knight", title: "Champion of Nightglow" },
  { name: "Caligo", altName: "Fissure in the Fog", title: "Miasma of Night" },
  { name: "Heolstor", altName: "Night Aspect", title: "the Nightlord" },
];

export async function loadBossData(): Promise<Boss[]> {
  try {
    // In a real Next.js app, we'd fetch this from the public folder
    const response = await fetch('/slayworldkiller-numbers/nightlord-solo.csv');
    const csvContent = await response.text();
    
    const csvBosses = parseBossCSV(csvContent);
    const bossDataMap = new Map<string, BossDataFromCSV>();
    
    // Create a map of boss data by name
    csvBosses.forEach(csvBoss => {
      const mappedName = mapBossName(csvBoss.name);
      // For bosses with multiple forms (like Gnoster), we'll use the first one found
      if (!bossDataMap.has(mappedName)) {
        bossDataMap.set(mappedName, csvBoss);
      }
    });
    
    // Merge base boss info with CSV data
    return BASE_BOSSES.map(baseBoss => {
      const csvData = bossDataMap.get(baseBoss.name);
      
      if (csvData) {
        const { weaknesses, tips } = generateWeaknessesAndTips(csvData);
        
        return {
          ...baseBoss,
          health: csvData.health,
          negations: csvData.negations,
          resistances: csvData.resistances,
          poise: csvData.poise,
          weaknesses,
          tips,
        };
      }
      
      return baseBoss;
    });
  } catch (error) {
    console.error('Failed to load boss data from CSV:', error);
    // Return base bosses without stats if CSV loading fails
    return BASE_BOSSES;
  }
}

// For static loading in the initial implementation
export function loadBossDataSync(csvContent: string): Boss[] {
  const csvBosses = parseBossCSV(csvContent);
  const bossDataMap = new Map<string, BossDataFromCSV>();
  
  // Create a map of boss data by name
  csvBosses.forEach(csvBoss => {
    const mappedName = mapBossName(csvBoss.name);
    // For bosses with multiple forms (like Gnoster), we'll use the first one found
    if (!bossDataMap.has(mappedName)) {
      bossDataMap.set(mappedName, csvBoss);
    }
  });
  
  // Merge base boss info with CSV data
  return BASE_BOSSES.map(baseBoss => {
    const csvData = bossDataMap.get(baseBoss.name);
    
    if (csvData) {
      const { weaknesses, tips } = generateWeaknessesAndTips(csvData);
      
      return {
        ...baseBoss,
        health: csvData.health,
        negations: csvData.negations,
        resistances: csvData.resistances,
        poise: csvData.poise,
        weaknesses,
        tips,
      };
    }
    
    return baseBoss;
  });
}