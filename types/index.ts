export type CirclePhase = {
  name: string;
  duration: number; // in seconds
  warning: number; // warning time before end in seconds
  type: "exploration" | "closing";
};

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