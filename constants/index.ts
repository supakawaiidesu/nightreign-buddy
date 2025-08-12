import { CirclePhase, Boss } from "@/types";
import { loadBossDataSync } from "@/utils/loadBossData";

export const DAY_PHASES: CirclePhase[] = [
  { name: "Exploration", duration: 270, warning: 30, type: "exploration" },
  { name: "Circle 1 Closing", duration: 180, warning: 30, type: "closing" },
  { name: "Between Circles", duration: 210, warning: 30, type: "exploration" },
  { name: "Circle 2 Closing", duration: 180, warning: 30, type: "closing" },
];

const CSV_CONTENT = `Name,,ID,Health,,Phys Dmg Neg,,Strike Dmg Neg,,Slash Dmg Neg,,Pierce Dmg Neg,,Magic Dmg Neg,,Fire Dmg Neg,,Ltng Dmg Neg	,,Holy Dmg Neg,,,Poison Resist,Rot Resist,Bleed Resist,Frost Resist,Sleep Resist,Madness Resist,Blight Resist,Poise
"Gladius, Beast of Night",,75000020,11328,,100,0,100,0,100,0,100,-10,100,0,100,50,100,0,100,-35,,542,252,252,542,154,Immune,Immune,120
"Adel, Baron of Night",,75100020,13140,,100,0,100,0,100,0,100,0,100,0,100,20,100,50,100,0,,154,154,542,154,154,Immune,Immune,150
"Gnoster, Wisdom of Night (Moth)",,75200020,13027,,100,-15,100,-15,100,-25,100,-25,100,50,100,-40,100,10,100,10,,542,154,154,154,542,Immune,Immune,100
"Gnoster, Wisdom of Night (Pest)",,75300020,13027,,100,10,100,-20,100,20,100,-10,100,10,100,-35,100,10,100,10,,252,154,154,154,154,Immune,Immune,150
"Maris, Fathom of Night",,75400020,12687,,100,0,100,20,100,-15,100,10,100,20,100,50,100,-40,100,15,,Immune,252,Immune,252,Immune,Immune,Immune,150
"Libra, Creature of Night",,75610010,13048,,100,0,100,0,100,-10,100,0,100,20,100,-20,100,0,100,-35,,154,154,252,252,Immune,154,Immune,120
"Fulghor, Champion of Nightglow",,76000010,11894,,100,0,100,0,100,0,100,0,100,0,100,0,100,-20,100,30,,154,154,154,154,154,Immune,Immune,155
"Caligo, Miasma of Night",,49000010,12008,,100,0,100,-15,100,15,100,10,100,20,100,-35,100,20,100,20,,252,252,252,542,542,Immune,Immune,160
The Shape of Night,,75800010,4985,,100,0,100,10,100,-15,100,-10,100,0,100,-20,100,0,100,-35,,Immune,252,Immune,Immune,542,Immune,Immune,130
Heolstor the Nightlord,,75802010,10196,,100,0,100,-10,100,10,100,-15,100,0,100,0,100,-20,100,-30,,Immune,252,Immune,Immune,542,Immune,Immune,130`;

export const BOSSES: Boss[] = loadBossDataSync(CSV_CONTENT);

export const WARNING_TIME_OPTIONS = [10, 20, 30, 60, 90];