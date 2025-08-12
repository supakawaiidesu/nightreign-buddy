export type BossDataFromCSV = {
  name: string;
  health: number;
  negations: {
    physical: number;
    strike: number;
    slash: number;
    pierce: number;
    magic: number;
    fire: number;
    lightning: number;
    holy: number;
  };
  resistances: {
    poison: number | string;
    rot: number | string;
    bleed: number | string;
    frost: number | string;
    sleep: number | string;
    madness: string;
    blight: string;
  };
  poise: number;
};

export function parseBossCSV(csvContent: string): BossDataFromCSV[] {
  const lines = csvContent.trim().split('\n');
  const bosses: BossDataFromCSV[] = [];
  
  // Skip header line and process data lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('Average') || line.includes(',,,,')) continue;
    
    // Split by comma, handling quoted values and empty fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Don't forget the last value
    
    // Clean values (remove quotes)
    const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
    
    if (cleanValues.length < 28) continue; // Skip incomplete rows
    
    // The CSV has empty columns, so we need to skip them
    // Structure: Name,,ID,Health,,Phys,,Strike,,Slash,,Pierce,,Magic,,Fire,,Ltng,,Holy,,,Poison,Rot,Bleed,Frost,Sleep,Madness,Blight,Poise
    const boss: BossDataFromCSV = {
      name: cleanValues[0],
      health: parseInt(cleanValues[3]) || 0,
      negations: {
        physical: parseInt(cleanValues[6]) || 0,
        strike: parseInt(cleanValues[8]) || 0,
        slash: parseInt(cleanValues[10]) || 0,
        pierce: parseInt(cleanValues[12]) || 0,
        magic: parseInt(cleanValues[14]) || 0,
        fire: parseInt(cleanValues[16]) || 0,
        lightning: parseInt(cleanValues[18]) || 0,
        holy: parseInt(cleanValues[20]) || 0,
      },
      resistances: {
        poison: isNaN(parseInt(cleanValues[22])) ? cleanValues[22] : parseInt(cleanValues[22]),
        rot: isNaN(parseInt(cleanValues[23])) ? cleanValues[23] : parseInt(cleanValues[23]),
        bleed: isNaN(parseInt(cleanValues[24])) ? cleanValues[24] : parseInt(cleanValues[24]),
        frost: isNaN(parseInt(cleanValues[25])) ? cleanValues[25] : parseInt(cleanValues[25]),
        sleep: isNaN(parseInt(cleanValues[26])) ? cleanValues[26] : parseInt(cleanValues[26]),
        madness: cleanValues[27] || 'Immune',
        blight: cleanValues[28] || 'Immune',
      },
      poise: parseInt(cleanValues[29]) || 0,
    };
    
    bosses.push(boss);
  }
  
  return bosses;
}

// Map CSV boss names to our app's boss names
export function mapBossName(csvName: string): string {
  const mappings: { [key: string]: string } = {
    "Gladius, Beast of Night": "Gladius",
    "Adel, Baron of Night": "Adel",
    "Gnoster, Wisdom of Night (Moth)": "Gnoster",
    "Gnoster, Wisdom of Night (Pest)": "Gnoster", // Same boss, different form
    "Maris, Fathom of Night": "Maris",
    "Libra, Creature of Night": "Libra",
    "Fulghor, Champion of Nightglow": "Fulghor",
    "Caligo, Miasma of Night": "Caligo",
    "Heolstor the Nightlord": "Heolstor",
  };
  
  return mappings[csvName] || csvName;
}

// Generate weaknesses and tips based on negation values
export function generateWeaknessesAndTips(data: BossDataFromCSV): { weaknesses: string[], tips: string[] } {
  const weaknesses: string[] = [];
  const tips: string[] = [];
  
  // Check for elemental weaknesses (negative values)
  Object.entries(data.negations).forEach(([type, value]) => {
    if (value < 0) {
      weaknesses.push(type.charAt(0).toUpperCase() + type.slice(1));
      tips.push(`Vulnerable to ${type} damage (${value}% negation)`);
    } else if (value > 20) {
      tips.push(`Resistant to ${type} damage (${value}% negation)`);
    }
  });
  
  // Check for high resistances
  Object.entries(data.resistances).forEach(([type, value]) => {
    if (typeof value === 'string' && value === 'Immune') {
      tips.push(`Immune to ${type}`);
    } else if (typeof value === 'number' && value > 400) {
      tips.push(`High ${type} resistance (${value})`);
    }
  });
  
  return { weaknesses, tips };
}