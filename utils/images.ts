export const getImagePath = (type: string): string => {
  const imageMap: { [key: string]: string } = {
    // Damage types
    physical: '/images/standard.png',
    strike: '/images/strike.png',
    slash: '/images/slash.png',
    pierce: '/images/pierce.png',
    magic: '/images/magic.png',
    fire: '/images/fire.png',
    lightning: '/images/lightning.png',
    holy: '/images/holy.png',
    // Status effects
    poison: '/images/poison.png',
    rot: '/images/rot.png',
    bleed: '/images/bloodloss.png',
    frost: '/images/frostbite.png',
    sleep: '/images/sleep.png',
    madness: '/images/madness.png',
    blight: '/images/deathblight.png',
  };
  
  return imageMap[type.toLowerCase()] || `/images/${type.toLowerCase()}.png`;
};