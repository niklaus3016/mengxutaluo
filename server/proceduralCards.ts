import { tarotCards } from '../src/data/tarot';

export function getProceduralCardSvg(id: string, isThumb: boolean = false): string {
  const card = tarotCards.find(c => c.id === id.toLowerCase());
  
  // High-contrast, mysterious celestial theme colors based on suit
  let suitLabel = '大阿卡那';
  let primaryColor = '#7f5af0'; // purple
  let accentColor = '#9d4edd'; 
  let gradientStart = '#161129'; // dark purple-blue
  let gradientEnd = '#0b0816';
  let motifSvg = '';
  
  // Parse card properties or default
  const isMajor = id.startsWith('m');
  const isWands = id.startsWith('w');
  const isCups = id.startsWith('c');
  const isSwords = id.startsWith('s');
  const isPentacles = id.startsWith('p');

  if (isWands) {
    suitLabel = '权杖 (火)';
    primaryColor = '#e65c00'; // orange
    accentColor = '#f9d423';
    gradientStart = '#241005';
    gradientEnd = '#0d0502';
    motifSvg = `
      <!-- Halo -->
      <circle r="40" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.4"/>
      <!-- Two crossed wands -->
      <g stroke="url(#goldGrad)" stroke-linecap="round" fill="none">
        <line x1="-32" y1="32" x2="32" y2="-32" stroke-width="3.5"/>
        <line x1="-32" y1="-32" x2="32" y2="32" stroke-width="3.5"/>
      </g>
      <!-- Flame/stars spark -->
      <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffe066"/>
      <circle cx="0" cy="-44" r="2" fill="#ffe066" opacity="0.8"/>
      <circle cx="-44" cy="0" r="2" fill="#ffe066" opacity="0.8"/>
      <circle cx="44" cy="0" r="2" fill="#ffe066" opacity="0.8"/>
      <circle cx="0" cy="44" r="2" fill="#ffe066" opacity="0.8"/>
    `;
  } else if (isCups) {
    suitLabel = '圣杯 (水)';
    primaryColor = '#00b4db'; // cyan
    accentColor = '#0083b0';
    gradientStart = '#061626';
    gradientEnd = '#020912';
    motifSvg = `
      <!-- Halo behind cup -->
      <circle r="40" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.4"/>
      <!-- Water ripples -->
      <path d="M-30,26 Q-15,22 0,26 T30,26" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.6"/>
      <path d="M-20,34 Q-10,31 0,34 T20,34" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.4"/>
      <!-- Chalice -->
      <path d="M-18,-20 L18,-20 C18,-20 22,0 15,12 C8,21 -8,21 -15,12 C-22,0 -18,-20 -18,-20 Z" fill="url(#goldGrad)" opacity="0.85"/>
      <path d="M0,17 L0,26" stroke="url(#goldGrad)" stroke-width="2.5"/>
      <path d="M-10,26 L10,26" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Steaming waves -->
      <path d="M-6,-26 Q-3,-32 0,-26 T6,-26" fill="none" stroke="#ffe066" stroke-width="1" opacity="0.7"/>
    `;
  } else if (isSwords) {
    suitLabel = '宝剑 (风)';
    primaryColor = '#a8c0ff'; // sky blue/silver
    accentColor = '#3f2b96';
    gradientStart = '#121921';
    gradientEnd = '#070a0e';
    motifSvg = `
      <!-- Radiant arc -->
      <path d="M -40,10 Q 0,-30 40,10" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.4"/>
      <circle r="35" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.3" stroke-dasharray="3,3"/>
      <!-- Sword -->
      <g stroke="url(#goldGrad)" fill="none">
        <path d="M 0,-45 L 4,-35 L 3,12 L -3,12 L -4,-35 Z" fill="url(#goldGrad)" stroke-width="1" opacity="0.9"/>
        <line x1="0" y1="-43" x2="0" y2="12" stroke-width="0.8" opacity="0.6"/>
        <line x1="-15" y1="12" x2="15" y2="12" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="0" y1="12" x2="0" y2="28" stroke-width="2.5"/>
        <circle cx="0" cy="31" r="3" fill="url(#goldGrad)"/>
      </g>
    `;
  } else if (isPentacles) {
    suitLabel = '星币 (土)';
    primaryColor = '#11998e'; // emerald/green
    accentColor = '#38ef7d';
    gradientStart = '#071c10';
    gradientEnd = '#020a06';
    motifSvg = `
      <!-- Double coin border -->
      <circle r="40" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
      <circle r="34" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" stroke-dasharray="4,2" opacity="0.5"/>
      <!-- Inner Pentagram -->
      <polygon points="
        0,-30 
        8,-9 
        28,-9 
        12,3 
        18,23 
        0,10 
        -18,23 
        -12,3 
        -28,-9 
        -8,-9" 
        fill="none" 
        stroke="url(#goldGrad)" 
        stroke-width="2" 
        stroke-linejoin="round"
      />
      <circle r="4" fill="url(#goldGrad)"/>
    `;
  } else {
    // Major Arcana cosmic eye
    motifSvg = `
      <!-- Glowing circles -->
      <circle r="45" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.3" stroke-dasharray="8,4"/>
      <circle r="36" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.5"/>
      <!-- Star rays -->
      <g opacity="0.5">
        <line x1="0" y1="-55" x2="0" y2="-48" stroke="url(#goldGrad)" stroke-width="1"/>
        <line x1="0" y1="48" x2="0" y2="55" stroke="url(#goldGrad)" stroke-width="1"/>
        <line x1="-55" y1="0" x2="-48" y2="0" stroke="url(#goldGrad)" stroke-width="1"/>
        <line x1="48" y1="0" x2="55" y2="0" stroke="url(#goldGrad)" stroke-width="1"/>
      </g>
      <!-- Merged Crescent & Eye shape -->
      <path d="M-15,-15 A 24,24 0 0,0 15,20 A 19,19 0 1,1 -15,-15 Z" fill="url(#goldGrad)" opacity="0.9"/>
      <!-- Star center -->
      <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#ffffff" opacity="0.9"/>
    `;
  }

  // Get card descriptive metadata
  const fallbackChineseName = card ? card.name : '神秘卡牌';
  const fallbackEnglishName = card ? card.id.toUpperCase() : id.toUpperCase();
  
  const chineseName = fallbackChineseName.split(' ')[0] || fallbackChineseName;
  const englishName = (card ? card.name.split('(')[1]?.replace(')', '') : '').trim() || fallbackEnglishName;

  // Render SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="100%" height="100%">
    <defs>
      <!-- Premium background gradient -->
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
      
      <!-- Gold Foil Gradient -->
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f3e092" />
        <stop offset="30%" stop-color="#d4af37" />
        <stop offset="70%" stop-color="#b08d24" />
        <stop offset="100%" stop-color="#f3e092" />
      </linearGradient>
      
      <!-- Subtle Radial Glow for central motif -->
      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="${isThumb ? '0.1' : '0.25'}" />
        <stop offset="100%" stop-color="${gradientEnd}" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Base rect -->
    <rect width="100%" height="100%" fill="url(#cardGrad)" rx="24" stroke="url(#goldGrad)" stroke-width="2.5" />
    
    <!-- Outer delicate inset outline -->
    <rect x="8" y="8" width="284" height="434" rx="18" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.4" />
    
    <!-- Dotted inner ritual rectangle -->
    <rect x="14" y="14" width="272" height="422" rx="14" fill="none" stroke="url(#goldGrad)" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.3" />
    
    <!-- Corner Astrological Symbols / Markers -->
    <circle cx="20" cy="20" r="1.5" fill="#f3e092" opacity="0.7"/>
    <circle cx="280" cy="20" r="1.5" fill="#f3e092" opacity="0.7"/>
    <circle cx="20" cy="430" r="1.5" fill="#f3e092" opacity="0.7"/>
    <circle cx="280" cy="430" r="1.5" fill="#f3e092" opacity="0.7"/>

    <!-- Dynamic Suit Badge top center -->
    ${!isThumb ? `
    <g transform="translate(150, 24)">
      <rect x="-35" y="-10" width="70" height="15" rx="7.5" fill="#000000" fill-opacity="0.2" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.6" />
      <text font-family="'Inter', sans-serif" font-size="8" fill="#f3e092" text-anchor="middle" letter-spacing="1" y="0">${suitLabel}</text>
    </g>
    ` : ''}

    <!-- Central Glow behind motif -->
    <circle cx="150" cy="180" r="80" fill="url(#centerGlow)" />

    <!-- Center Motifs representing the Tarot Suit -->
    <g transform="translate(0, 20)">
      ${motifSvg}
    </g>

    <!-- Card Texts (hidden or simplified if thumbnail to optimize size) -->
    ${!isThumb ? `
    <!-- Ornamental separator line -->
    <line x1="80" y1="340" x2="220" y2="340" stroke="url(#goldGrad)" stroke-width="0.6" opacity="0.3" />
    <circle cx="150" cy="340" r="2.5" fill="#f3e092" />
    
    <!-- Chinese Name -->
    <text x="150" y="375" font-family="'Playfair Display', 'STSong', serif" font-weight="bold" font-size="20" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="4">
      ${chineseName}
    </text>
    
    <!-- English Name -->
    <text x="150" y="398" font-family="'Inter', sans-serif" font-size="8.5" fill="#ffffff" fill-opacity="0.4" text-anchor="middle" letter-spacing="2">
      ${englishName.toUpperCase()}
    </text>
    
    <!-- Footer ritual glyph -->
    <g transform="translate(150, 418) scale(0.6)">
      <circle r="4" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.5"/>
      <line x1="-10" y1="0" x2="10" y2="0" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.5" />
    </g>
    ` : `
    <!-- Tiny/Thumb Name -->
    <text x="150" y="380" font-family="'Playfair Display', serif" font-weight="bold" font-size="24" fill="url(#goldGrad)" text-anchor="middle">
      ${chineseName}
    </text>
    `}
  </svg>`;
}
