import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { WeaponScaling } from './weaponData';

export function loadWeaponDataSync(): WeaponScaling[] {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'slayworldkiller-numbers', 'weapon-attack-power.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const result = Papa.parse(csvContent, {
      header: false,
      skipEmptyLines: true
    });
    
    const weapons: WeaponScaling[] = [];
    const dataRows = result.data as string[][];
    
    // Find the header row
    let headerIndex = -1;
    for (let i = 0; i < dataRows.length; i++) {
      if (dataRows[i][0] === 'Weapon') {
        headerIndex = i;
        break;
      }
    }
    
    if (headerIndex === -1) return weapons;
    
    // Parse weapon data starting from the row after the header
    for (let i = headerIndex + 1; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row[0] || row[0].trim() === '') continue;
      
      // Extract weapon name and status effect
      const weaponFullName = row[0];
      const statusMatch = weaponFullName.match(/;\s*(\d+\s*\w+)/);
      const weaponName = weaponFullName.replace(/;\s*\d+\s*\w+/, '').trim();
      const hasStatus = statusMatch ? statusMatch[1] : undefined;
      
      const weapon: WeaponScaling = {
        weapon: weaponName,
        wylder: parseInt(row[1]) || 0,
        guardian: parseInt(row[2]) || 0,
        ironeye: parseInt(row[3]) || 0,
        duchess: parseInt(row[4]) || 0,
        raider: parseInt(row[5]) || 0,
        revenant: parseInt(row[6]) || 0,
        recluse: parseInt(row[7]) || 0,
        executor: parseInt(row[8]) || 0,
        hasStatus
      };
      
      weapons.push(weapon);
    }
    
    return weapons;
  } catch (error) {
    console.error('Error loading weapon data:', error);
    return [];
  }
}