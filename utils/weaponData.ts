export interface WeaponScaling {
  weapon: string;
  wylder: number;
  guardian: number;
  ironeye: number;
  duchess: number;
  raider: number;
  revenant: number;
  recluse: number;
  executor: number;
  hasStatus?: string;
}

export function getWeaponRecommendation(weapon: WeaponScaling): string {
  const characters = [
    { name: 'Executor', value: weapon.executor },
    { name: 'Ironeye', value: weapon.ironeye },
    { name: 'Wylder', value: weapon.wylder },
    { name: 'Duchess', value: weapon.duchess },
    { name: 'Guardian', value: weapon.guardian },
    { name: 'Raider', value: weapon.raider },
    { name: 'Revenant', value: weapon.revenant },
    { name: 'Recluse', value: weapon.recluse }
  ];
  
  // Sort by scaling value descending
  characters.sort((a, b) => b.value - a.value);
  
  // Get top 3 recommendations
  const top3 = characters.slice(0, 3).map(c => c.name);
  
  return `${top3[0]} > ${top3[1]} > ${top3[2]}`;
}

export function getScalingColor(value: number, allValues: number[]): string {
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min;
  
  if (range === 0) return '#FFD700'; // All same value
  
  const normalized = (value - min) / range;
  
  // Color gradient from red (low) to yellow (medium) to green (high)
  if (normalized < 0.33) {
    return '#FF4444'; // Red
  } else if (normalized < 0.67) {
    return '#FFD700'; // Yellow
  } else {
    return '#44FF44'; // Green
  }
}