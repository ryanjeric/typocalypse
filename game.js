(() => {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // --- Theme system ---

  const THEMES = {
    dark: {
      bg: '#0a0a0f',
      gridR: 0, gridG: 240, gridB: 255,
      accent: '#00f0ff',
      textDim: 'rgba(255,255,255,0.7)',
      wordTyped: '#4ade80',
      wordTarget: '#ffffff',
    },
    light: {
      bg: '#d9d5d0',
      gridR: 50, gridG: 90, gridB: 170,
      accent: '#2563eb',
      textDim: 'rgba(20,20,40,0.7)',
      wordTyped: '#16a34a',
      wordTarget: '#1a1a2e',
    },
    neon: {
      bg: '#0d0d14',
      gridR: 255, gridG: 0, gridB: 255,
      accent: '#ff00ff',
      textDim: 'rgba(255,100,255,0.8)',
      wordTyped: '#00ff88',
      wordTarget: '#ffffff',
    },
    retro: {
      bg: '#1a1a2e',
      gridR: 255, gridG: 200, gridB: 0,
      accent: '#ffc800',
      textDim: 'rgba(255,220,100,0.8)',
      wordTyped: '#00ff00',
      wordTarget: '#ffff00',
    },
    minimal: {
      bg: '#0f0f0f',
      gridR: 80, gridG: 80, gridB: 80,
      accent: '#ffffff',
      textDim: 'rgba(255,255,255,0.5)',
      wordTyped: '#888888',
      wordTarget: '#ffffff',
    },
    matrix: {
      bg: '#0a0a0a',
      gridR: 0, gridG: 255, gridB: 100,
      accent: '#00ff64',
      textDim: 'rgba(0,255,100,0.7)',
      wordTyped: '#00ff64',
      wordTarget: '#ffffff',
    },
    terminal: {
      bg: '#1e1e1e',
      gridR: 0, gridG: 255, gridB: 135,
      accent: '#00ff87',
      textDim: 'rgba(0,255,135,0.8)',
      wordTyped: '#00ff87',
      wordTarget: '#ffff00',
    },
    solar: {
      bg: '#1a0f00',
      gridR: 255, gridG: 120, gridB: 0,
      accent: '#ff8800',
      textDim: 'rgba(255,170,0,0.8)',
      wordTyped: '#ffaa00',
      wordTarget: '#fff5e6',
    },
  };

  const THEME_ORDER = ['dark', 'light', 'neon', 'retro', 'minimal', 'matrix', 'terminal', 'solar'];

  let currentTheme = 'dark';
  let particleDensity = 1;

  function getParticleDensity() {
    if (typeof reducedMotion !== 'undefined' && reducedMotion) return 0.1;
    return particleDensity;
  }

  function setParticleDensity(val) {
    particleDensity = val;
    localStorage.setItem('typocalypse-particle-density', String(val));
  }

  function loadParticleDensity() {
    const saved = localStorage.getItem('typocalypse-particle-density');
    if (saved === '0.33' || saved === '0.66' || saved === '1') particleDensity = parseFloat(saved);
  }

  let soundMuted = false;
  let soundVolume = 1;

  function getSoundVolume() {
    return soundMuted ? 0 : soundVolume;
  }

  function setSoundMuted(val) {
    soundMuted = !!val;
    localStorage.setItem('typocalypse-sound-muted', soundMuted ? '1' : '0');
  }

  function setSoundVolume(val) {
    soundVolume = Math.max(0, Math.min(1, val));
    localStorage.setItem('typocalypse-sound-volume', String(soundVolume));
  }

  function loadSoundSettings() {
    const muted = localStorage.getItem('typocalypse-sound-muted');
    if (muted === '1' || muted === '0') soundMuted = muted === '1';
    const vol = parseFloat(localStorage.getItem('typocalypse-sound-volume'));
    if (!isNaN(vol) && vol >= 0 && vol <= 1) soundVolume = vol;
  }

  let colorblindMode = false;
  let fontSizeMode = 'medium';
  let reducedMotion = false;

  function setColorblindMode(val) {
    colorblindMode = !!val;
    document.body.classList.toggle('colorblind-mode', colorblindMode);
    localStorage.setItem('typocalypse-colorblind', colorblindMode ? '1' : '0');
  }

  function setFontSizeMode(mode) {
    fontSizeMode = ['small', 'medium', 'large'].includes(mode) ? mode : 'medium';
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add('font-' + fontSizeMode);
    localStorage.setItem('typocalypse-font-size', fontSizeMode);
  }

  function setReducedMotion(val) {
    reducedMotion = !!val;
    document.body.classList.toggle('reduced-motion', reducedMotion);
    localStorage.setItem('typocalypse-reduced-motion', reducedMotion ? '1' : '0');
  }

  function loadAccessibilitySettings() {
    const cb = localStorage.getItem('typocalypse-colorblind');
    if (cb === '1' || cb === '0') setColorblindMode(cb === '1');
    const fs = localStorage.getItem('typocalypse-font-size');
    if (['small', 'medium', 'large'].includes(fs)) setFontSizeMode(fs);
    const rm = localStorage.getItem('typocalypse-reduced-motion');
    if (rm === '1' || rm === '0') setReducedMotion(rm === '1');
  }

  function getTheme() {
    return THEMES[currentTheme];
  }

  function applyTheme(name) {
    currentTheme = name;
    document.body.classList.remove('light-mode', 'neon-mode', 'retro-mode', 'minimal-mode', 'matrix-mode', 'terminal-mode', 'solar-mode');
    if (name !== 'dark') document.body.classList.add(name + '-mode');
    localStorage.setItem('typocalypse-theme', name);
    updateThemeButtons();
  }

  function updateThemeButtons() {
    const label = currentTheme.toUpperCase().replace(/-/g, ' ') + ' MODE';
    if (dom.themeBtn) dom.themeBtn.textContent = label;
    if (dom.themeToggleHud) dom.themeToggleHud.textContent = label;
  }

  function cycleTheme() {
    const idx = THEME_ORDER.indexOf(currentTheme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    applyTheme(next);
  }

  function loadTheme() {
    const saved = localStorage.getItem('typocalypse-theme');
    if (THEME_ORDER.includes(saved)) {
      applyTheme(saved);
    }
  }

  // --- Word pools ---

  const WORDS_EASY = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did',
    'let', 'say', 'she', 'too', 'use', 'run', 'fly', 'big', 'try', 'ask',
    'own', 'put', 'red', 'set', 'top', 'far', 'hot', 'end', 'act', 'air',
    'fire', 'code', 'data', 'wave', 'node', 'dark', 'glow', 'byte', 'hack',
    'grid', 'core', 'flux', 'beam', 'void', 'zero', 'echo', 'bolt', 'fuse',
    'link', 'sync', 'ping', 'loop', 'port', 'scan', 'chip', 'wire', 'disk',
  ];

  const WORDS_MEDIUM = [
    'about', 'other', 'which', 'their', 'there', 'first', 'would', 'these',
    'click', 'money', 'after', 'think', 'could', 'great', 'where', 'right',
    'still', 'world', 'every', 'found', 'under', 'power', 'going', 'light',
    'might', 'never', 'those', 'place', 'point', 'heart', 'small', 'night',
    'spell', 'storm', 'laser', 'cyber', 'nexus', 'pixel', 'sigma', 'delta',
    'omega', 'alpha', 'gamma', 'proxy', 'debug', 'crypt', 'titan', 'venom',
    'blaze', 'pulse', 'orbit', 'surge', 'prism', 'shard', 'glint', 'ember',
    'input', 'drift', 'solar', 'chaos', 'frost', 'blade', 'rapid', 'swift',
    'vigor', 'xenon', 'quark', 'force', 'flare', 'armor', 'burst', 'crash',
  ];

  const WORDS_HARD = [
    'system', 'before', 'should', 'change', 'global', 'people', 'better',
    'during', 'around', 'energy', 'enough', 'always', 'number', 'market',
    'future', 'return', 'strong', 'leader', 'stream', 'search', 'matrix',
    'vector', 'cipher', 'binary', 'plasma', 'photon', 'fusion', 'turret',
    'shield', 'signal', 'switch', 'neural', 'vortex', 'garnet', 'zenith',
    'inferno', 'quantum', 'decrypt', 'firewall', 'program', 'spectra',
    'reactor', 'voltage', 'anomaly', 'paradox', 'eclipse', 'nebula',
    'terminal', 'protocol', 'override', 'catalyst', 'particle', 'electron',
    'sequence', 'sentinel', 'hologram', 'symbiote', 'spectrum', 'dynamite',
    'labyrinth', 'algorithm', 'supernova', 'magnetron', 'cybernetic',
  ];

  const GAME_MODES = {
    endless: { label: 'ENDLESS', desc: 'Standard mode', color: '#00f0ff' },
    relaxed: { label: 'RELAXED', desc: 'Slower combo decay', color: '#4ade80' },
    typist: { label: 'TYPIST', desc: 'WPM/accuracy focus', color: '#a78bfa' },
    daily: { label: 'DAILY', desc: 'Fixed seed, double damage, half HP', color: '#f59e0b' },
  };

  function getDailySeed() {
    return new Date().toDateString();
  }

  function seededRandom(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i) | 0;
    return () => {
      h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
      h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
  }

  const DIFFICULTY_PRESETS = {
    easy:   { hpMult: 0.7, speedMult: 0.8, spawnMult: 1.3, wordShift: -1, label: 'EASY', color: '#4ade80' },
    normal: { hpMult: 1.0, speedMult: 1.0, spawnMult: 1.0, wordShift: 0,  label: 'NORMAL', color: '#fbbf24' },
    hard:   { hpMult: 1.5, speedMult: 1.2, spawnMult: 0.9, wordShift: 1,  label: 'HARD', color: '#ef4444' },
  };

  const WORDS_BOSS = [
    'catastrophe', 'annihilation', 'obliteration', 'dimensional',
    'transcendent', 'unstoppable', 'electromagnetic', 'pandemonium',
    'apocalyptic', 'cataclysmic', 'overwhelming', 'devastation',
  ];

  const WORDS_SHIELD = [
    'unlock', 'breach', 'dispel', 'shatter', 'invoke', 'purge', 'decode',
  ];

  // --- Power-up drop definitions ---

  const POWER_DROP_TYPES = {
    nuke: {
      icon: '\u2622',
      color: '#ef4444',
      words: ['detonate', 'obliterate', 'annihilate', 'eradicate', 'demolish'],
      label: 'NUKE',
      duration: 0,
    },
    freeze: {
      icon: '\u2744',
      color: '#67e8f9',
      words: ['absolute', 'icetime', 'cryogen', 'subzero', 'permafrost'],
      label: 'FREEZE',
      duration: 5,
    },
    bomb: {
      icon: '\u{1F4A3}',
      color: '#f97316',
      words: ['ignite', 'bombard', 'combust', 'napalm', 'volatile'],
      label: 'BOMB MODE',
      duration: 10,
    },
    slow: {
      icon: '\u{1F40C}',
      color: '#a78bfa',
      words: ['hinder', 'impede', 'encumber', 'sluggish', 'languish'],
      label: 'SLOW FIELD',
      duration: 5,
    },
    shield: {
      icon: '\u{1F6E1}',
      color: '#22d3ee',
      words: ['barrier', 'protect', 'bulwark', 'bastion', 'rampart'],
      label: 'SHIELD x3',
      duration: 0,
    },
    heal: {
      icon: '\u{2764}',
      color: '#4ade80',
      words: ['restore', 'mending', 'vitality', 'renewal', 'rejuven'],
      label: 'HEAL +40',
      duration: 0,
    },
    double: {
      icon: '\u{2B06}',
      color: '#fbbf24',
      words: ['amplify', 'empower', 'maximize', 'intensify', 'overdrive'],
      label: 'DOUBLE DMG',
      duration: 10,
    },
  };

  const POWER_DROP_KEYS = Object.keys(POWER_DROP_TYPES);

  // --- Augmentation types (lootable + wave clear) ---

  const AUGMENTATION_TYPES = {
    toxicBurn: {
      id: 'toxicBurn',
      icon: '\u2620',
      color: '#4ade80',
      words: ['corrode', 'venomous', 'caustic', 'toxin', 'plague'],
      label: 'TOXIC BURN',
      desc: '+20% venom pool damage',
      weapon: 'venom',
      apply: makeApply((s) => { s.venomDotMult = (s.venomDotMult || 1) * 1.2; }),
    },
    droneBoost: {
      id: 'droneBoost',
      icon: '\u{1F916}',
      color: '#00f0ff',
      words: ['drone', 'autopilot', 'sentinel', 'automate', 'patrol'],
      label: 'DRONE BOOST',
      desc: '+1 drone, faster fire',
      apply: makeApply((s) => { s.autoTyperCount = Math.min(2, (s.autoTyperCount || 0) + 1); s.droneFireRate = (s.droneFireRate || 1) * 1.3; }),
    },
    kineticPush: {
      id: 'kineticPush',
      icon: '\u{1F4A5}',
      color: '#f59e0b',
      words: ['impact', 'momentum', 'thrust', 'repel', 'launch'],
      label: 'KINETIC PUSH',
      desc: '+15 knockback',
      apply: makeApply((s) => { s.knockbackForce += 15; }),
    },
    arcSurgeAug: {
      id: 'arcSurgeAug',
      icon: '\u26A1',
      color: '#a78bfa',
      words: ['surge', 'voltage', 'static', 'charge', 'spark'],
      label: 'ARC SURGE',
      desc: '+25% arc chain damage',
      weapon: 'arc',
      apply: makeApply((s) => { s.arcChainDamageMult = (s.arcChainDamageMult || 0.5) + 0.25; }),
    },
    incendiary: {
      id: 'incendiary',
      icon: '\u{1F525}',
      color: '#ef4444',
      words: ['ignite', 'blaze', 'ember', 'inferno', 'scorch'],
      label: 'INCENDIARY',
      desc: 'Shrapnel leaves fire trail',
      weapon: 'shrapnel',
      apply: makeApply((s) => { s.shrapnelFireTrail = true; }),
    },
    cryoRounds: {
      id: 'cryoRounds',
      icon: '\u2744',
      color: '#67e8f9',
      words: ['frost', 'chill', 'glacier', 'cryo', 'freeze'],
      label: 'CRYO ROUNDS',
      desc: '5% chance to slow on hit',
      apply: makeApply((s) => { s.cryoChance = (s.cryoChance || 0) + 0.05; }),
    },
    precisionBarrel: {
      id: 'precisionBarrel',
      icon: '\u2694',
      color: '#fbbf24',
      words: ['calibrate', 'accurate', 'barrel', 'rifled', 'bore'],
      label: 'PRECISION BARREL',
      desc: '+10% damage (all weapons)',
      apply: makeApply((s) => { s.damageMultiplier *= 1.1; }),
    },
    targetLock: {
      id: 'targetLock',
      icon: '\u{1F3AF}',
      color: '#38bdf8',
      words: ['lock', 'focus', 'mark', 'sight', 'track'],
      label: 'TARGET LOCK',
      desc: '+5% click/tab crit chance, +0.5x mult',
      apply: makeApply((s) => {
        s.clickTargetCritChance = (s.clickTargetCritChance ?? 0.1) + 0.05;
        s.clickTargetCritMult = (s.clickTargetCritMult ?? 2) + 0.5;
      }),
    },
    orbitingOrb: {
      id: 'orbitingOrb',
      icon: '\u{1F4AB}',
      color: '#a78bfa',
      words: ['orbit', 'orb', 'sphere', 'rotate', 'cycle'],
      label: 'ORBITING ORB',
      desc: 'An orb orbits you, damaging enemies on contact',
      apply: makeApply((s) => { s.orbCount = Math.min(2, (s.orbCount || 0) + 1); }),
    },
    spectre: {
      id: 'spectre',
      icon: '\u{1F47B}',
      color: '#c084fc',
      words: ['spectre', 'phantom', 'ghost', 'spirit', 'wraith'],
      label: 'SPECTRE',
      desc: 'Words with a/e/o spawn melee drones (count = letters matched)',
      apply: makeApply((s) => { s.spectreEnabled = true; }),
    },
    minefield: {
      id: 'minefield',
      icon: '\u{1F4A3}',
      color: '#f59e0b',
      words: ['mine', 'field', 'trap', 'explosive', 'detonate'],
      label: 'MINEFIELD',
      desc: 'Words starting with f/g/h/i spawn mines that explode on contact',
      apply: makeApply((s) => { s.minefieldEnabled = true; }),
    },
    meteor: {
      id: 'meteor',
      icon: '\u2604',
      color: '#ef4444',
      words: ['meteor', 'strike', 'orbital', 'bombard', 'impact'],
      label: 'METEOR',
      desc: 'Periodically spawns markers; type the word to trigger orbital strike',
      apply: makeApply((s) => { s.meteorEnabled = true; s.meteorTimer = 0; }),
    },
  };

  const AUGMENTATION_KEYS = Object.keys(AUGMENTATION_TYPES);

  // --- Weapon definitions ---

  const WEAPONS = {
    bolt: {
      id: 'bolt',
      name: 'BOLT CASTER',
      icon: '\u{1F529}',
      color: '#00f0ff',
      desc: 'Fires a precise energy bolt at the target. Fast and reliable — your WPM is your fire rate.',
      mechanic: 'Direct hit · Single target',
      turretStyle: 'default',
    },
    arc: {
      id: 'arc',
      name: 'ARC BEAM',
      icon: '\u26A1',
      color: '#a78bfa',
      desc: 'Emits a sustained lightning beam that chains to nearby enemies for 50% splash damage.',
      mechanic: 'Chain lightning · 2 bounces',
      turretStyle: 'arc',
    },
    shrapnel: {
      id: 'shrapnel',
      name: 'SHRAPNEL CANNON',
      icon: '\u{1F4A5}',
      color: '#f59e0b',
      desc: 'Fires a burst of 5 fragments in a wide cone. Devastating against clusters of enemies.',
      mechanic: 'Cone spread · 5 fragments',
      turretStyle: 'shrapnel',
    },
    venom: {
      id: 'venom',
      name: 'VENOM SPITTER',
      icon: '\u2620',
      color: '#4ade80',
      desc: 'Lobs a toxic glob that creates a poison pool on impact. Enemies in the pool take damage over time.',
      mechanic: 'Area denial · DOT pool 4s',
      turretStyle: 'venom',
    },
    pulse: {
      id: 'pulse',
      name: 'PULSE NOVA',
      icon: '\u{1F4AB}',
      color: '#f472b6',
      desc: 'Releases an expanding shockwave from the player. Closer enemies take more damage. No projectile needed.',
      mechanic: 'AOE ring · No projectile',
      turretStyle: 'pulse',
    },
    ricochet: {
      id: 'ricochet',
      name: 'RICOCHET DISC',
      icon: '\u{1F4BF}',
      color: '#fbbf24',
      desc: 'Fires a ricocheting disc that bounces between up to 3 enemies. Each bounce deals 70% damage.',
      mechanic: 'Bouncing · 3 ricochets',
      turretStyle: 'ricochet',
    },
  };

  const WEAPON_KEYS = Object.keys(WEAPONS);

  const WEAPON_UNLOCKS = {
    bolt: null,
    arc: { type: 'achievement', id: 'wave5' },
    shrapnel: { type: 'achievement', id: 'wave8' },
    venom: { type: 'achievement', id: 'wave10' },
    pulse: { type: 'achievement', id: 'comboKing' },
    ricochet: { type: 'achievement', id: 'bossSlayer' },
  };

  function isWeaponUnlocked(weaponKey) {
    const u = WEAPON_UNLOCKS[weaponKey];
    if (!u) return true;
    const ls = loadLifetimeStats();
    const ach = loadAchievements();
    if (u.type === 'achievement') {
      if (u.id === 'wave5') return (ls.bestWave || 0) >= 5;
      if (u.id === 'wave8') return (ls.bestWave || 0) >= 8;
      if (u.id === 'wave10') return (ls.bestWave || 0) >= 10;
      if (u.id === 'comboKing') return !!ach.comboKing;
      if (u.id === 'bossSlayer') return !!ach.bossSlayer;
    }
    return false;
  }

  function getWeaponUnlockLabel(weaponKey) {
    const u = WEAPON_UNLOCKS[weaponKey];
    if (!u) return '';
    const labels = { wave5: 'Wave 5', wave8: 'Wave 8', wave10: 'Wave 10', comboKing: 'Combo King', bossSlayer: 'Boss Slayer' };
    return labels[u.id] || u.id;
  }

  // --- Streak titles ---

  const STREAK_TITLES = [
    { threshold: 10, text: 'UNSTOPPABLE', color: '#f472b6' },
    { threshold: 20, text: 'GODLIKE', color: '#fbbf24' },
    { threshold: 30, text: 'BEYOND MORTAL', color: '#ef4444' },
    { threshold: 50, text: 'TRANSCENDENT', color: '#a78bfa' },
    { threshold: 75, text: 'ASCENDED', color: '#00f0ff' },
    { threshold: 100, text: 'OMEGA TYPIST', color: '#ffffff' },
  ];

  // --- Weapon upgrade branches (level up) ---

  function makeApply(fn) { return (s) => fn(s); }

  const WEAPON_UPGRADE_BRANCHES = {
    bolt: {
      precision: [
        { id: 'boltPrecision1', icon: '\u2694', name: 'PRECISION BARREL', desc: '+15% damage', apply: makeApply((s) => { s.damageMultiplier *= 1.15; }) },
        { id: 'boltPrecision2', icon: '\u2694', name: 'CALIBRATED', desc: '+20% damage', apply: makeApply((s) => { s.damageMultiplier *= 1.2; }) },
        { id: 'boltPrecision3', icon: '\u2694', name: 'DEADEYE', desc: '+25% damage', apply: makeApply((s) => { s.damageMultiplier *= 1.25; }) },
      ],
      speed: [
        { id: 'boltSpeed1', icon: '\u26A1', name: 'QUICK BOLT', desc: '+25% projectile speed', apply: makeApply((s) => { s.projectileSpeed *= 1.25; }) },
        { id: 'boltSpeed2', icon: '\u26A1', name: 'LIGHTNING ROUNDS', desc: '+35% projectile speed', apply: makeApply((s) => { s.projectileSpeed *= 1.35; }) },
      ],
      multishot: [
        { id: 'boltMulti1', icon: '\u{1F52B}', name: 'DOUBLE TAP', desc: '+1 extra projectile on kill', apply: makeApply((s) => { s.extraProjectiles = Math.min(EXTRA_PROJECTILES_MAX, (s.extraProjectiles || 0) + 1); }) },
        { id: 'boltMulti2', icon: '\u{1F52B}', name: 'TRIPLE TAP', desc: '+2 extra projectiles on kill', apply: makeApply((s) => { s.extraProjectiles = Math.min(EXTRA_PROJECTILES_MAX, (s.extraProjectiles || 0) + 2); }) },
      ],
    },
    arc: {
      chain: [
        { id: 'arcChain', icon: '\u26A1', name: 'ARC EXTENSION', desc: '+50% chain range', apply: makeApply((s) => { s.arcChainRange = (s.arcChainRange || 1) * 1.5; }) },
        { id: 'arcBounces', icon: '\u26D3', name: 'CHAIN REACTOR', desc: '+1 chain bounce', apply: makeApply((s) => { s.arcChainBounces = (s.arcChainBounces || 0) + 1; }) },
        { id: 'arcChainMaster', icon: '\u26D3', name: 'CHAIN MASTER', desc: 'Chain deals 75% damage', apply: makeApply((s) => { s.arcChainDamageMult = (s.arcChainDamageMult || 0.5) + 0.25; }) },
      ],
      range: [
        { id: 'arcReach', icon: '\u2191', name: 'ARC REACH', desc: '+30% chain range', apply: makeApply((s) => { s.arcChainRange = (s.arcChainRange || 1) * 1.3; }) },
        { id: 'arcSpan', icon: '\u2191', name: 'ARC SPAN', desc: '+40% chain range', apply: makeApply((s) => { s.arcChainRange = (s.arcChainRange || 1) * 1.4; }) },
      ],
      power: [
        { id: 'arcSurge', icon: '\u26A1', name: 'ARC SURGE', desc: '+25% chain damage', apply: makeApply((s) => { s.arcChainDamageMult = (s.arcChainDamageMult || 0.5) + 0.25; }) },
        { id: 'arcOvercharge', icon: '\u26A1', name: 'OVERCHARGE', desc: '+40% chain damage', apply: makeApply((s) => { s.arcChainDamageMult = (s.arcChainDamageMult || 0.5) + 0.4; }) },
      ],
    },
    shrapnel: {
      shards: [
        { id: 'shrapnelShards', icon: '\u{1F4A5}', name: 'FRAGMENT BURST', desc: '+2 shards per shot', apply: makeApply((s) => { s.shrapnelCount = (s.shrapnelCount || 0) + 2; }) },
        { id: 'shrapnelShards2', icon: '\u{1F4A5}', name: 'SHRAPNEL RAIN', desc: '+3 shards per shot', apply: makeApply((s) => { s.shrapnelCount = (s.shrapnelCount || 0) + 3; }) },
      ],
      spread: [
        { id: 'shrapnelSpread', icon: '\u2194', name: 'WIDE CONE', desc: '+40% spread', apply: makeApply((s) => { s.shrapnelSpread = (s.shrapnelSpread || 1) * 1.4; }) },
        { id: 'shrapnelSpread2', icon: '\u2194', name: 'SCATTER', desc: '+60% spread', apply: makeApply((s) => { s.shrapnelSpread = (s.shrapnelSpread || 1) * 1.6; }) },
      ],
      damage: [
        { id: 'shrapnelDamage', icon: '\u2694', name: 'HEAVY FRAGMENTS', desc: '+30% shrapnel damage', apply: makeApply((s) => { s.shrapnelDamageMult = (s.shrapnelDamageMult || 1) * 1.3; }) },
        { id: 'shrapnelDamage2', icon: '\u2694', name: 'ARMOR PIERCING', desc: '+50% shrapnel damage', apply: makeApply((s) => { s.shrapnelDamageMult = (s.shrapnelDamageMult || 1) * 1.5; }) },
      ],
    },
    venom: {
      pool: [
        { id: 'venomPool', icon: '\u2620', name: 'TOXIC EXPANSION', desc: '+40% pool radius, +1s duration', apply: makeApply((s) => { s.venomPoolRadius = (s.venomPoolRadius || 1) * 1.4; s.venomPoolDuration = (s.venomPoolDuration || 0) + 1; }) },
        { id: 'venomPool2', icon: '\u2620', name: 'TOXIC FLOOD', desc: '+60% pool radius, +2s duration', apply: makeApply((s) => { s.venomPoolRadius = (s.venomPoolRadius || 1) * 1.6; s.venomPoolDuration = (s.venomPoolDuration || 0) + 2; }) },
      ],
      dot: [
        { id: 'venomDot', icon: '\u2620', name: 'CORROSIVE', desc: '+40% pool DOT', apply: makeApply((s) => { s.venomDotMult = (s.venomDotMult || 1) * 1.4; }) },
        { id: 'venomDot2', icon: '\u2620', name: 'VENOMOUS', desc: '+70% pool DOT', apply: makeApply((s) => { s.venomDotMult = (s.venomDotMult || 1) * 1.7; }) },
      ],
      radius: [
        { id: 'venomRadius', icon: '\u25CB', name: 'POOL EXPANSION', desc: '+35% pool radius', apply: makeApply((s) => { s.venomPoolRadius = (s.venomPoolRadius || 1) * 1.35; }) },
        { id: 'venomRadius2', icon: '\u25CB', name: 'TOXIC ZONE', desc: '+50% pool radius', apply: makeApply((s) => { s.venomPoolRadius = (s.venomPoolRadius || 1) * 1.5; }) },
      ],
    },
    pulse: {
      radius: [
        { id: 'pulseRadius', icon: '\u{1F4AB}', name: 'NOVA EXPANSION', desc: '+25% AOE radius', apply: makeApply((s) => { s.pulseRadius = (s.pulseRadius || 1) * 1.25; }) },
        { id: 'pulseRadius2', icon: '\u{1F4AB}', name: 'SUPERNOVA', desc: '+45% AOE radius', apply: makeApply((s) => { s.pulseRadius = (s.pulseRadius || 1) * 1.45; }) },
      ],
      damage: [
        { id: 'pulseDamage', icon: '\u2694', name: 'PULSE AMP', desc: '+20% pulse damage', apply: makeApply((s) => { s.pulseDamageMult = (s.pulseDamageMult || 1) * 1.2; }) },
        { id: 'pulseDamage2', icon: '\u2694', name: 'RESONANCE', desc: '+40% pulse damage', apply: makeApply((s) => { s.pulseDamageMult = (s.pulseDamageMult || 1) * 1.4; }) },
      ],
      speed: [
        { id: 'pulseSpeed', icon: '\u26A1', name: 'RAPID PULSE', desc: '+30% expansion speed', apply: makeApply((s) => { s.pulseSpeedMult = (s.pulseSpeedMult || 1) * 1.3; }) },
        { id: 'pulseSpeed2', icon: '\u26A1', name: 'INSTANT WAVE', desc: '+50% expansion speed', apply: makeApply((s) => { s.pulseSpeedMult = (s.pulseSpeedMult || 1) * 1.5; }) },
      ],
    },
    ricochet: {
      bounces: [
        { id: 'ricochetBounce', icon: '\u{1F4BF}', name: 'PINBALL', desc: '+1 ricochet', apply: makeApply((s) => { s.ricochetBounces = (s.ricochetBounces || 0) + 1; }) },
        { id: 'ricochetBounce2', icon: '\u{1F4BF}', name: 'MULTI-BOUNCE', desc: '+2 ricochets', apply: makeApply((s) => { s.ricochetBounces = (s.ricochetBounces || 0) + 2; }) },
      ],
      damage: [
        { id: 'ricochetDamage', icon: '\u2694', name: 'BOUNCE DAMAGE', desc: '+15% damage per bounce', apply: makeApply((s) => { s.ricochetBounceMult = (s.ricochetBounceMult || 0.7) + 0.15; }) },
        { id: 'ricochetDamage2', icon: '\u2694', name: 'CASCADE', desc: '+25% damage per bounce', apply: makeApply((s) => { s.ricochetBounceMult = (s.ricochetBounceMult || 0.7) + 0.25; }) },
      ],
      speed: [
        { id: 'ricochetSpeed', icon: '\u26A1', name: 'FAST DISC', desc: '+25% disc speed', apply: makeApply((s) => { s.projectileSpeed *= 1.25; }) },
        { id: 'ricochetSpeed2', icon: '\u26A1', name: 'LIGHTNING DISC', desc: '+40% disc speed', apply: makeApply((s) => { s.projectileSpeed *= 1.4; }) },
      ],
    },
  };

  // --- Wave clear choices (augmentations, power-ups, field upgrades) ---

  const WAVE_CLEAR_CHOICES = [
    ...Object.values(AUGMENTATION_TYPES).map((a) => ({ id: a.id, icon: a.icon, name: a.label, desc: a.desc || a.label, apply: (s) => { a.apply(s); s.augmentations.push(a.id); }, augmentation: true, weapon: a.weapon })),
    { id: 'damage', icon: '\u2694', name: 'SHARP KEYS', desc: '+30% damage per word', apply: makeApply((s) => { s.damageMultiplier *= 1.3; }) },
    { id: 'health', icon: '\u2665', name: 'SYSTEM REPAIR', desc: 'Restore 30 HP', apply: makeApply((s) => { s.hp = Math.min(s.maxHp, s.hp + 30); }) },
    { id: 'maxhp', icon: '\u2B50', name: 'UPGRADE HULL', desc: '+25 max HP', apply: makeApply((s) => { s.maxHp += 25; s.hp += 25; }) },
    { id: 'chain', icon: '\u26D3', name: 'CHAIN STRIKE', desc: 'Kills deal 15 damage to nearby enemies', apply: makeApply((s) => { s.chainDamage += 15; }) },
    { id: 'regen', icon: '\u2728', name: 'NANO REPAIR', desc: 'Regenerate 1 HP every 3 seconds', apply: makeApply((s) => { s.regenRate += 1; }) },
    { id: 'xp', icon: '\u2B06', name: 'DATA HARVEST', desc: '+25% score multiplier', apply: makeApply((s) => { s.scoreMultiplier *= 1.25; }) },
    { id: 'blast', icon: '\u{1F4A5}', name: 'SHOCKWAVE', desc: 'Kill explosions push enemies back', apply: makeApply((s) => { s.knockbackForce += 80; }) },
    { id: 'slow', icon: '\u2744', name: 'CRYO FIELD', desc: 'Enemies move 15% slower', apply: makeApply((s) => { s.enemySlowFactor = Math.max(ENEMY_SLOW_FLOOR, (s.enemySlowFactor || 1) * 0.85); }) },
    { id: 'critical', icon: '\u{1F3AF}', name: 'PRECISION', desc: '20% chance of double damage', apply: makeApply((s) => { s.critChance = Math.min(0.8, s.critChance + 0.2); }) },
    { id: 'magnet', icon: '\u{1F9F2}', name: 'WORD MAGNET', desc: 'Shorter words spawn more often', apply: makeApply((s) => { s.easyWordBias = Math.min(EASY_WORD_BIAS_MAX, (s.easyWordBias || 0) + 0.15); }) },
    { id: 'multishot', icon: '\u{1F52B}', name: 'MULTISHOT', desc: 'Fire 2 extra projectiles on kill', apply: makeApply((s) => { s.extraProjectiles = Math.min(EXTRA_PROJECTILES_MAX, (s.extraProjectiles || 0) + 2); }) },
    { id: 'autoTyper', icon: '\u{1F916}', name: 'TYPING DRONE', desc: 'A drone auto-types the nearest short word every 5s', apply: makeApply((s) => { s.autoTyperCount = Math.min(2, (s.autoTyperCount || 0) + 1); }) },
    { id: 'powerupHeal', icon: '\u{2764}', name: 'HEAL +40', desc: 'Instant heal', apply: makeApply((s) => { s.hp = Math.min(s.maxHp, s.hp + 40); }) },
    { id: 'powerupShield', icon: '\u{1F6E1}', name: 'SHIELD x3', desc: 'Gain 3 shield hits', apply: makeApply((s) => { s.shieldHits += 3; }) },
    { id: 'powerupFreeze', icon: '\u2744', name: 'FREEZE 5s', desc: 'Freeze all enemies 5s', apply: makeApply((s) => { s.freezeTimer = Math.max(s.freezeTimer || 0, 5); }) },
    { id: 'powerupDouble', icon: '\u{2B06}', name: 'DOUBLE DMG 10s', desc: '2x damage for 10s', apply: makeApply((s) => { s.doubleTimer = Math.max(s.doubleTimer || 0, 10); }) },
    { id: 'curseBerserk', curse: true, icon: '\u2694', name: 'CURSE: BERSERK', desc: '+50% damage, -20% max HP', apply: makeApply((s) => { s.damageMultiplier *= 1.5; s.maxHp = Math.max(50, Math.floor(s.maxHp * 0.8)); s.hp = Math.min(s.hp, s.maxHp); }) },
    { id: 'curseGlass', curse: true, icon: '\u{1F4A5}', name: 'CURSE: GLASS CANNON', desc: '+40% projectile speed, -15 HP', apply: makeApply((s) => { s.projectileSpeed *= 1.4; s.maxHp = Math.max(50, s.maxHp - 15); s.hp = Math.min(s.hp, s.maxHp); }) },
    { id: 'curseGreed', curse: true, icon: '\u{1F4B0}', name: 'CURSE: GREED', desc: '+50% score, enemies 20% faster', apply: makeApply((s) => { s.scoreMultiplier *= 1.5; s.enemySpeedCurse = (s.enemySpeedCurse || 1) * 1.2; }) },
    { id: 'curseFrenzy', curse: true, icon: '\u26A1', name: 'CURSE: FRENZY', desc: '+25% fire rate, -20% accuracy (longer words)', apply: makeApply((s) => { s.projectileSpeed *= 1.25; s.easyWordBias = (s.easyWordBias || 0) - 0.2; }) },
    { id: 'curseGambler', curse: true, icon: '\u{1F3B0}', name: 'CURSE: GAMBLER', desc: 'Random effect on each kill: heal, damage, or nothing', apply: makeApply((s) => { s.gamblerCurse = true; }) },
  ];

  // --- Legacy ALL_UPGRADES (kept for updateUpgradeBar compatibility) ---

  const ALL_UPGRADES = [
    { id: 'damage', icon: '\u2694', name: 'SHARP KEYS', desc: '+30% damage per word', apply: (s) => { s.damageMultiplier *= 1.3; } },
    { id: 'speed', icon: '\u26A1', name: 'QUICK FINGERS', desc: 'Projectiles travel 40% faster', apply: (s) => { s.projectileSpeed *= 1.4; } },
    { id: 'health', icon: '\u2665', name: 'SYSTEM REPAIR', desc: 'Restore 30 HP', apply: (s) => { s.hp = Math.min(s.maxHp, s.hp + 30); } },
    { id: 'maxhp', icon: '\u2B50', name: 'UPGRADE HULL', desc: '+25 max HP', apply: (s) => { s.maxHp += 25; s.hp += 25; } },
    { id: 'chain', icon: '\u26D3', name: 'CHAIN STRIKE', desc: 'Kills deal 15 damage to nearby enemies', apply: (s) => { s.chainDamage += 15; } },
    { id: 'regen', icon: '\u2728', name: 'NANO REPAIR', desc: 'Regenerate 1 HP every 3 seconds', apply: (s) => { s.regenRate += 1; } },
    { id: 'xp', icon: '\u2B06', name: 'DATA HARVEST', desc: '+25% score multiplier', apply: (s) => { s.scoreMultiplier *= 1.25; } },
    { id: 'blast', icon: '\u{1F4A5}', name: 'SHOCKWAVE', desc: 'Kill explosions push enemies back', apply: (s) => { s.knockbackForce += 80; } },
    { id: 'slow', icon: '\u2744', name: 'CRYO FIELD', desc: 'Enemies move 15% slower', apply: (s) => { s.enemySlowFactor = Math.max(ENEMY_SLOW_FLOOR, (s.enemySlowFactor || 1) * 0.85); } },
    { id: 'critical', icon: '\u{1F3AF}', name: 'PRECISION', desc: '20% chance of double damage', apply: (s) => { s.critChance = Math.min(0.8, s.critChance + 0.2); } },
    { id: 'magnet', icon: '\u{1F9F2}', name: 'WORD MAGNET', desc: 'Shorter words spawn more often', apply: (s) => { s.easyWordBias = Math.min(EASY_WORD_BIAS_MAX, (s.easyWordBias || 0) + 0.15); } },
    { id: 'multishot', icon: '\u{1F52B}', name: 'MULTISHOT', desc: 'Fire 2 extra projectiles on kill', apply: (s) => { s.extraProjectiles = Math.min(EXTRA_PROJECTILES_MAX, (s.extraProjectiles || 0) + 2); } },
    { id: 'autoTyper', icon: '\u{1F916}', name: 'TYPING DRONE', desc: 'A drone auto-types the nearest short word every 5s', apply: (s) => { s.autoTyperCount = Math.min(2, (s.autoTyperCount || 0) + 1); } },
    { id: 'arcChain', weapon: 'arc', icon: '\u26A1', name: 'ARC EXTENSION', desc: '+50% chain range', apply: (s) => { s.arcChainRange = (s.arcChainRange || 1) * 1.5; } },
    { id: 'arcBounces', weapon: 'arc', icon: '\u26D3', name: 'CHAIN REACTOR', desc: '+1 chain bounce', apply: (s) => { s.arcChainBounces = (s.arcChainBounces || 0) + 1; } },
    { id: 'venomPool', weapon: 'venom', icon: '\u2620', name: 'TOXIC EXPANSION', desc: '+40% pool radius, +1s duration', apply: (s) => { s.venomPoolRadius = (s.venomPoolRadius || 1) * 1.4; s.venomPoolDuration = (s.venomPoolDuration || 0) + 1; } },
    { id: 'shrapnelShards', weapon: 'shrapnel', icon: '\u{1F4A5}', name: 'FRAGMENT BURST', desc: '+2 shards per shot', apply: (s) => { s.shrapnelCount = (s.shrapnelCount || 0) + 2; } },
    { id: 'pulseRadius', weapon: 'pulse', icon: '\u{1F4AB}', name: 'NOVA EXPANSION', desc: '+25% AOE radius', apply: (s) => { s.pulseRadius = (s.pulseRadius || 1) * 1.25; } },
    { id: 'ricochetBounce', weapon: 'ricochet', icon: '\u{1F4BF}', name: 'PINBALL', desc: '+1 ricochet', apply: (s) => { s.ricochetBounces = (s.ricochetBounces || 0) + 1; } },
    { id: 'curseBerserk', curse: true, icon: '\u2694', name: 'CURSE: BERSERK', desc: '+50% damage, -20% max HP', apply: (s) => { s.damageMultiplier *= 1.5; s.maxHp = Math.max(50, Math.floor(s.maxHp * 0.8)); s.hp = Math.min(s.hp, s.maxHp); } },
    { id: 'curseGlass', curse: true, icon: '\u{1F4A5}', name: 'CURSE: GLASS CANNON', desc: '+40% projectile speed, -15 HP', apply: (s) => { s.projectileSpeed *= 1.4; s.maxHp = Math.max(50, s.maxHp - 15); s.hp = Math.min(s.hp, s.maxHp); } },
    { id: 'curseGreed', curse: true, icon: '\u{1F4B0}', name: 'CURSE: GREED', desc: '+50% score, enemies 20% faster', apply: (s) => { s.scoreMultiplier *= 1.5; s.enemySpeedCurse = (s.enemySpeedCurse || 1) * 1.2; } },
    { id: 'curseFrenzy', curse: true, icon: '\u26A1', name: 'CURSE: FRENZY', desc: '+25% fire rate, -20% accuracy', apply: (s) => { s.projectileSpeed *= 1.25; s.easyWordBias = (s.easyWordBias || 0) - 0.2; } },
    { id: 'curseGambler', curse: true, icon: '\u{1F3B0}', name: 'CURSE: GAMBLER', desc: 'Random effect on each kill', apply: (s) => { s.gamblerCurse = true; } },
  ];

  // --- Enemy types ---

  const ENEMY_TYPES = {
    drone:      { color: '#00f0ff', hp: 1, speed: 1,   size: 14, sides: 4, scoreValue: 10 },
    scout:      { color: '#4ade80', hp: 1, speed: 1.8, size: 10, sides: 3, scoreValue: 15 },
    tank:       { color: '#f59e0b', hp: 3, speed: 0.5, size: 22, sides: 6, scoreValue: 30 },
    elite:      { color: '#ef4444', hp: 5, speed: 0.7, size: 18, sides: 5, scoreValue: 50 },
    swarm:      { color: '#a78bfa', hp: 1, speed: 2.2, size: 8,  sides: 3, scoreValue: 8 },
    boss:       { color: '#ff2d55', hp: 8, speed: 0.35, size: 32, sides: 7, scoreValue: 200 },
    bossTank:   { color: '#e63946', hp: 14, speed: 0.2, size: 36, sides: 8, scoreValue: 250 },
    bossSplitter: { color: '#ff6b6b', hp: 8, speed: 0.35, size: 32, sides: 7, scoreValue: 200 },
    bossShielded: { color: '#ff2d55', hp: 8, speed: 0.35, size: 32, sides: 7, scoreValue: 200 },
    splitter:   { color: '#f472b6', hp: 1, speed: 1.2, size: 16, sides: 5, scoreValue: 20 },
    fragment:   { color: '#f9a8d4', hp: 1, speed: 1.6, size: 8,  sides: 3, scoreValue: 8 },
    shielder:   { color: '#38bdf8', hp: 3, speed: 0.8, size: 18, sides: 6, scoreValue: 35 },
    speeder:    { color: '#c084fc', hp: 1, speed: 3.0, size: 10, sides: 3, scoreValue: 18 },
    regenerator: { color: '#10b981', hp: 2, speed: 0.6, size: 16, sides: 5, scoreValue: 25 },
    teleporter: { color: '#8b5cf6', hp: 2, speed: 1.0, size: 14, sides: 6, scoreValue: 28 },
    berserker: { color: '#e11d48', hp: 3, speed: 1.0, size: 18, sides: 5, scoreValue: 35 },
    miniboss: { color: '#dc2626', hp: 10, speed: 0.45, size: 26, sides: 6, scoreValue: 80 },
    stealth: { color: '#6366f1', hp: 1, speed: 1.4, size: 12, sides: 4, scoreValue: 22 },
  };

  function getBossTypeForWave() {
    const cycle = (state.wave - 1) % 15;
    if (cycle < 5) return 'bossTank';
    if (cycle < 10) return 'bossSplitter';
    return 'bossShielded';
  }

  function isBossType(t) {
    return t === 'boss' || t === 'bossTank' || t === 'bossSplitter' || t === 'bossShielded';
  }

  // --- Audio ---

  const audio = {
    ctx: null,
    init() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    play(freq, duration = 0.1, type = 'square', vol = 0.08) {
      if (!this.ctx) return;
      const mult = typeof getSoundVolume === 'function' ? getSoundVolume() : 1;
      if (mult <= 0) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol * mult, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    },
    typeKey() { this.play(880, 0.05, 'square', 0.04); },
    killEnemy(combo = 0) {
      const ramp = Math.min(1.5, 1 + combo * 0.02);
      const vol = Math.min(0.1, 0.06 + combo * 0.002);
      this.play(440 * ramp, 0.15, 'sawtooth', vol);
      this.play(880 * ramp, 0.2, 'sine', vol * 0.8);
    },
    hit() { this.play(150, 0.2, 'sawtooth', 0.08); },
    miss() { this.play(200, 0.1, 'square', 0.03); },
    invalid() { this.play(150, 0.15, 'sawtooth', 0.06); this.play(100, 0.1, 'square', 0.04); },
    waveStart() { this.play(330, 0.3, 'sine', 0.06); setTimeout(() => this.play(440, 0.3, 'sine', 0.06), 150); },
    upgrade() { this.play(523, 0.15, 'sine', 0.06); this.play(659, 0.15, 'sine', 0.06); setTimeout(() => this.play(784, 0.2, 'sine', 0.06), 100); },
    streak(level) { const b = 400 + level * 100; this.play(b, 0.15, 'sine', 0.07); setTimeout(() => this.play(b * 1.25, 0.15, 'sine', 0.07), 80); setTimeout(() => this.play(b * 1.5, 0.25, 'sine', 0.08), 160); },
    droneShot() { this.play(600, 0.1, 'triangle', 0.04); },
    powerUp() { this.play(523, 0.12, 'sine', 0.08); setTimeout(() => this.play(659, 0.12, 'sine', 0.08), 100); setTimeout(() => this.play(784, 0.12, 'sine', 0.08), 200); setTimeout(() => this.play(1047, 0.25, 'sine', 0.1), 300); },
    nukeBlast() { this.play(80, 0.5, 'sawtooth', 0.12); this.play(60, 0.6, 'square', 0.08); },
    fireBolt() { this.play(660, 0.08, 'square', 0.05); this.play(1320, 0.06, 'sine', 0.03); },
    fireArc() { this.play(300, 0.2, 'sawtooth', 0.05); this.play(450, 0.15, 'sawtooth', 0.04); setTimeout(() => this.play(600, 0.1, 'sawtooth', 0.03), 50); },
    fireShrapnel() { this.play(200, 0.12, 'square', 0.07); this.play(100, 0.15, 'sawtooth', 0.05); },
    fireVenom() { this.play(180, 0.2, 'sine', 0.06); setTimeout(() => this.play(120, 0.3, 'sine', 0.04), 80); },
    firePulse() { this.play(220, 0.3, 'sine', 0.07); this.play(110, 0.4, 'sine', 0.05); setTimeout(() => this.play(55, 0.3, 'sine', 0.04), 100); },
    fireRicochet() { this.play(800, 0.06, 'triangle', 0.05); this.play(1200, 0.04, 'triangle', 0.03); },
    ricochetBounce() { this.play(1000, 0.05, 'triangle', 0.04); },
    bossSpawn() { this.play(80, 0.6, 'sawtooth', 0.1); this.play(60, 0.8, 'sine', 0.08); setTimeout(() => this.play(100, 0.4, 'square', 0.06), 200); setTimeout(() => this.play(120, 0.3, 'sawtooth', 0.05), 400); },
    bossKill() { this.play(200, 0.3, 'sawtooth', 0.1); this.play(400, 0.3, 'sine', 0.08); setTimeout(() => this.play(600, 0.3, 'sine', 0.08), 100); setTimeout(() => this.play(800, 0.4, 'sine', 0.1), 200); },
    shieldBreak() { this.play(500, 0.1, 'square', 0.06); this.play(300, 0.15, 'sawtooth', 0.05); },
  };

  // --- State ---

  let W, H;
  const CAMERA_ZOOM = 1.0;
  const RICOCHET_MAX_BOUNCE_RANGE = 200;
  const ARC_MAX_CHAIN_RANGE = 320;
  const VENOM_MAX_POOL_RADIUS = 120;
  const PULSE_MAX_RADIUS = 280;
  const CHAIN_DAMAGE_MAX = 45;
  const KNOCKBACK_FORCE_MAX = 150;
  const EXTRA_PROJECTILES_MAX = 6;
  const VENOM_POOL_DURATION_MAX = 8;
  const SHRAPNEL_COUNT_MAX = 12;
  const ENEMY_SLOW_FLOOR = 0.3;
  const EASY_WORD_BIAS_MAX = 0.6;

  const state = {
    screen: 'menu', hp: 100, maxHp: 100, score: 0, wave: 1,
    weapon: 'bolt', difficulty: 'normal', mode: 'endless',
    combo: 0, maxCombo: 0, wordsTyped: 0, totalCharsTyped: 0,
    keysCorrect: 0, keysMissed: 0, totalKeysTyped: 0,
    wordlistSource: 'builtin', apiWordBuffer: [], wordlistOverride: null,
    startTime: 0, comboTimer: 0, damageMultiplier: 1, projectileSpeed: 1,
    chainDamage: 0, scoreMultiplier: 1, knockbackForce: 0,
    enemySlowFactor: 1, critChance: 0, easyWordBias: 0,
    extraProjectiles: 0, regenRate: 0, regenAccum: 0,
    shakeAmount: 0, shakeDecay: 0.9,
    waveEnemiesLeft: 0, waveEnemiesTotal: 0, waveActive: false,
    spawnTimer: 0, spawnInterval: 1.5,
    exp: 0, level: 1, expToNextLevel: 5,
    currentInput: '', targetEnemy: null, targetDrop: null, targetAugDrop: null, targetMeteorMarker: null, targetChosenViaClick: false,
    clickTargetCritChance: 0.1, clickTargetCritMult: 2,
    upgrades: [], augmentations: [],
    weaponBranchProgress: {},
    subWeapon: null,
    subWeaponBranchProgress: {},
    autoTyperCount: 0, autoTyperTimer: 0,
    critFlashTimer: 0, lastStreakThreshold: 0,
    freezeTimer: 0, bombTimer: 0, slowDropTimer: 0,
    doubleTimer: 0, shieldHits: 0, nukeFlash: 0,
  };

  let enemies = [], projectiles = [], particles = [], floatingTexts = [];
  let shockwaveRings = [], lightningArcs = [], orbs = [], playerTrail = [];
  let powerDrops = [], augmentationDrops = [];
  let beams = [], beamProjectiles = [], poisonPools = [];
  let orbitingOrbs = [], spectreDrones = [], mines = [], meteorMarkers = [];
  let gridPulse = 0;

  const player = { x: 0, y: 0, radius: 16, angle: 0 };

  const dom = {
    menuScreen: document.getElementById('menu-screen'),
    upgradeScreen: document.getElementById('upgrade-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    hud: document.getElementById('hud'),
    hudWave: document.getElementById('hud-wave'),
    hudLevel: document.getElementById('hud-level'),
    expProgressBar: document.getElementById('exp-progress-bar'),
    hudScore: document.getElementById('hud-score'),
    hudCombo: document.getElementById('hud-combo'),
    hudWpm: document.getElementById('hud-wpm'),
    hudAccuracy: document.getElementById('hud-accuracy'),
    healthBar: document.getElementById('health-bar'),
    healthText: document.getElementById('health-text'),
    typingDisplay: document.getElementById('typing-display'),
    upgradeCards: document.getElementById('upgrade-cards'),
    upgradeTitle: document.getElementById('upgrade-title'),
    upgradeSubtitle: document.getElementById('upgrade-subtitle'),
    upgradeInputHint: document.getElementById('upgrade-input-hint'),
    gameOverStats: document.getElementById('game-over-stats'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    menuBtn: document.getElementById('menu-btn'),
    menuStats: document.getElementById('menu-stats'),
    waveProgressBar: document.getElementById('wave-progress-bar'),
    hudUpgrades: document.getElementById('hud-upgrades'),
    hudEffects: document.getElementById('hud-effects'),
    themeBtn: document.getElementById('theme-btn'),
    themeToggleHud: document.getElementById('theme-toggle-hud'),
    weaponScreen: document.getElementById('weapon-screen'),
    weaponCards: document.getElementById('weapon-cards'),
    hudWeapon: document.getElementById('hud-weapon'),
    hudMastery: document.getElementById('hud-mastery'),
    scoresScreen: document.getElementById('scores-screen'),
    scoresList: document.getElementById('scores-list'),
    scoresBtn: document.getElementById('scores-btn'),
    scoresCloseBtn: document.getElementById('scores-close-btn'),
    statsScreen: document.getElementById('stats-screen'),
    statsList: document.getElementById('stats-list'),
    statsBtn: document.getElementById('stats-btn'),
    statsCloseBtn: document.getElementById('stats-close-btn'),
    achievementsScreen: document.getElementById('achievements-screen'),
    achievementsList: document.getElementById('achievements-list'),
    achievementsBtn: document.getElementById('achievements-btn'),
    achievementsCloseBtn: document.getElementById('achievements-close-btn'),
    settingsScreen: document.getElementById('settings-screen'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsCloseBtn: document.getElementById('settings-close-btn'),
    pauseScreen: document.getElementById('pause-screen'),
    pauseBtn: document.getElementById('pause-btn'),
    pauseResumeBtn: document.getElementById('pause-resume-btn'),
    pauseRestartBtn: document.getElementById('pause-restart-btn'),
    pauseQuitBtn: document.getElementById('pause-quit-btn'),
    hudBottom: document.getElementById('hud-bottom'),
    softKeyboard: document.getElementById('soft-keyboard'),
  };

  function isCoarsePointer() {
    return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  }

  const INPUT_MODE_STORAGE_KEY = 'typocalypse-input-mode';

  function getStoredInputMode() {
    const v = localStorage.getItem(INPUT_MODE_STORAGE_KEY);
    if (v === 'mobile' || v === 'desktop') return v;
    return 'auto';
  }

  /** Auto follows pointer; Mobile/Desktop are user overrides (Settings). */
  function useMobileGameMode() {
    const m = getStoredInputMode();
    if (m === 'mobile') return true;
    if (m === 'desktop') return false;
    return isCoarsePointer();
  }

  function setInputMode(mode) {
    if (mode !== 'auto' && mode !== 'mobile' && mode !== 'desktop') return;
    if (mode === 'auto') localStorage.removeItem(INPUT_MODE_STORAGE_KEY);
    else localStorage.setItem(INPUT_MODE_STORAGE_KEY, mode);
    document.documentElement.dataset.inputMode = mode;
    document.querySelectorAll('.input-mode-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
    applyViewportSize();
  }

  function initInputModePreference() {
    document.documentElement.dataset.inputMode = getStoredInputMode();
    document.querySelectorAll('.input-mode-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === getStoredInputMode());
    });
  }

  /** Desktop: classic full-window canvas (same as pre-mobile work). Touch: visualViewport for OS UI / keyboard. */
  function applyViewportSize() {
    if (!useMobileGameMode()) {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      W = canvas.width = w;
      H = canvas.height = h;
      canvas.style.position = '';
      canvas.style.width = '';
      canvas.style.height = '';
      canvas.style.left = '';
      canvas.style.top = '';
      if (dom.hud) {
        dom.hud.style.position = '';
        dom.hud.style.left = '';
        dom.hud.style.top = '';
        dom.hud.style.width = '';
        dom.hud.style.height = '';
        dom.hud.style.right = '';
        dom.hud.style.bottom = '';
      }
      return;
    }

    const vv = window.visualViewport;
    let w;
    let h;
    let top = 0;
    let left = 0;
    if (vv) {
      w = Math.max(1, Math.round(vv.width));
      h = Math.max(1, Math.round(vv.height));
      left = Math.round(vv.offsetLeft);
      top = Math.round(vv.offsetTop);
    } else {
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
    }
    W = canvas.width = w;
    H = canvas.height = h;
    canvas.style.position = 'fixed';
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
    if (dom.hud) {
      dom.hud.style.position = 'fixed';
      dom.hud.style.left = `${left}px`;
      dom.hud.style.top = `${top}px`;
      dom.hud.style.width = `${w}px`;
      dom.hud.style.height = `${h}px`;
      dom.hud.style.right = 'auto';
      dom.hud.style.bottom = 'auto';
    }
  }

  /**
   * Spawn/word pressure tuning — mobile game mode only (auto: coarse pointer).
   */
  function getViewportBalanceMults() {
    if (!useMobileGameMode()) {
      return { waveCountMult: 1, spawnIntervalMult: 1, maxAlive: 1e9 };
    }

    const area = Math.max(1, W * H);
    const refArea = 1280 * 720;
    const t = Math.min(1, area / refArea);
    const diffId = state.difficulty || 'normal';

    let waveCountMult = 0.28 + 0.58 * t;
    let spawnIntervalMult = 1 + (1 - t) * 1.28;
    let maxAlive = Math.max(4, Math.floor(3 + 13 * t));

    waveCountMult *= 0.78;
    spawnIntervalMult *= 1.16;
    maxAlive = Math.max(4, Math.floor(maxAlive * 0.76));

    if (diffId === 'easy') {
      waveCountMult *= 0.62;
      spawnIntervalMult *= 1.26;
      maxAlive = Math.max(4, Math.floor(maxAlive * 0.7));
    } else if (diffId === 'normal') {
      waveCountMult *= 0.88;
      spawnIntervalMult *= 1.06;
      maxAlive = Math.max(4, Math.floor(maxAlive * 0.9));
    }

    return {
      waveCountMult: Math.max(0.2, waveCountMult),
      spawnIntervalMult: Math.min(3.2, spawnIntervalMult),
      maxAlive: Math.max(4, maxAlive),
    };
  }

  function emitSoftKey(key) {
    handleKeyDown({
      key,
      preventDefault() {},
      stopPropagation() {},
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    });
  }

  function initSoftKeyboard() {
    const root = dom.softKeyboard;
    if (!root) return;
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    root.innerHTML = '';
    rows.forEach((row, ri) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'soft-keyboard-row';
      if (ri === 2) {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'soft-key soft-key--wide';
        tab.textContent = 'TAB';
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          emitSoftKey('Tab');
        });
        rowEl.appendChild(tab);
      }
      row.split('').forEach((ch) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'soft-key';
        b.textContent = ch;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          emitSoftKey(ch);
        });
        rowEl.appendChild(b);
      });
      if (ri === 2) {
        const bs = document.createElement('button');
        bs.type = 'button';
        bs.className = 'soft-key soft-key--wide';
        bs.textContent = '\u232b';
        bs.setAttribute('aria-label', 'Backspace');
        bs.addEventListener('click', (e) => {
          e.preventDefault();
          emitSoftKey('Backspace');
        });
        rowEl.appendChild(bs);
      }
      root.appendChild(rowEl);
    });
    const rowEsc = document.createElement('div');
    rowEsc.className = 'soft-keyboard-row soft-keyboard-row--tools';
    const esc = document.createElement('button');
    esc.type = 'button';
    esc.className = 'soft-key soft-key--tool';
    esc.textContent = 'ESC';
    esc.addEventListener('click', (e) => {
      e.preventDefault();
      emitSoftKey('Escape');
    });
    rowEsc.appendChild(esc);
    root.appendChild(rowEsc);
  }

  function updateSoftKeyboardVisibility() {
    const sk = dom.softKeyboard;
    if (!sk) return;
    const active = useMobileGameMode() && (
      state.screen === 'playing' ||
      state.screen === 'upgrade' ||
      state.screen === 'weaponSelect'
    );
    sk.classList.toggle('hidden', !active);
    if (!active) return;
    const overlay = state.screen === 'upgrade' || state.screen === 'weaponSelect';
    sk.classList.toggle('soft-keyboard--overlay', overlay);
    if (state.screen === 'playing' && dom.hudBottom) {
      dom.hudBottom.appendChild(sk);
    } else {
      document.body.appendChild(sk);
    }
  }

  initInputModePreference();
  window.addEventListener('resize', applyViewportSize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyViewportSize);
    window.visualViewport.addEventListener('scroll', applyViewportSize);
  }
  applyViewportSize();

  // --- High Scores ---

  function loadHighScores() {
    try {
      return JSON.parse(localStorage.getItem('typingSurvivor_highscores') || '[]');
    } catch { return []; }
  }

  function loadDailyHighScores() {
    try {
      const key = 'typingSurvivor_daily_' + getDailySeed();
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  }

  function saveHighScore(entry) {
    if (state.mode === 'daily') {
      const scores = loadDailyHighScores();
      scores.push({ ...entry, date: getDailySeed() });
      scores.sort((a, b) => b.score - a.score);
      const top10 = scores.slice(0, 10);
      localStorage.setItem('typingSurvivor_daily_' + getDailySeed(), JSON.stringify(top10));
      return top10;
    }
    const scores = loadHighScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    const top10 = scores.slice(0, 10);
    localStorage.setItem('typingSurvivor_highscores', JSON.stringify(top10));
    return top10;
  }

  function getRandom() {
    if (state.mode === 'daily' && state.dailyRandom) return state.dailyRandom();
    return Math.random();
  }

  function renderScoresScreen() {
    const isDaily = (state.scoresViewMode || 'all') === 'daily';
    const scores = isDaily ? loadDailyHighScores() : loadHighScores();
    if (scores.length === 0) {
      dom.scoresList.innerHTML = '<div class="no-scores">No scores yet. Play a game!</div>';
      return;
    }
    const header = isDaily ? `<div class="scores-daily-header">DAILY CHALLENGE — ${getDailySeed()}</div>` : '';
    dom.scoresList.innerHTML = header + scores.map((s, i) => `
      <div class="score-entry">
        <span class="score-rank">#${i + 1}</span>
        <div class="score-details">
          <span class="score-main">${s.score.toLocaleString()}</span>
          <span class="score-sub">Wave ${s.wave} · ${(s.weapon || 'bolt').toUpperCase()} · ${(s.difficulty || 'normal').toUpperCase()}</span>
        </div>
        <span class="score-date">${s.date || ''}</span>
      </div>
    `).join('');
  }

  // --- Lifetime Stats ---

  const ACHIEVEMENTS = [
    { id: 'firstBlood', icon: '\u{1F5E1}', label: 'FIRST BLOOD', desc: 'Get your first kill' },
    { id: 'wave5', icon: '\u{1F4CA}', label: 'WAVE 5', desc: 'Reach wave 5' },
    { id: 'wave8', icon: '\u{1F4CA}', label: 'WAVE 8', desc: 'Reach wave 8' },
    { id: 'wave10', icon: '\u{1F4CA}', label: 'WAVE 10', desc: 'Reach wave 10' },
    { id: 'bossSlayer', icon: '\u{1F525}', label: 'BOSS SLAYER', desc: 'Kill your first boss' },
    { id: 'weaponMaster', icon: '\u2694', label: 'WEAPON MASTER', desc: '50 kills with one weapon' },
    { id: 'comboKing', icon: '\u{1F4A5}', label: 'COMBO KING', desc: 'Reach a 30+ combo' },
    { id: 'typist', icon: '\u2328', label: 'TYPIST', desc: '80+ WPM for 60 seconds' },
    { id: 'survivor', icon: '\u{1F3C6}', label: 'SURVIVOR', desc: 'Survive 20 minutes' },
  ];

  function loadAchievements() {
    try {
      const raw = localStorage.getItem('typocalypse-achievements');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function unlockAchievement(id) {
    const unlocked = loadAchievements();
    if (unlocked[id]) return false;
    unlocked[id] = Date.now();
    localStorage.setItem('typocalypse-achievements', JSON.stringify(unlocked));
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (ach) {
      const el = document.createElement('div');
      el.className = 'achievement-popup';
      el.innerHTML = `<span class="achievement-icon">${ach.icon}</span><div><strong>${ach.label}</strong><br>${ach.desc}</div>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
      audio.powerUp();
    }
    return true;
  }

  function checkAchievements() {
    const ls = loadLifetimeStats();
    const unlocked = loadAchievements();
    if (!unlocked.firstBlood && (ls.totalKills || 0) >= 1) unlockAchievement('firstBlood');
    if (!unlocked.wave5 && (ls.bestWave || 0) >= 5) unlockAchievement('wave5');
    if (!unlocked.wave8 && (ls.bestWave || 0) >= 8) unlockAchievement('wave8');
    if (!unlocked.wave10 && (ls.bestWave || 0) >= 10) unlockAchievement('wave10');
    if (!unlocked.bossSlayer && (ls.bossKills || 0) >= 1) unlockAchievement('bossSlayer');
    const wKills = state.weaponKills || {};
    const maxWeaponKills = Math.max(0, ...Object.values(wKills));
    if (!unlocked.weaponMaster && maxWeaponKills >= 50) unlockAchievement('weaponMaster');
    if (!unlocked.comboKing && (state.maxCombo || 0) >= 30) unlockAchievement('comboKing');
    const elapsed = (performance.now() - state.startTime) / 1000;
    const wpm = elapsed > 0 ? (state.totalCharsTyped / 5) / (elapsed / 60) : 0;
    if (!unlocked.typist && elapsed >= 60 && wpm >= 80) unlockAchievement('typist');
    if (!unlocked.survivor && elapsed >= 1200) unlockAchievement('survivor');
  }

  function renderAchievementsScreen() {
    if (!dom.achievementsList) return;
    const unlocked = loadAchievements();
    dom.achievementsList.innerHTML = ACHIEVEMENTS.map((a) => {
      const isUnlocked = !!unlocked[a.id];
      const date = unlocked[a.id] ? new Date(unlocked[a.id]).toLocaleDateString() : '';
      return `<div class="achievement-entry ${isUnlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-entry-icon">${a.icon}</span>
        <div class="achievement-entry-details">
          <span class="achievement-entry-label">${a.label}</span>
          <span class="achievement-entry-desc">${a.desc}</span>
          ${date ? `<span class="achievement-entry-date">${date}</span>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function loadLifetimeStats() {
    try {
      return JSON.parse(localStorage.getItem('typingSurvivor_lifetime') || 'null') || {
        gamesPlayed: 0, totalWords: 0, totalKills: 0, totalScore: 0,
        bestWave: 0, bestScore: 0, bestCombo: 0, bestWpm: 0, bestAccuracy: 0,
        totalKeysCorrect: 0, totalKeysMissed: 0, totalTime: 0, bossKills: 0,
      };
    } catch {
      return { gamesPlayed: 0, totalWords: 0, totalKills: 0, totalScore: 0, bestWave: 0, bestScore: 0, bestCombo: 0, bestWpm: 0, bestAccuracy: 0, totalKeysCorrect: 0, totalKeysMissed: 0, totalTime: 0, bossKills: 0 };
    }
  }

  function saveLifetimeStats() {
    const ls = loadLifetimeStats();
    const elapsed = (performance.now() - state.startTime) / 1000;
    const wpm = elapsed > 0 ? Math.round((state.totalCharsTyped / 5) / (elapsed / 60)) : 0;
    ls.gamesPlayed++;
    ls.totalWords += state.wordsTyped;
    ls.totalKills += state.enemiesKilled || 0;
    ls.totalScore += state.score;
    ls.bestWave = Math.max(ls.bestWave, state.wave);
    ls.bestScore = Math.max(ls.bestScore, state.score);
    ls.bestCombo = Math.max(ls.bestCombo, state.maxCombo);
    ls.bestWpm = Math.max(ls.bestWpm, wpm);
    const total = (state.keysCorrect || 0) + (state.keysMissed || 0);
    const acc = total > 0 ? (state.keysCorrect / total) * 100 : 100;
    ls.bestAccuracy = Math.max(ls.bestAccuracy || 0, acc);
    ls.totalKeysCorrect = (ls.totalKeysCorrect || 0) + (state.keysCorrect || 0);
    ls.totalKeysMissed = (ls.totalKeysMissed || 0) + (state.keysMissed || 0);
    ls.totalTime += elapsed;
    ls.bossKills = (ls.bossKills || 0) + (state.bossKills || 0);
    localStorage.setItem('typingSurvivor_lifetime', JSON.stringify(ls));
  }

  function renderStatsScreen() {
    const ls = loadLifetimeStats();
    const hrs = Math.floor(ls.totalTime / 3600);
    const mins = Math.floor((ls.totalTime % 3600) / 60);
    dom.statsList.innerHTML = `
      <div class="stat-row"><span class="stat-label">GAMES PLAYED</span><span class="stat-value">${ls.gamesPlayed}</span></div>
      <div class="stat-row"><span class="stat-label">TOTAL WORDS</span><span class="stat-value">${ls.totalWords.toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">TOTAL KILLS</span><span class="stat-value">${ls.totalKills.toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">TOTAL SCORE</span><span class="stat-value">${ls.totalScore.toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">BEST WAVE</span><span class="stat-value">${ls.bestWave}</span></div>
      <div class="stat-row"><span class="stat-label">BEST SCORE</span><span class="stat-value">${ls.bestScore.toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">BEST COMBO</span><span class="stat-value">x${ls.bestCombo}</span></div>
      <div class="stat-row"><span class="stat-label">BEST WPM</span><span class="stat-value">${ls.bestWpm}</span></div>
      <div class="stat-row"><span class="stat-label">BEST ACCURACY</span><span class="stat-value">${(ls.bestAccuracy || 0).toFixed(1)}%</span></div>
      <div class="stat-row"><span class="stat-label">TOTAL TIME</span><span class="stat-value">${hrs}h ${mins}m</span></div>
    `;
  }

  // --- Reset ---

  function initWeaponBranchProgress(weapon) {
    const branches = WEAPON_UPGRADE_BRANCHES[weapon];
    if (!branches) return {};
    const prog = {};
    Object.keys(branches).forEach((b) => { prog[b] = 0; });
    return prog;
  }

  function resetState() {
    const currentWeapon = state.weapon;
    const currentDiff = state.difficulty;
    Object.assign(state, {
      hp: 100, maxHp: 100, score: 0, wave: 1, weapon: currentWeapon, difficulty: currentDiff, mode: state.mode || 'endless',
      combo: 0, maxCombo: 0, wordsTyped: 0, totalCharsTyped: 0,
      keysCorrect: 0, keysMissed: 0, totalKeysTyped: 0,
      wordlistSource: state.wordlistSource || 'builtin', apiWordBuffer: state.apiWordBuffer || [], wordlistOverride: state.wordlistOverride,
      startTime: performance.now(), comboTimer: 0,
      damageMultiplier: 1, projectileSpeed: 1, chainDamage: 0,
      scoreMultiplier: 1, knockbackForce: 0, enemySlowFactor: 1,
      critChance: 0, easyWordBias: 0, extraProjectiles: 0,
      arcChainRange: 1, arcChainBounces: 0, venomPoolRadius: 1, venomPoolDuration: 0,
      shrapnelCount: 0, pulseRadius: 1, ricochetBounces: 0,
      enemySpeedCurse: 1,
      weaponKills: { bolt: 0, arc: 0, shrapnel: 0, venom: 0, pulse: 0, ricochet: 0 },
      weaponMasteryApplied: { bolt: 0, arc: 0, shrapnel: 0, venom: 0, pulse: 0, ricochet: 0 },
      enemiesKilled: 0, bossKills: 0,
      regenRate: 0, regenAccum: 0, shakeAmount: 0,
      waveEnemiesLeft: 0, waveEnemiesTotal: 0, waveActive: false,
      spawnTimer: 0, spawnInterval: 1.5,
      exp: 0, level: 1, expToNextLevel: 5,
      currentInput: '', targetEnemy: null, targetDrop: null, targetAugDrop: null, targetMeteorMarker: null, targetChosenViaClick: false,
      upgrades: [], augmentations: [],
      weaponBranchProgress: initWeaponBranchProgress(currentWeapon),
      subWeapon: null,
      subWeaponBranchProgress: {},
      autoTyperCount: 0, autoTyperTimer: 0,
      critFlashTimer: 0, lastStreakThreshold: 0,
      freezeTimer: 0, bombTimer: 0, slowDropTimer: 0,
      doubleTimer: 0, shieldHits: 0, nukeFlash: 0,
      clickTargetCritChance: 0.1, clickTargetCritMult: 2,
      comboSpeedBoost: 1, comboSpeedTimer: 0,
      comboCritBoost: 0, comboCritTimer: 0,
      comboMilestonesHit: new Set(),
      enemiesKilled: 0,
      orbCount: 0, spectreEnabled: false, minefieldEnabled: false, meteorEnabled: false, meteorTimer: 0,
      droneFireRate: 1, venomDotMult: 1, shrapnelFireTrail: false, cryoChance: 0,
      arcChainDamageMult: 0.5, shrapnelSpread: 1, shrapnelDamageMult: 1,
      pulseDamageMult: 1, pulseSpeedMult: 1, ricochetBounceMult: 0.7,
      gamblerCurse: false,
    });
    if (state.mode === 'daily') {
      state.maxHp = 50;
      state.hp = 50;
      state.damageMultiplier = 2;
      state.dailyRandom = seededRandom(getDailySeed());
    } else {
      state.dailyRandom = null;
    }
    enemies = []; projectiles = []; particles = []; floatingTexts = [];
    shockwaveRings = []; lightningArcs = []; orbs = []; playerTrail = [];
    powerDrops = []; augmentationDrops = []; beams = []; beamProjectiles = []; poisonPools = [];
    orbitingOrbs = []; spectreDrones = []; mines = []; meteorMarkers = [];
    player.x = W / 2;
    player.y = H / 2;
    if (dom.hudUpgrades) dom.hudUpgrades.innerHTML = '';
    if (dom.hudEffects) dom.hudEffects.innerHTML = '';
  }

  // --- Word & enemy helpers ---

  function getUsedFirstLetters(extra) {
    const set = new Set();
    enemies.forEach((e) => {
      if (e.hp > 0 && e.word) set.add(e.word[0]);
      if (e.shieldWord && e.shieldActive) set.add(e.shieldWord[0]);
    });
    powerDrops.forEach((d) => set.add(d.word[0]));
    augmentationDrops.forEach((d) => set.add(d.word[0]));
    if (extra) extra.forEach((c) => set.add(c));
    return set;
  }

  function getBuiltinPool() {
    const r = getRandom() + state.easyWordBias;
    const wt = state.wave;
    const diff = DIFFICULTY_PRESETS[state.difficulty || 'normal'];
    if (diff.wordShift < 0) {
      if (wt <= 3 || r > 0.85) return WORDS_EASY;
      if (wt <= 6 || r > 0.55) return WORDS_MEDIUM;
      return WORDS_HARD;
    }
    if (diff.wordShift > 0) {
      if (wt <= 1 || r > 0.9) return WORDS_EASY;
      if (wt <= 3 || r > 0.5) return WORDS_MEDIUM;
      return WORDS_HARD;
    }
    if (wt <= 2 || r > 0.85) return WORDS_EASY;
    if (wt <= 5 || r > 0.55) return WORDS_MEDIUM;
    return WORDS_HARD;
  }

  function refillWordBuffer() {
    if (state.wordlistSource !== 'api') return;
    const url = 'https://random-word-api.herokuapp.com/word?number=50&length=5';
    fetch(url).then((res) => res.json()).then((words) => {
      if (Array.isArray(words) && state.apiWordBuffer) {
        state.apiWordBuffer.push(...words.filter((w) => typeof w === 'string' && w.length >= 3));
      }
    }).catch(() => {});
  }

  function getWordForUpgradeChoice(excludeFirstLetters) {
    const pool = WORDS_EASY.filter((w) => w.length >= 3 && !excludeFirstLetters.includes(w[0]));
    return pool.length ? pool[Math.floor(getRandom() * pool.length)] : 'pick';
  }

  function getWord(forcePool, excludeFirstLetters) {
    let pool;
    if (forcePool) {
      pool = forcePool;
    } else if (state.wordlistSource === 'custom' && state.wordlistOverride?.words?.length) {
      pool = state.wordlistOverride.words;
    } else if (state.wordlistSource === 'api' && state.apiWordBuffer?.length) {
      const idx = Math.floor(getRandom() * state.apiWordBuffer.length);
      const w = state.apiWordBuffer[idx];
      state.apiWordBuffer.splice(idx, 1);
      if (state.apiWordBuffer.length < 10) refillWordBuffer();
      const used = new Set(enemies.map((e) => e.word));
      powerDrops.forEach((d) => used.add(d.word));
      augmentationDrops.forEach((d) => used.add(d.word));
      const usedFirst = getUsedFirstLetters(excludeFirstLetters);
      if (!used.has(w) && !usedFirst.has(w[0])) return w;
      pool = state.apiWordBuffer.length ? state.apiWordBuffer : getBuiltinPool();
    } else {
      pool = getBuiltinPool();
    }

    const used = new Set(enemies.map((e) => e.word));
    powerDrops.forEach((d) => used.add(d.word));
    augmentationDrops.forEach((d) => used.add(d.word));
    const usedFirst = getUsedFirstLetters(excludeFirstLetters);

    const candidates = pool.filter((w) => !used.has(w) && !usedFirst.has(w[0]));
    let word;
    if (candidates.length > 0) {
      word = candidates[Math.floor(getRandom() * candidates.length)];
    } else {
      const fallback = pool.filter((w) => !used.has(w));
      word = fallback.length > 0 ? fallback[Math.floor(getRandom() * fallback.length)] : pool[0];
      if (used.has(word)) word += String.fromCharCode(97 + Math.floor(getRandom() * 26));
    }
    return word;
  }

  function getEnemyType() {
    const w = state.wave, roll = getRandom();
    if (w >= 8 && roll < 0.10) return 'elite';
    if (w >= 7 && roll < 0.14) return 'regenerator';
    if (w >= 7 && roll < 0.20) return 'teleporter';
    if (w >= 6 && roll < 0.26) return 'speeder';
    if (w >= 5 && roll < 0.36) return 'shielder';
    if (w >= 5 && roll < 0.46) return 'tank';
    if (w >= 6 && roll < 0.54) return 'stealth';
    if (w >= 5 && roll < 0.62) return 'berserker';
    if (w >= 5 && roll < 0.60) return 'splitter';
    if (w >= 4 && roll < 0.25) return 'splitter';
    if (w >= 3 && roll < 0.85) return 'scout';
    if (w >= 4 && roll < 0.93) return 'swarm';
    return 'drone';
  }

  function spawnEnemy(forceType) {
    const type = forceType || getEnemyType();
    const def = ENEMY_TYPES[type];
    if (!def) return;
    const diff = DIFFICULTY_PRESETS[state.difficulty || 'normal'];
    let word, shieldWord;
    const isBoss = type === 'boss' || type === 'bossTank' || type === 'bossSplitter' || type === 'bossShielded';
    const isMiniboss = type === 'miniboss';
    if (isBoss) {
      word = getWord(WORDS_BOSS);
      if (type === 'bossShielded') {
        shieldWord = getWord(WORDS_SHIELD);
        const temp = word;
        word = getWord(WORDS_BOSS, [shieldWord[0]]);
        if (!word || word[0] === shieldWord[0]) word = temp;
      }
    } else if (isMiniboss) {
      word = getWord(WORDS_BOSS);
    } else if (type === 'shielder') {
      shieldWord = getWord(WORDS_SHIELD);
      word = getWord(undefined, [shieldWord[0]]);
    } else {
      word = getWord();
    }
    const angle = getRandom() * Math.PI * 2;
    const dist = Math.max(W, H) / 2 + 40 + getRandom() * 60;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;
    const subScale = state.subWeapon ? { hp: 1.15, speed: 1.1 } : { hp: 1, speed: 1 };
    let hp = def.hp * diff.hpMult * subScale.hp;
    if (isMiniboss && state.wave <= 3) hp *= 0.7;
    else if (isMiniboss && state.wave <= 6) hp *= 0.85;
    hp = Math.max(1, Math.floor(hp));
    const enemy = {
      x, y, type, word, typedIndex: 0, hp, maxHp: hp,
      speed: def.speed * diff.speedMult * subScale.speed * (0.9 + Math.random() * 0.2) * (1 + state.wave * (state.wave <= 5 ? 0.02 : 0.04)),
      size: def.size, sides: def.sides, color: def.color,
      scoreValue: def.scoreValue, angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2, pulsePhase: Math.random() * Math.PI * 2,
      targeted: false, spawnTime: performance.now(), spawnAlpha: 0,
    };
    if (type === 'shielder' || type === 'bossShielded') {
      enemy.shieldWord = shieldWord;
      enemy.shieldActive = true;
      enemy.shieldTypedIndex = 0;
    }
    if (type === 'regenerator') {
      enemy.regenRate = 0.15;
      enemy.regenTimer = 0;
    }
    if (type === 'teleporter') {
      enemy.teleportTimer = 0;
      enemy.teleportInterval = 3 + Math.random() * 2;
    }
    if (type === 'berserker') {
      enemy.baseSpeed = enemy.speed;
    }
    enemies.push(enemy);
    const isBossOrMiniboss = isBossType(type) || isMiniboss;
    shockwaveRings.push({ x, y, radius: 5, maxRadius: isBossOrMiniboss ? 80 : 40, life: 1, color: def.color, speed: isBossOrMiniboss ? 150 : 80 });
  }

  // --- Power drop spawning ---

  function trySpawnPowerDrop(x, y) {
    if (powerDrops.length >= 2) return;
    const chance = state.hp < state.maxHp * 0.5 ? 0.25 : 0.15;
    if (Math.random() > chance) return;

    const typeKey = POWER_DROP_KEYS[Math.floor(Math.random() * POWER_DROP_KEYS.length)];
    const def = POWER_DROP_TYPES[typeKey];
    const usedWords = new Set(enemies.map((e) => e.word));
    powerDrops.forEach((d) => usedWords.add(d.word));
    const usedFirst = getUsedFirstLetters();

    let word;
    const pool = def.words.filter((w) => !usedWords.has(w) && !usedFirst.has(w[0]));
    const fallback = def.words.filter((w) => !usedWords.has(w));
    word = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : (fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : def.words[0] + 'x');

    const ox = x + (Math.random() - 0.5) * 60;
    const oy = y + (Math.random() - 0.5) * 60;
    const halfViewW = (W / CAMERA_ZOOM) / 2 - 60;
    const halfViewH = (H / CAMERA_ZOOM) / 2 - 60;
    const cx = Math.max(player.x - halfViewW, Math.min(player.x + halfViewW, ox));
    const cy = Math.max(player.y - halfViewH, Math.min(player.y + halfViewH, oy));

    powerDrops.push({
      x: cx, y: cy, word, typedIndex: 0, type: typeKey,
      icon: def.icon, color: def.color, label: def.label,
      lifeTimer: 8, maxLife: 8, targeted: false,
    });
  }

  function forcePowerDrop(x, y) {
    const typeKey = POWER_DROP_KEYS[Math.floor(Math.random() * POWER_DROP_KEYS.length)];
    const def = POWER_DROP_TYPES[typeKey];
    const usedWords = new Set(enemies.map((e) => e.word));
    powerDrops.forEach((d) => usedWords.add(d.word));
    const usedFirst = getUsedFirstLetters();
    const pool = def.words.filter((w) => !usedWords.has(w) && !usedFirst.has(w[0]));
    const fallback = def.words.filter((w) => !usedWords.has(w));
    const word = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : (fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : def.words[0] + 'x');
    powerDrops.push({
      x, y, word, typedIndex: 0, type: typeKey,
      icon: def.icon, color: def.color, label: def.label,
      lifeTimer: 12, maxLife: 12, targeted: false,
    });
  }

  // --- Augmentation drop spawning ---

  function trySpawnAugmentationDrop(x, y, isBoss) {
    if (augmentationDrops.length >= 1) return;
    const chance = isBoss ? 0.35 + Math.random() * 0.1 : 0.08 + Math.random() * 0.04;
    if (Math.random() > chance) return;

    const typeKey = AUGMENTATION_KEYS[Math.floor(Math.random() * AUGMENTATION_KEYS.length)];
    const def = AUGMENTATION_TYPES[typeKey];
    if (def.weapon && def.weapon !== state.weapon && def.weapon !== state.subWeapon) return;

    const usedWords = new Set(enemies.map((e) => e.word));
    powerDrops.forEach((d) => usedWords.add(d.word));
    augmentationDrops.forEach((d) => usedWords.add(d.word));
    const usedFirst = getUsedFirstLetters();

    let word;
    const pool = def.words.filter((w) => !usedWords.has(w) && !usedFirst.has(w[0]));
    const fallback = def.words.filter((w) => !usedWords.has(w));
    word = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : (fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : def.words[0] + 'x');

    const ox = x + (Math.random() - 0.5) * 60;
    const oy = y + (Math.random() - 0.5) * 60;
    const halfViewW = (W / CAMERA_ZOOM) / 2 - 60;
    const halfViewH = (H / CAMERA_ZOOM) / 2 - 60;
    const cx = Math.max(player.x - halfViewW, Math.min(player.x + halfViewW, ox));
    const cy = Math.max(player.y - halfViewH, Math.min(player.y + halfViewH, oy));

    augmentationDrops.push({
      x: cx, y: cy, word, typedIndex: 0, type: typeKey,
      icon: '\u2699', color: def.color, label: def.label,
      lifeTimer: 12, maxLife: 12, targeted: false,
    });
  }

  // --- Power drop activation ---

  function activatePowerDrop(drop) {
    const def = POWER_DROP_TYPES[drop.type];

    spawnParticles(drop.x, drop.y, drop.color, 30, 6);
    spawnFloatingText(drop.x, drop.y - 30, def.label, drop.color);
    audio.powerUp();

    const announce = document.createElement('div');
    announce.className = 'powerup-announce';
    announce.textContent = `${def.icon} ${def.label}`;
    announce.style.color = drop.color;
    announce.style.textShadow = `0 0 30px ${drop.color}`;
    document.body.appendChild(announce);
    setTimeout(() => announce.remove(), 2000);

    switch (drop.type) {
      case 'nuke':
        state.nukeFlash = 0.4;
        state.shakeAmount = 12;
        audio.nukeBlast();
        shockwaveRings.push({ x: player.x, y: player.y, radius: 10, maxRadius: Math.max(W, H), life: 1, color: '#ffffff', speed: 800 });
        [...enemies].forEach((e) => { if (e.hp > 0) killEnemy(e); });
        break;
      case 'freeze':
        state.freezeTimer = 5;
        break;
      case 'bomb':
        state.bombTimer = 10;
        break;
      case 'slow':
        state.slowDropTimer = 5;
        break;
      case 'shield':
        state.shieldHits += 3;
        break;
      case 'heal': {
        const healed = Math.min(40, state.maxHp - state.hp);
        state.hp = Math.min(state.maxHp, state.hp + 40);
        spawnFloatingText(player.x, player.y - 40, `+${healed} HP`, '#4ade80');
        spawnParticles(player.x, player.y, '#4ade80', 15, 4);
        break;
      }
      case 'double':
        state.doubleTimer = 10;
        break;
    }

    state.targetDrop = null;
    state.currentInput = '';
  }

  // --- Augmentation drop activation ---

  function activateAugmentationDrop(drop) {
    const def = AUGMENTATION_TYPES[drop.type];
    if (!def) return;

    def.apply(state);
    state.augmentations.push(drop.type);
    state.upgrades.push(drop.type);

    spawnParticles(drop.x, drop.y, drop.color, 30, 6);
    spawnFloatingText(drop.x, drop.y - 30, def.label, drop.color);
    audio.powerUp();

    const announce = document.createElement('div');
    announce.className = 'powerup-announce';
    announce.textContent = `\u2699 ${def.label}`;
    announce.style.color = drop.color;
    announce.style.textShadow = `0 0 30px ${drop.color}`;
    document.body.appendChild(announce);
    setTimeout(() => announce.remove(), 2000);

    state.targetAugDrop = null;
    state.currentInput = '';
  }

  // --- Wave / screen management ---

  function startWave() {
    const diff = DIFFICULTY_PRESETS[state.difficulty || 'normal'];
    const vb = getViewportBalanceMults();
    const levelBonus = Math.floor((state.level || 1) * 1.5);
    let base = 8 + state.wave * 4 + levelBonus;
    const isMinibossWave = state.wave % 3 === 0 && state.wave % 5 !== 0 && state.wave >= 3;
    const isBossWave = state.wave % 5 === 0;
    if (isMinibossWave) {
      base = Math.max(6, Math.floor(base * 0.55));
    } else if (isBossWave) {
      base = Math.max(8, Math.floor(base * 0.75));
    } else if (state.wave % 3 === 1 || state.wave % 5 === 1) {
      base = Math.floor(base * 0.8);
    }
    if (state.wave >= 10) base = Math.min(base, 35 + 2 * state.wave);
    if (state.mode === 'daily') base = Math.max(6, Math.floor(base * 0.9));
    base = Math.max(4, Math.floor(base * vb.waveCountMult));
    state.waveEnemiesTotal = base;
    state.waveEnemiesLeft = base;
    state.waveActive = true;
    state.spawnTimer = 0;
    const spawnMultSub = state.subWeapon ? 0.95 : 1;
    let spawnInterval = Math.max(0.4, (0.9 - state.wave * 0.04) * diff.spawnMult * spawnMultSub);
    if (isMinibossWave) spawnInterval *= 1.2;
    if (isBossWave) spawnInterval *= 1.1;
    state.spawnInterval = spawnInterval * vb.spawnIntervalMult;
    const el = document.createElement('div');
    el.className = 'wave-announce';
    el.textContent = `WAVE ${state.wave}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);

    if (state.wave % 5 === 0) {
      setTimeout(() => {
        if (state.screen !== 'playing') return;
        spawnEnemy(getBossTypeForWave());
        const bossEl = document.createElement('div');
        bossEl.className = 'wave-announce';
        bossEl.textContent = 'BOSS INCOMING';
        bossEl.style.color = '#ff2d55';
        bossEl.style.textShadow = '0 0 40px rgba(255,45,85,0.6)';
        document.body.appendChild(bossEl);
        setTimeout(() => bossEl.remove(), 2500);
        audio.bossSpawn();
        state.shakeAmount = 10;
      }, 2000);
    } else if (state.wave % 3 === 0 && state.wave >= 3) {
      setTimeout(() => {
        if (state.screen !== 'playing') return;
        spawnEnemy('miniboss');
        const miniEl = document.createElement('div');
        miniEl.className = 'wave-announce';
        miniEl.textContent = 'MINI-BOSS';
        miniEl.style.color = '#dc2626';
        miniEl.style.textShadow = '0 0 30px rgba(220,38,38,0.6)';
        document.body.appendChild(miniEl);
        setTimeout(() => miniEl.remove(), 2000);
        audio.bossSpawn();
        state.shakeAmount = 6;
      }, 1000);
    }
  }

  function getNextBranchUpgrades() {
    const w = state.weapon;
    const branches = WEAPON_UPGRADE_BRANCHES[w];
    if (!branches) return [];
    const prog = state.weaponBranchProgress || {};
    const choices = [];
    Object.keys(branches).forEach((branchName) => {
      const tier = prog[branchName] || 0;
      const tierList = branches[branchName];
      if (tier < tierList.length) {
        choices.push({ upg: tierList[tier], branch: branchName });
      }
    });
    return choices;
  }

  function showWeaponUpgradeScreen() {
    state.screen = 'upgrade';
    dom.upgradeScreen.classList.remove('hidden');
    dom.upgradeTitle.textContent = 'LEVEL UP';
    dom.upgradeSubtitle.textContent = `Level ${state.level} \u2014 choose a weapon upgrade`;
    const choices = getNextBranchUpgrades().slice(0, 3);
    state.upgradePhase = 'weapon';
    const usedFirst = [];
    choices.forEach((c) => {
      c.word = getWordForUpgradeChoice(usedFirst);
      usedFirst.push(c.word[0]);
    });
    window._upgradeChoices = choices;
    state.upgradeInput = '';
    if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = 'Type the word to select';
    dom.upgradeCards.innerHTML = '';
    choices.forEach(({ upg, branch, word }) => {
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `<div class="upgrade-card-icon">${upg.icon}</div><div class="upgrade-card-name">${upg.name}</div><div class="upgrade-card-desc">${upg.desc}</div><div class="upgrade-card-word">Type: ${word}</div>`;
      card.addEventListener('click', () => selectWeaponUpgrade(upg, branch));
      dom.upgradeCards.appendChild(card);
    });
  }

  function checkWaveClearAfterLevelUp() {
    if (!state.waveActive && state.waveEnemiesLeft <= 0 && enemies.filter((e) => e.hp > 0).length === 0) {
      showWaveClearScreen();
    }
  }

  function selectWeaponUpgrade(upg, branch) {
    upg.apply(state);
    state.upgrades.push(upg.id);
    if (!state.weaponBranchProgress) state.weaponBranchProgress = initWeaponBranchProgress(state.weapon);
    state.weaponBranchProgress[branch] = (state.weaponBranchProgress[branch] || 0) + 1;
    dom.upgradeScreen.classList.add('hidden');
    state.screen = 'playing';
    audio.upgrade();
    updateUpgradeBar();
    checkWaveClearAfterLevelUp();
  }

  function initSubWeaponBranchProgress(weapon) {
    const branches = WEAPON_UPGRADE_BRANCHES[weapon];
    if (!branches) return {};
    const prog = {};
    Object.keys(branches).forEach((b) => { prog[b] = 0; });
    return prog;
  }

  function getNextSubWeaponBranchUpgrades() {
    const w = state.subWeapon;
    if (!w) return [];
    const branches = WEAPON_UPGRADE_BRANCHES[w];
    if (!branches) return [];
    const prog = state.subWeaponBranchProgress || {};
    const choices = [];
    Object.keys(branches).forEach((branchName) => {
      const tier = prog[branchName] || 0;
      const tierList = branches[branchName];
      if (tier < tierList.length) {
        choices.push({ upg: tierList[tier], branch: branchName });
      }
    });
    return choices;
  }

  function showSubWeaponChoiceScreen() {
    const options = WEAPON_KEYS.filter((k) => k !== state.weapon && isWeaponUnlocked(k))
      .map((k) => WEAPONS[k])
      .sort(() => Math.random() - 0.5);
    if (options.length === 0) return;
    state.screen = 'upgrade';
    state.upgradePhase = 'subWeaponSelect';
    dom.upgradeScreen.classList.remove('hidden');
    dom.upgradeTitle.textContent = 'SUB-WEAPON UNLOCK';
    dom.upgradeSubtitle.textContent = 'Main weapon maxed \u2014 choose a secondary weapon';
    const opts = options.slice(0, 3);
    const usedFirst = [];
    opts.forEach((w) => {
      w.word = getWordForUpgradeChoice(usedFirst);
      usedFirst.push(w.word[0]);
    });
    usedFirst.push('s');
    const skipWord = getWordForUpgradeChoice(usedFirst) || 'skip';
    window._upgradeChoices = [...opts, { id: 'skip', word: skipWord, isSkip: true }];
    state.upgradeInput = '';
    if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = 'Type the word to select';
    dom.upgradeCards.innerHTML = '';
    opts.forEach((w) => {
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.style.borderColor = w.color + '66';
      card.innerHTML = `<div class="upgrade-card-icon">${w.icon}</div><div class="upgrade-card-name" style="color:${w.color}">${w.name}</div><div class="upgrade-card-desc">${w.desc}</div><div class="upgrade-card-word">Type: ${w.word}</div>`;
      card.addEventListener('click', () => selectSubWeapon(w.id));
      dom.upgradeCards.appendChild(card);
    });
    const skipCard = document.createElement('div');
    skipCard.className = 'upgrade-card upgrade-card--skip';
    skipCard.innerHTML = `<div class="upgrade-card-icon">\u2715</div><div class="upgrade-card-name">SKIP</div><div class="upgrade-card-desc">Continue without sub-weapon</div><div class="upgrade-card-word">Type: ${skipWord}</div>`;
    skipCard.addEventListener('click', () => {
      dom.upgradeScreen.classList.add('hidden');
      state.screen = 'playing';
      checkWaveClearAfterLevelUp();
    });
    dom.upgradeCards.appendChild(skipCard);
  }

  function selectSubWeapon(weaponKey) {
    state.subWeapon = weaponKey;
    state.subWeaponBranchProgress = initSubWeaponBranchProgress(weaponKey);
    dom.upgradeScreen.classList.add('hidden');
    state.screen = 'playing';
    audio.upgrade();
    updateUpgradeBar();
    checkWaveClearAfterLevelUp();
  }

  function showSubWeaponUpgradeScreen() {
    state.screen = 'upgrade';
    state.upgradePhase = 'subWeaponUpgrade';
    dom.upgradeScreen.classList.remove('hidden');
    dom.upgradeTitle.textContent = 'LEVEL UP';
    dom.upgradeSubtitle.textContent = `Level ${state.level} \u2014 choose a sub-weapon upgrade`;
    const choices = getNextSubWeaponBranchUpgrades().slice(0, 3);
    const usedFirst = [];
    choices.forEach((c) => {
      c.word = getWordForUpgradeChoice(usedFirst);
      usedFirst.push(c.word[0]);
    });
    window._upgradeChoices = choices;
    state.upgradeInput = '';
    if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = 'Type the word to select';
    dom.upgradeCards.innerHTML = '';
    choices.forEach(({ upg, branch, word }) => {
      const card = document.createElement('div');
      card.className = 'upgrade-card';
      card.innerHTML = `<div class="upgrade-card-icon">${upg.icon}</div><div class="upgrade-card-name">${upg.name}</div><div class="upgrade-card-desc">${upg.desc}</div><div class="upgrade-card-word">Type: ${word}</div>`;
      card.addEventListener('click', () => selectSubWeaponUpgrade(upg, branch));
      dom.upgradeCards.appendChild(card);
    });
  }

  function selectSubWeaponUpgrade(upg, branch) {
    upg.apply(state);
    state.upgrades.push(upg.id);
    if (!state.subWeaponBranchProgress) state.subWeaponBranchProgress = initSubWeaponBranchProgress(state.subWeapon);
    state.subWeaponBranchProgress[branch] = (state.subWeaponBranchProgress[branch] || 0) + 1;
    dom.upgradeScreen.classList.add('hidden');
    state.screen = 'playing';
    audio.upgrade();
    updateUpgradeBar();
    checkWaveClearAfterLevelUp();
  }

  function showWaveClearScreen() {
    state.screen = 'upgrade';
    state.upgradePhase = 'waveClear';
    dom.upgradeScreen.classList.remove('hidden');
    dom.upgradeTitle.textContent = 'WAVE CLEAR';
    dom.upgradeSubtitle.textContent = `Choose an augmentation, power-up, or field upgrade`;

    const scoreFallback = WAVE_CLEAR_CHOICES.find((u) => u.id === 'xp');

    const basePool = WAVE_CLEAR_CHOICES.filter((u) => {
      if (u.id === 'xp') return false;
      if (state.upgrades.includes(u.id)) return false;
      if (u.augmentation && u.weapon && u.weapon !== state.weapon && u.weapon !== state.subWeapon) return false;
      return true;
    });

    const available = basePool.length
      ? [...basePool].sort(() => Math.random() - 0.5).slice(0, 3)
      : (scoreFallback ? [{ ...scoreFallback }] : []);

    if (!basePool.length && scoreFallback) {
      dom.upgradeSubtitle.textContent = 'All upgrades collected — take a score bonus';
    }

    const usedFirst = [];
    available.forEach((upg) => {
      upg.word = getWordForUpgradeChoice(usedFirst);
      usedFirst.push(upg.word[0]);
    });
    window._upgradeChoices = available;
    state.upgradeInput = '';
    if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = 'Type the word to select';
    dom.upgradeCards.innerHTML = '';
    available.forEach((upg, i) => {
      const card = document.createElement('div');
      card.className = 'upgrade-card' + (upg.curse ? ' upgrade-card--curse' : '');
      card.innerHTML = `<div class="upgrade-card-icon">${upg.icon}</div><div class="upgrade-card-name">${upg.name}</div><div class="upgrade-card-desc">${upg.desc}</div><div class="upgrade-card-word">Type: ${upg.word}</div>`;
      card.addEventListener('click', () => selectWaveClearChoice(upg));
      dom.upgradeCards.appendChild(card);
    });
  }

  function selectWaveClearChoice(upg) {
    upg.apply(state);
    if (upg.id !== 'xp') state.upgrades.push(upg.id);
    dom.upgradeScreen.classList.add('hidden');
    state.screen = 'playing';
    state.wave++;
    const hpGain = 3 + Math.floor(state.wave / 3);
    state.maxHp += hpGain;
    state.hp = Math.min(state.maxHp, state.hp + hpGain);
    audio.upgrade();
    startWave();
    audio.waveStart();
    updateUpgradeBar();
  }

  function showWeaponSelect() {
    audio.init();
    dom.menuScreen.classList.add('hidden');
    dom.gameOverScreen.classList.add('hidden');
    dom.weaponScreen.classList.remove('hidden');
    state.screen = 'weaponSelect';
    renderWeaponCards();
    initModeButtons();
    initDifficultyButtons();
  }

  function initModeButtons() {
    const btns = document.querySelectorAll('.mode-btn');
    btns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === (state.mode || 'endless'));
      btn.onclick = () => {
        state.mode = btn.dataset.mode;
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });
  }

  function initDifficultyButtons() {
    const btns = document.querySelectorAll('.diff-btn');
    btns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.diff === state.difficulty);
      btn.onclick = () => {
        state.difficulty = btn.dataset.diff;
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });
  }

  function renderWeaponCards() {
    dom.weaponCards.innerHTML = '';
    const unlocked = WEAPON_KEYS.filter((k) => isWeaponUnlocked(k));
    const usedFirst = [];
    const weaponWords = {};
    unlocked.forEach((key) => {
      weaponWords[key] = getWordForUpgradeChoice(usedFirst);
      usedFirst.push(weaponWords[key][0]);
    });
    window._weaponChoices = unlocked.map((key) => ({ key, word: weaponWords[key] }));
    state.upgradeInput = '';
    WEAPON_KEYS.forEach((key) => {
      const w = WEAPONS[key];
      const isUnlocked = isWeaponUnlocked(key);
      const card = document.createElement('div');
      card.className = 'weapon-card' + (isUnlocked ? '' : ' weapon-card--locked');
      card.style.borderColor = w.color + '33';
      const unlockLabel = isUnlocked ? '' : `<div class="weapon-card-unlock">Unlock: ${getWeaponUnlockLabel(key)}</div>`;
      const wordLabel = isUnlocked ? `<div class="weapon-card-word">Type: ${weaponWords[key]}</div>` : '';
      card.innerHTML = `
        <div class="weapon-card-icon">${w.icon}</div>
        <div class="weapon-card-name" style="color:${w.color}">${w.name}</div>
        <div class="weapon-card-desc">${w.desc}</div>
        <div class="weapon-card-mechanic" style="border:1px solid ${w.color}55;color:${w.color}">${w.mechanic}</div>
        ${unlockLabel}${wordLabel}`;
      if (isUnlocked) {
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = w.color;
          card.style.boxShadow = `0 0 35px ${w.color}44`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = w.color + '33';
          card.style.boxShadow = 'none';
        });
        card.addEventListener('click', () => selectWeapon(key));
      }
      dom.weaponCards.appendChild(card);
    });
  }

  function selectWeapon(weaponKey) {
    state.weapon = weaponKey;
    dom.weaponScreen.classList.add('hidden');
    startGame();
  }

  const TUTORIAL_STEPS = [
    { title: 'TYPE TO SHOOT', text: 'Enemies have words above them. Type the word to fire your weapon and deal damage.' },
    { title: 'TAB TO TARGET', text: 'Press Tab to cycle between enemies. Click an enemy to target it directly. Targeted shots have a crit chance!' },
    { title: 'COLLECT DROPS', text: 'Defeated enemies may drop power-ups. Type the word on the drop to activate it. Clear waves to choose upgrades.' },
  ];

  function showTutorialOverlay(onFinish) {
    if (localStorage.getItem('typocalypse-tutorial-done')) {
      if (onFinish) onFinish();
      return;
    }
    let step = 0;
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-modal">
        <h3 class="tutorial-title" id="tutorial-title">${TUTORIAL_STEPS[0].title}</h3>
        <p class="tutorial-text" id="tutorial-text">${TUTORIAL_STEPS[0].text}</p>
        <div class="tutorial-buttons">
          <button id="tutorial-skip" class="menu-btn secondary">SKIP</button>
          <button id="tutorial-next" class="menu-btn">NEXT</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const updateStep = () => {
      const titleEl = document.getElementById('tutorial-title');
      const textEl = document.getElementById('tutorial-text');
      const nextBtn = document.getElementById('tutorial-next');
      if (!titleEl || !textEl || !nextBtn) return;
      titleEl.textContent = TUTORIAL_STEPS[step].title;
      textEl.textContent = TUTORIAL_STEPS[step].text;
      nextBtn.textContent = step === TUTORIAL_STEPS.length - 1 ? 'GOT IT' : 'NEXT';
    };
    const finish = () => {
      localStorage.setItem('typocalypse-tutorial-done', '1');
      overlay.remove();
      if (onFinish) onFinish();
    };
    document.getElementById('tutorial-skip')?.addEventListener('click', finish);
    document.getElementById('tutorial-next')?.addEventListener('click', () => {
      if (step < TUTORIAL_STEPS.length - 1) {
        step++;
        updateStep();
      } else {
        finish();
      }
    });
  }

  function startGame() {
    resetState();
    if (state.wordlistSource === 'api' && (!state.apiWordBuffer || state.apiWordBuffer.length < 20)) {
      refillWordBuffer();
    }
    dom.menuScreen.classList.add('hidden');
    dom.gameOverScreen.classList.add('hidden');
    dom.weaponScreen.classList.add('hidden');
    dom.hud.classList.remove('hidden');
    state.screen = 'playing';
    const beginPlay = () => {
      startWave();
      audio.waveStart();
    };
    showTutorialOverlay(beginPlay);
  }

  function showGameOver() {
    state.screen = 'gameover';
    dom.hud.classList.add('hidden');
    dom.pauseScreen.classList.add('hidden');
    dom.gameOverScreen.classList.remove('hidden');
    const elapsed = (performance.now() - state.startTime) / 1000;
    const m = Math.floor(elapsed / 60), s = Math.floor(elapsed % 60);
    const wpm = elapsed > 0 ? Math.round((state.totalCharsTyped / 5) / (elapsed / 60)) : 0;
    const diff = DIFFICULTY_PRESETS[state.difficulty || 'normal'];
    const wDef = WEAPONS[state.weapon];

    saveLifetimeStats();
    checkAchievements();
    const scores = saveHighScore({
      score: state.score, wave: state.wave, weapon: state.weapon,
      difficulty: state.difficulty || 'normal',
      date: new Date().toLocaleDateString(),
    });
    const rank = scores.findIndex((s) => s.score === state.score && s.wave === state.wave);
    const isNewHighScore = rank === 0;

    if (isNewHighScore) {
      const flash = document.createElement('div');
      flash.className = 'new-high-score-flash';
      flash.textContent = 'NEW HIGH SCORE!';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 2000);
    }

    const subDef = state.subWeapon && WEAPONS[state.subWeapon];
    dom.gameOverStats.innerHTML = `
      <div class="game-over-wave">REACHED WAVE ${state.wave}</div>
      <div class="stat-row"><span class="stat-label">SCORE</span><span class="stat-value">${state.score.toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">WAVE</span><span class="stat-value">${state.wave}</span></div>
      <div class="stat-row"><span class="stat-label">WEAPON</span><span class="stat-value" style="color:${wDef.color}">${wDef.icon} ${wDef.name}${subDef ? ` + ${subDef.icon} ${subDef.name}` : ''}</span></div>
      <div class="stat-row"><span class="stat-label">DIFFICULTY</span><span class="stat-value" style="color:${diff.color}">${diff.label}</span></div>
      <div class="stat-row"><span class="stat-label">WORDS TYPED</span><span class="stat-value">${state.wordsTyped}</span></div>
      <div class="stat-row"><span class="stat-label">MAX COMBO</span><span class="stat-value">x${state.maxCombo}</span></div>
      <div class="stat-row"><span class="stat-label">ACCURACY</span><span class="stat-value">${(state.keysCorrect + state.keysMissed) > 0 ? ((state.keysCorrect / (state.keysCorrect + state.keysMissed)) * 100).toFixed(1) : '100'}%</span></div>
      <div class="stat-row"><span class="stat-label">AVG WPM</span><span class="stat-value">${wpm}</span></div>
      <div class="stat-row"><span class="stat-label">TIME</span><span class="stat-value">${m}:${String(s).padStart(2, '0')}</span></div>
      ${rank >= 0 && rank < 10 ? `<div class="stat-row"><span class="stat-label">LEADERBOARD</span><span class="stat-value" style="color:#fbbf24">#${rank + 1}</span></div>` : ''}`;
  }

  function showMenu() {
    state.screen = 'menu';
    dom.gameOverScreen.classList.add('hidden');
    dom.upgradeScreen.classList.add('hidden');
    dom.hud.classList.add('hidden');
    dom.weaponScreen.classList.add('hidden');
    dom.pauseScreen.classList.add('hidden');
    dom.settingsScreen.classList.add('hidden');
    dom.scoresScreen.classList.add('hidden');
    dom.statsScreen.classList.add('hidden');
    dom.achievementsScreen.classList.add('hidden');
    dom.menuScreen.classList.remove('hidden');
  }

  // --- HUD helpers ---

  function getUpgradeById(id) {
    const branches = WEAPON_UPGRADE_BRANCHES;
    for (const w of Object.keys(branches || {})) {
      for (const b of Object.keys(branches[w] || {})) {
        const u = (branches[w][b] || []).find((x) => x.id === id);
        if (u) return u;
      }
    }
    const aug = AUGMENTATION_TYPES[id];
    if (aug) return { id: aug.id, icon: aug.icon, name: aug.label };
    return WAVE_CLEAR_CHOICES.find((u) => u.id === id) || ALL_UPGRADES.find((u) => u.id === id);
  }

  function updateUpgradeBar() {
    if (!dom.hudUpgrades) return;
    const counts = {};
    state.upgrades.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
    let html = '';
    Object.keys(counts).forEach((id) => {
      const upg = getUpgradeById(id);
      if (!upg) return;
      const badge = counts[id] > 1 ? `<span class="upg-badge">x${counts[id]}</span>` : '';
      html += `<div class="upg-icon" title="${upg.name}">${upg.icon}${badge}</div>`;
    });
    if (state.subWeapon && WEAPONS[state.subWeapon]) {
      const sw = WEAPONS[state.subWeapon];
      html += `<div class="upg-icon upg-icon--sub" title="Sub: ${sw.name}" style="border-color:${sw.color}66">${sw.icon}</div>`;
    }
    dom.hudUpgrades.innerHTML = html;
  }

  // --- Particles & effects ---

  function spawnParticles(x, y, color, count, speed = 3) {
    const density = getParticleDensity();
    const n = Math.max(1, Math.floor(count * density));
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, spd = (0.5 + Math.random()) * speed;
      particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, life: 1, decay: 0.015 + Math.random() * 0.025, size: 1 + Math.random() * 3, color });
    }
  }

  function spawnFloatingText(x, y, text, color) {
    floatingTexts.push({ x, y, text, color, life: 1, vy: -1.5 });
  }

  function spawnOrbs(x, y, totalValue, color) {
    const count = 3 + Math.floor(Math.random() * 4), perOrb = totalValue / count;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, spd = 1.5 + Math.random() * 2;
      orbs.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, value: perOrb, color, life: 1, phase: 0 });
    }
  }

  function spawnLightningArc(x1, y1, x2, y2, color) {
    const segs = [], steps = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, mx = x1 + (x2 - x1) * t, my = y1 + (y2 - y1) * t;
      const jit = (i === 0 || i === steps) ? 0 : (Math.random() - 0.5) * 30;
      const px = -(y2 - y1), py = x2 - x1, len = Math.sqrt(px * px + py * py) || 1;
      segs.push({ x: mx + (px / len) * jit, y: my + (py / len) * jit });
    }
    lightningArcs.push({ segments: segs, life: 1, color });
  }

  const SUB_WEAPON_DAMAGE_MULT = 0.6;

  function fireWeapon(enemy) {
    const w = state.weapon;
    if (w === 'bolt') fireBolt(enemy);
    else if (w === 'arc') fireArcBeam(enemy);
    else if (w === 'shrapnel') fireShrapnelCannon(enemy);
    else if (w === 'venom') fireVenomSpit(enemy);
    else if (w === 'pulse') firePulseNova(enemy);
    else if (w === 'ricochet') fireRicochetDisc(enemy);
    else fireBolt(enemy);

    if (state.subWeapon) {
      const saved = state.damageMultiplier;
      state.damageMultiplier *= SUB_WEAPON_DAMAGE_MULT;
      const sw = state.subWeapon;
      if (sw === 'bolt') fireBolt(enemy);
      else if (sw === 'arc') fireArcBeam(enemy);
      else if (sw === 'shrapnel') fireShrapnelCannon(enemy);
      else if (sw === 'venom') fireVenomSpit(enemy);
      else if (sw === 'pulse') firePulseNova(enemy);
      else if (sw === 'ricochet') fireRicochetDisc(enemy);
      else fireBolt(enemy);
      state.damageMultiplier = saved;
    }
  }

  function fireProjectile(enemy, color) {
    const a = Math.atan2(enemy.y - player.y, enemy.x - player.x), spd = 12 * state.projectileSpeed * state.comboSpeedBoost;
    const precomputed = computeDamageMult(enemy);
    projectiles.push({
      x: player.x, y: player.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
      target: enemy, life: 3, color: color || enemy.color, type: 'bolt',
      damage: 1, source: 'weapon', precomputed,
    });
  }

  // Bolt Caster — standard projectile
  function fireBolt(enemy) {
    fireProjectile(enemy, '#00f0ff');
    audio.fireBolt();
  }

  // Arc Beam — traveling beam that chains to nearby enemies
  function fireArcBeam(enemy) {
    const beamSpeed = 6;
    const precomputed = computeDamageMult(enemy);
    beamProjectiles.push({
      x1: player.x, y1: player.y, x2: enemy.x, y2: enemy.y,
      progress: 0, maxProgress: 1, speed: beamSpeed,
      target: enemy, color: '#a78bfa', damage: 1, source: 'weapon', precomputed,
    });

    const chainRange = Math.min(ARC_MAX_CHAIN_RANGE, 200 * (state.arcChainRange || 1));
    const maxBounces = 2 + (state.arcChainBounces || 0);
    const chainTargets = enemies
      .filter((e) => e !== enemy && e.hp > 0 && Math.hypot(e.x - enemy.x, e.y - enemy.y) < chainRange)
      .sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y))
      .slice(0, maxBounces);

    let prev = enemy;
    chainTargets.forEach((ce) => {
      const isCrit = Math.random() < state.critChance;
      const chainBase = 0.5 + (state.arcChainDamageMult || 0);
      const mult = state.damageMultiplier * chainBase * (isCrit ? 2 : 1) * (state.doubleTimer > 0 ? 2 : 1);
      beamProjectiles.push({
        x1: prev.x, y1: prev.y, x2: ce.x, y2: ce.y,
        progress: 0, maxProgress: 1, speed: beamSpeed * 1.2,
        target: ce, color: '#c4b5fd', chain: true,
        damage: 1, source: 'weapon', precomputed: { isCrit, mult },
      });
      prev = ce;
    });
    audio.fireArc();
  }

  // Shrapnel Cannon — fires 5 + upgrades fragments in a cone
  function fireShrapnelCannon(enemy) {
    const baseAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
    const spread = (Math.PI / 6) * (state.shrapnelSpread || 1);
    const spd = 10 * state.projectileSpeed;
    const count = Math.min(SHRAPNEL_COUNT_MAX, 5 + (state.shrapnelCount || 0));
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * (spread / 2);
      const a = baseAngle + offset + (Math.random() - 0.5) * 0.05;
      projectiles.push({
        x: player.x, y: player.y,
        vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        target: null, life: 1.5, color: '#f59e0b',
        type: 'shrapnel', damage: 0.6, pierced: new Set(),
      });
    }
    state.shakeAmount = 3;
    audio.fireShrapnel();
  }

  // Venom Spitter — slow glob that leaves a poison pool
  function fireVenomSpit(enemy) {
    const a = Math.atan2(enemy.y - player.y, enemy.x - player.x), spd = 7 * state.projectileSpeed;
    projectiles.push({
      x: player.x, y: player.y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
      target: enemy, life: 4, color: '#4ade80',
      type: 'venom', poolX: enemy.x, poolY: enemy.y,
    });
    audio.fireVenom();
  }

  // Pulse Nova — expanding damage ring, damage when ring reaches each enemy
  function firePulseNova(enemy) {
    const maxRadius = Math.min(PULSE_MAX_RADIUS, 160 * (state.pulseRadius || 1));
    const pulseSpeed = 350 * (state.pulseSpeedMult || 1);
    const damageTargets = [];
    enemies.forEach((e) => {
      if (e.hp <= 0) return;
      const d = Math.hypot(e.x - player.x, e.y - player.y);
      if (d < maxRadius) {
        const falloff = 1 - (d / maxRadius) * 0.7;
        const isCrit = Math.random() < state.critChance;
        let mult = state.damageMultiplier * (state.pulseDamageMult || 1) * falloff * (isCrit ? 2 : 1);
        if (state.doubleTimer > 0) mult *= 2;
        damageTargets.push({ enemy: e, dist: d, precomputed: { isCrit, mult } });
      }
    });
    shockwaveRings.push({
      x: player.x, y: player.y, radius: 20, maxRadius,
      life: 1, color: '#f472b6', speed: pulseSpeed,
      damageTargets, hitEnemies: new Set(),
    });

    state.shakeAmount = 6;
    audio.firePulse();
  }

  // Ricochet Disc — bouncing projectile
  function fireRicochetDisc(enemy) {
    const a = Math.atan2(enemy.y - player.y, enemy.x - player.x), spd = 14 * state.projectileSpeed;
    projectiles.push({
      x: player.x, y: player.y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
      target: enemy, life: 4, color: '#fbbf24',
      type: 'ricochet', bouncesLeft: 3 + (state.ricochetBounces || 0), hitEnemies: new Set(), damageMult: 1,
    });
    audio.fireRicochet();
  }

  function fireDroneProjectile(dx, dy, enemy) {
    const a = Math.atan2(enemy.y - dy, enemy.x - dx);
    const isCrit = Math.random() < state.critChance;
    const mult = state.damageMultiplier * (isCrit ? 2 : 1) * (state.doubleTimer > 0 ? 2 : 1);
    projectiles.push({
      x: dx, y: dy, vx: Math.cos(a) * 14, vy: Math.sin(a) * 14,
      target: enemy, life: 3, color: '#f472b6',
      damage: 1, source: 'drone', precomputed: { isCrit, mult },
    });
  }

  function triggerMeteorStrike(marker) {
    const fallSpeed = 180;
    projectiles.push({
      x: marker.x, y: marker.y - 150, vx: 0, vy: fallSpeed,
      type: 'meteor', life: 5, color: '#f59e0b',
      targetX: marker.x, targetY: marker.y, aoeRadius: 80,
    });
    state.shakeAmount = 4;
  }

  // --- Damage & kill ---

  const WEAPON_MASTERY = {
    bolt: { 25: () => { state.damageMultiplier *= 1.1; }, 50: () => { state.projectileSpeed *= 1.15; } },
    arc: { 25: () => { state.arcChainRange = (state.arcChainRange || 1) * 1.25; }, 50: () => { state.arcChainBounces = (state.arcChainBounces || 0) + 1; } },
    shrapnel: { 25: () => { state.shrapnelCount = (state.shrapnelCount || 0) + 1; }, 50: () => { state.damageMultiplier *= 1.2; } },
    venom: { 25: () => { state.venomPoolRadius = (state.venomPoolRadius || 1) * 1.2; }, 50: () => { state.venomPoolDuration = (state.venomPoolDuration || 0) + 1; } },
    pulse: { 25: () => { state.pulseRadius = (state.pulseRadius || 1) * 1.2; }, 50: () => { state.damageMultiplier *= 1.15; } },
    ricochet: { 25: () => { state.ricochetBounces = (state.ricochetBounces || 0) + 1; }, 50: () => { state.ricochetBounceMult = (state.ricochetBounceMult || 0.7) + 0.15; } },
  };

  function applyWeaponMastery(weapon, kills) {
    const applied = state.weaponMasteryApplied || {};
    const milestones = WEAPON_MASTERY[weapon];
    if (!milestones) return;
    [25, 50].forEach((m) => {
      if (kills >= m && (applied[weapon] || 0) < m) {
        milestones[m]();
        applied[weapon] = m;
        spawnFloatingText(player.x, player.y - 50, `${WEAPONS[weapon]?.name || weapon} MASTERY ${m}!`, '#fbbf24');
      }
    });
  }

  function damageEnemy(enemy, damage, source, precomputed) {
    let isCrit, mult;
    if (precomputed) {
      isCrit = precomputed.isCrit;
      mult = precomputed.mult;
    } else {
      isCrit = Math.random() < (state.critChance + state.comboCritBoost);
      mult = state.damageMultiplier * (isCrit ? 2 : 1);
      if (state.doubleTimer > 0) mult *= 2;
      const clickBonus = source === 'weapon' && state.targetEnemy === enemy && state.targetChosenViaClick &&
        Math.random() < (state.clickTargetCritChance ?? 0.1);
      if (clickBonus) {
        mult *= (state.clickTargetCritMult ?? 2);
        spawnFloatingText(enemy.x, enemy.y - 35, 'TARGET LOCK!', '#38bdf8');
        state.critFlashTimer = 0.12;
      }
    }
    enemy.hp -= damage * mult;
    if (isCrit) { spawnFloatingText(enemy.x, enemy.y - 30, 'CRIT!', '#fbbf24'); state.critFlashTimer = 0.15; }
    if (precomputed?.showTargetLock) { spawnFloatingText(enemy.x, enemy.y - 35, 'TARGET LOCK!', '#38bdf8'); state.critFlashTimer = 0.12; }
    if (state.cryoChance && Math.random() < state.cryoChance) {
      enemy.cryoUntil = performance.now() + 2000;
      spawnParticles(enemy.x, enemy.y, '#67e8f9', 5, 1);
    }
    if (enemy.hp <= 0) killEnemy(enemy, source);
  }

  function computeDamageMult(enemy) {
    const isCrit = Math.random() < (state.critChance + state.comboCritBoost);
    let mult = state.damageMultiplier * (isCrit ? 2 : 1);
    if (state.doubleTimer > 0) mult *= 2;
    const clickBonus = state.targetEnemy === enemy && state.targetChosenViaClick &&
      Math.random() < (state.clickTargetCritChance ?? 0.1);
    if (clickBonus) mult *= (state.clickTargetCritMult ?? 2);
    return { isCrit, mult, showTargetLock: clickBonus };
  }

  function checkStreakMilestone() {
    for (let i = STREAK_TITLES.length - 1; i >= 0; i--) {
      const s = STREAK_TITLES[i];
      if (state.combo >= s.threshold && state.lastStreakThreshold < s.threshold) {
        state.lastStreakThreshold = s.threshold;
        const el = document.createElement('div');
        el.className = 'streak-announce'; el.textContent = s.text;
        el.style.color = s.color; el.style.textShadow = `0 0 40px ${s.color}`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
        audio.streak(i); state.shakeAmount = 6;
        spawnParticles(player.x, player.y, s.color, 30, 6);
        break;
      }
    }
  }

  const COMBO_MILESTONES = [
    { combo: 10, label: 'SWIFT', color: '#4ade80', apply: (s) => { s.comboSpeedBoost = 1.3; s.comboSpeedTimer = 8; } },
    { combo: 15, label: 'VAMPIRIC', color: '#ef4444', apply: (s) => { const h = Math.min(10, s.maxHp - s.hp); s.hp += h; spawnFloatingText(player.x, player.y - 40, `+${h} HP`, '#4ade80'); } },
    { combo: 20, label: 'OVERCHARGE', color: '#fbbf24', apply: (s) => { s.doubleTimer = Math.max(s.doubleTimer, 6); } },
    { combo: 30, label: 'CRITICAL SURGE', color: '#a78bfa', apply: (s) => { s.comboCritBoost = 0.25; s.comboCritTimer = 10; } },
    { combo: 50, label: 'GODMODE', color: '#00f0ff', apply: (s) => { s.shieldHits = Math.max(s.shieldHits, 3); } },
  ];

  function checkComboMilestone() {
    if (!state.comboMilestonesHit) state.comboMilestonesHit = new Set();
    COMBO_MILESTONES.forEach((m) => {
      if (state.combo >= m.combo && !state.comboMilestonesHit.has(m.combo)) {
        state.comboMilestonesHit.add(m.combo);
        m.apply(state);
        audio.powerUp();
        const announce = document.createElement('div');
        announce.className = 'powerup-announce';
        announce.textContent = `COMBO ${m.combo}: ${m.label}`;
        announce.style.color = m.color;
        announce.style.textShadow = `0 0 30px ${m.color}`;
        document.body.appendChild(announce);
        setTimeout(() => announce.remove(), 2000);
        spawnParticles(player.x, player.y, m.color, 20, 5);
      }
    });
  }

  function killEnemy(enemy, source) {
    if (source === 'weapon' && state.weaponKills && state.weapon) {
      const w = state.weapon;
      if (state.weaponKills[w] !== undefined) {
        state.weaponKills[w]++;
        applyWeaponMastery(w, state.weaponKills[w]);
      }
    }
    const def = ENEMY_TYPES[enemy.type];
    const isBossOrMiniboss = isBossType(enemy.type) || enemy.type === 'miniboss';
    spawnParticles(enemy.x, enemy.y, enemy.color, isBossOrMiniboss ? 50 : 20, isBossOrMiniboss ? 8 : 5);
    state.shakeAmount = isBossOrMiniboss ? 12 : 4;
    state.combo++; state.comboTimer = 3;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.enemiesKilled = (state.enemiesKilled || 0) + 1;
    if (isBossOrMiniboss) state.bossKills = (state.bossKills || 0) + 1;
    state.exp = (state.exp || 0) + (isBossOrMiniboss ? 2 : 1);
    if (state.exp >= (state.expToNextLevel || 5)) {
      state.level = (state.level || 1) + 1;
      state.exp = 0;
      state.expToNextLevel = 5 + (state.level - 1) * 2;
      setTimeout(() => {
        if (state.screen !== 'playing') return;
        const mainChoices = getNextBranchUpgrades();
        if (mainChoices.length > 0) {
          showWeaponUpgradeScreen();
        } else if (!state.subWeapon) {
          showSubWeaponChoiceScreen();
        } else {
          const subChoices = getNextSubWeaponBranchUpgrades();
          if (subChoices.length > 0) {
            showSubWeaponUpgradeScreen();
          }
        }
      }, 400);
    }
    checkStreakMilestone();
    checkComboMilestone();

    const comboMult = 1 + Math.floor(state.combo / 5) * 0.5;
    const score = Math.round(def.scoreValue * comboMult * state.scoreMultiplier);
    state.score += score;
    spawnFloatingText(enemy.x, enemy.y - 20, `+${score}`, '#00f0ff');
    spawnOrbs(enemy.x, enemy.y, score * 0.1, enemy.color);

    if (isBossOrMiniboss) {
      audio.bossKill();
      shockwaveRings.push({ x: enemy.x, y: enemy.y, radius: 10, maxRadius: 300, life: 1, color: '#ff2d55', speed: 400 });
      const announce = document.createElement('div');
      announce.className = 'streak-announce';
      announce.textContent = 'BOSS DEFEATED';
      announce.style.color = '#ff2d55';
      announce.style.textShadow = '0 0 40px rgba(255,45,85,0.6)';
      document.body.appendChild(announce);
      setTimeout(() => announce.remove(), 2500);
    } else {
      audio.killEnemy(state.combo);
    }

    if (enemy.type === 'bossSplitter') {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
        const fx = enemy.x + Math.cos(a) * 40;
        const fy = enemy.y + Math.sin(a) * 40;
        const fDef = ENEMY_TYPES.fragment;
        const fw = getWord(WORDS_EASY);
        enemies.push({
          x: fx, y: fy, type: 'fragment', word: fw, typedIndex: 0,
          hp: fDef.hp, maxHp: fDef.hp,
          speed: fDef.speed * (1 + state.wave * 0.04),
          size: fDef.size, sides: fDef.sides, color: fDef.color,
          scoreValue: fDef.scoreValue, angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 3, pulsePhase: Math.random() * Math.PI * 2,
          targeted: false, spawnTime: performance.now(), spawnAlpha: 0.6,
        });
      }
    } else if (enemy.type === 'splitter') {
      for (let i = 0; i < 1; i++) {
        const a = Math.random() * Math.PI * 2;
        const fx = enemy.x + Math.cos(a) * 30;
        const fy = enemy.y + Math.sin(a) * 30;
        const fDef = ENEMY_TYPES.fragment;
        const fw = getWord(WORDS_EASY);
        const fragSpeedMult = state.wave <= 4 ? 0.8 : (1 + state.wave * 0.04);
        enemies.push({
          x: fx, y: fy, type: 'fragment', word: fw, typedIndex: 0,
          hp: fDef.hp, maxHp: fDef.hp,
          speed: fDef.speed * fragSpeedMult,
          size: fDef.size, sides: fDef.sides, color: fDef.color,
          scoreValue: fDef.scoreValue, angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 3, pulsePhase: Math.random() * Math.PI * 2,
          targeted: false, spawnTime: performance.now(), spawnAlpha: 0.6,
        });
      }
    }

    if (state.gamblerCurse) {
      const roll = Math.random();
      if (roll < 0.33) {
        state.hp = Math.min(state.maxHp, state.hp + 15);
        spawnFloatingText(player.x, player.y - 40, 'GAMBLER: +15 HP', '#4ade80');
        spawnParticles(player.x, player.y, '#4ade80', 10, 2);
      } else if (roll < 0.66) {
        state.hp = Math.max(0, state.hp - 10);
        spawnFloatingText(player.x, player.y - 40, 'GAMBLER: -10 HP', '#ef4444');
        spawnParticles(player.x, player.y, '#ef4444', 10, 2);
        if (state.hp <= 0) showGameOver();
      }
    }
    if (state.combo > 0 && state.combo % 5 === 0) {
      spawnFloatingText(player.x, player.y - 40, `COMBO x${state.combo}!`, '#f472b6');
    }
    state.wordsTyped++;

    if (source !== 'drone') {
      if (state.knockbackForce > 0 || state.bombTimer > 0) {
        const bombRadius = state.bombTimer > 0 ? 180 : 200;
        const bombDamage = state.bombTimer > 0 ? 50 : 0;
        shockwaveRings.push({ x: enemy.x, y: enemy.y, radius: 10, maxRadius: bombRadius, life: 1, color: state.bombTimer > 0 ? '#f97316' : '#fbbf24', speed: 300 });
        if (bombDamage > 0) {
          enemies.forEach((e) => {
            if (e === enemy || e.hp <= 0) return;
            const d = Math.hypot(e.x - enemy.x, e.y - enemy.y);
            if (d < bombRadius) { e.hp -= bombDamage; spawnParticles(e.x, e.y, '#f97316', 5, 2); if (e.hp <= 0) killEnemy(e); }
          });
        }
      }

      if (state.knockbackForce > 0) {
        enemies.forEach((e) => {
          if (e === enemy || e.hp <= 0) return;
          const dx = e.x - enemy.x, dy = e.y - enemy.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200 && d > 0) { const force = Math.min(KNOCKBACK_FORCE_MAX, state.knockbackForce); const f = force / d; e.x += dx * f; e.y += dy * f; }
        });
      }

      if (state.chainDamage > 0) {
        enemies.forEach((e) => {
          if (e === enemy || e.hp <= 0) return;
          const dx = e.x - enemy.x, dy = e.y - enemy.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) { const dmg = Math.min(CHAIN_DAMAGE_MAX, state.chainDamage); e.hp -= dmg; spawnParticles(e.x, e.y, '#fbbf24', 5, 2); spawnLightningArc(enemy.x, enemy.y, e.x, e.y, '#fbbf24'); if (e.hp <= 0) killEnemy(e); }
        });
      }

      if (state.extraProjectiles > 0) {
        const cap = Math.min(EXTRA_PROJECTILES_MAX, state.extraProjectiles);
        const nearby = enemies.filter((e) => e !== enemy && e.hp > 0).sort((a, b) => Math.hypot(a.x - enemy.x, a.y - enemy.y) - Math.hypot(b.x - enemy.x, b.y - enemy.y)).slice(0, cap);
        nearby.forEach((e) => {
          const a = Math.atan2(e.y - enemy.y, e.x - enemy.x), spd = 10 * state.projectileSpeed;
          const precomputed = computeDamageMult(e);
          projectiles.push({
            x: enemy.x, y: enemy.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
            target: e, life: 2, color: '#fbbf24', type: 'bolt',
            damage: 1, source: 'weapon', precomputed,
          });
        });
      }
    }

    enemy.hp = -999;
    if (state.targetEnemy === enemy) { state.targetEnemy = null; state.currentInput = ''; }

    if (isBossType(enemy.type)) {
      forcePowerDrop(enemy.x, enemy.y);
      trySpawnAugmentationDrop(enemy.x, enemy.y, true);
    } else {
      trySpawnPowerDrop(enemy.x, enemy.y);
      trySpawnAugmentationDrop(enemy.x, enemy.y, false);
    }
  }

  // --- Auto-typer ---

  function updateAutoTyper(dt) {
    const droneCount = Math.min(2, state.autoTyperCount || 0);
    if (droneCount <= 0) return;
    state.autoTyperTimer -= dt;
    if (state.autoTyperTimer > 0) return;
    const fireRate = state.droneFireRate || 1;
    state.autoTyperTimer = 5 / (droneCount * fireRate);
    const cands = enemies.filter((e) => e.hp > 0 && e !== state.targetEnemy && e.spawnAlpha >= 0.8)
      .sort((a, b) => a.word.length - b.word.length || Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y));
    if (!cands.length) return;
    const tgt = cands[0], t = performance.now() / 1000, da = t * 2;
    fireDroneProjectile(player.x + Math.cos(da) * 40, player.y + Math.sin(da) * 40, tgt);
    audio.droneShot();
  }

  function handleWordCompletionEffects(completedWord) {
    if (state.spectreEnabled && completedWord) {
      const count = (completedWord.match(/[aeo]/gi) || []).length;
      for (let i = 0; i < count; i++) {
        const nearest = enemies.filter((e) => e.hp > 0).sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))[0];
        if (nearest) {
          spectreDrones.push({
            x: player.x, y: player.y, target: nearest, life: 3, speed: 18,
            color: '#c084fc', cooldown: 0,
          });
        }
      }
    }
    if (state.minefieldEnabled && completedWord && ['f', 'g', 'h', 'i'].includes(completedWord[0].toLowerCase())) {
      const nearest = enemies.filter((e) => e.hp > 0).sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))[0];
      const a = nearest ? Math.atan2(nearest.y - player.y, nearest.x - player.x) : Math.random() * Math.PI * 2;
      const spd = 4;
      mines.push({
        x: player.x, y: player.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        life: 5, radius: 40, color: '#f59e0b',
      });
    }
  }

  // --- Input ---

  function handleKeyDown(e) {
    if (state.screen === 'upgrade') {
      e.preventDefault();
      const key = e.key.toLowerCase();
      if (key === 'backspace') {
        state.upgradeInput = (state.upgradeInput || '').slice(0, -1);
        if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = state.upgradeInput ? `Typing: ${state.upgradeInput}` : 'Type the word to select';
        return;
      }
      if (key.length === 1 && /[a-z]/.test(key)) {
        state.upgradeInput = (state.upgradeInput || '') + key;
        if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = `Typing: ${state.upgradeInput}`;
        const choices = window._upgradeChoices || [];
        const match = choices.find((c) => c.word === state.upgradeInput);
        if (match) {
          state.upgradeInput = '';
          if (dom.upgradeInputHint) dom.upgradeInputHint.textContent = 'Type the word to select';
          if (match.isSkip) {
            dom.upgradeScreen.classList.add('hidden');
            state.screen = 'playing';
            checkWaveClearAfterLevelUp();
          } else if (state.upgradePhase === 'weapon') {
            selectWeaponUpgrade(match.upg, match.branch);
          } else if (state.upgradePhase === 'subWeaponSelect') {
            selectSubWeapon(match.id);
          } else if (state.upgradePhase === 'subWeaponUpgrade') {
            selectSubWeaponUpgrade(match.upg, match.branch);
          } else {
            selectWaveClearChoice(match);
          }
        }
      }
      return;
    }
    if (state.screen === 'weaponSelect') {
      e.preventDefault();
      const key = e.key.toLowerCase();
      if (key === 'backspace') {
        state.upgradeInput = (state.upgradeInput || '').slice(0, -1);
        return;
      }
      if (key.length === 1 && /[a-z]/.test(key)) {
        state.upgradeInput = (state.upgradeInput || '') + key;
        const choices = window._weaponChoices || [];
        const match = choices.find((c) => c.word === state.upgradeInput);
        if (match) selectWeapon(match.key);
      }
      return;
    }
    if (state.screen === 'paused') {
      e.preventDefault();
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') togglePause();
      return;
    }
    if (state.screen !== 'playing') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    const key = e.key.toLowerCase();

    if (key === 'escape') {
      if (state.currentInput.length > 0 || state.targetEnemy || state.targetDrop || state.targetAugDrop || state.targetMeteorMarker) {
        state.targetEnemy = null; state.targetDrop = null; state.targetAugDrop = null; state.targetChosenViaClick = false; state.currentInput = '';
        if (state.targetMeteorMarker) { state.targetMeteorMarker.targeted = false; state.targetMeteorMarker.typedIndex = 0; state.targetMeteorMarker = null; }
        enemies.forEach((en) => (en.targeted = false));
        powerDrops.forEach((d) => { d.targeted = false; d.typedIndex = 0; });
        augmentationDrops.forEach((d) => { d.targeted = false; d.typedIndex = 0; });
      } else {
        togglePause();
      }
      return;
    }
    if (key === 'backspace') {
      if (state.currentInput.length > 0) {
        state.currentInput = state.currentInput.slice(0, -1);
        if (state.targetEnemy) state.targetEnemy.typedIndex = state.currentInput.length;
        if (state.targetDrop) state.targetDrop.typedIndex = state.currentInput.length;
        if (state.targetAugDrop) state.targetAugDrop.typedIndex = state.currentInput.length;
        if (state.targetMeteorMarker) state.targetMeteorMarker.typedIndex = state.currentInput.length;
      }
      return;
    }
    if (key === 'tab') {
      e.preventDefault();
      const alive = enemies.filter((e) => e.hp > 0 && e.spawnAlpha >= 0.5).sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y));
      if (alive.length > 0) {
        const idx = state.targetEnemy ? (alive.indexOf(state.targetEnemy) + 1) % alive.length : 0;
        const next = alive[idx];
        if (state.targetEnemy) { state.targetEnemy.targeted = false; state.targetEnemy.typedIndex = 0; }
        state.targetEnemy = next;
        state.targetEnemy.targeted = true;
        state.targetEnemy.typedIndex = 0;
        state.targetDrop = null;
        state.targetAugDrop = null;
        state.targetMeteorMarker = null;
        state.currentInput = '';
        state.targetChosenViaClick = true;
      }
      return;
    }
    if (key.length !== 1 || !/[a-z]/.test(key)) return;

    state.totalCharsTyped++;
    audio.typeKey();

    // Helper: try to acquire a new target starting with `key`
    function tryAcquireNewTarget(key, excludeEnemy, excludeDrop, excludeAugDrop, excludeMeteor) {
      const meteorMatches = meteorMarkers.filter((mm) => mm.word[0] === key && mm !== excludeMeteor);
      if (meteorMatches.length > 0) {
        meteorMatches.sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y));
        clearCurrentTarget();
        state.targetMeteorMarker = meteorMatches[0];
        state.targetMeteorMarker.targeted = true;
        state.currentInput = key;
        state.targetMeteorMarker.typedIndex = 1;
        if (state.targetMeteorMarker.word.length === 1) {
          triggerMeteorStrike(state.targetMeteorMarker);
          meteorMarkers = meteorMarkers.filter((mm) => mm !== state.targetMeteorMarker);
          state.targetMeteorMarker = null;
          state.currentInput = '';
        }
        return true;
      }
      const powerMatches = powerDrops.filter((d) => d.word[0] === key && d !== excludeDrop);
      const augMatches = augmentationDrops.filter((d) => d.word[0] === key && d !== excludeAugDrop);
      const allDrops = powerMatches.map((d) => ({ d, isAug: false })).concat(augMatches.map((d) => ({ d, isAug: true })));
      if (allDrops.length > 0) {
        allDrops.sort((a, b) => Math.hypot(a.d.x - player.x, a.d.y - player.y) - Math.hypot(b.d.x - player.x, b.d.y - player.y));
        const chosen = allDrops[0];
        clearCurrentTarget();
        state.targetChosenViaClick = false;
        state.keysCorrect++;
        if (chosen.isAug) {
          state.targetAugDrop = chosen.d;
          state.targetAugDrop.targeted = true;
          state.currentInput = key;
          state.targetAugDrop.typedIndex = 1;
          if (state.targetAugDrop.word.length === 1) {
            const drop = state.targetAugDrop;
            activateAugmentationDrop(drop);
            augmentationDrops = augmentationDrops.filter((d) => d !== drop);
          }
        } else {
          state.targetDrop = chosen.d;
          state.targetDrop.targeted = true;
          state.currentInput = key;
          state.targetDrop.typedIndex = 1;
          if (state.targetDrop.word.length === 1) {
            const drop = state.targetDrop;
            activatePowerDrop(drop);
            powerDrops = powerDrops.filter((d) => d !== drop);
          }
        }
        return true;
      }
      const enemyMatches = enemies.filter((en) => {
        if (en.hp <= 0 || en.spawnAlpha < 0.5 || en === excludeEnemy) return false;
        if ((en.type === 'shielder' || en.type === 'bossShielded') && en.shieldActive) return en.shieldWord[0] === key;
        return en.word[0] === key;
      });
      if (enemyMatches.length > 0) {
        enemyMatches.sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y));
        clearCurrentTarget();
        state.targetChosenViaClick = false;
        state.keysCorrect++;
        state.targetEnemy = enemyMatches[0];
        state.targetEnemy.targeted = true;
        state.currentInput = key;
        if ((state.targetEnemy.type === 'shielder' || state.targetEnemy.type === 'bossShielded') && state.targetEnemy.shieldActive) {
          state.targetEnemy.shieldTypedIndex = 1;
        } else {
          state.targetEnemy.typedIndex = 1;
          if (state.targetEnemy.word.length === 1) {
            const completedWord = state.targetEnemy.word;
            fireWeapon(state.targetEnemy);
            handleWordCompletionEffects(completedWord);
            state.currentInput = '';
          }
        }
        return true;
      }
      return false;
    }

    function clearCurrentTarget() {
      if (state.targetEnemy) {
        state.targetEnemy.targeted = false; state.targetEnemy.typedIndex = 0;
        if (state.targetEnemy.shieldTypedIndex !== undefined) state.targetEnemy.shieldTypedIndex = 0;
        state.targetEnemy = null;
      }
      if (state.targetDrop) { state.targetDrop.targeted = false; state.targetDrop.typedIndex = 0; state.targetDrop = null; }
      if (state.targetAugDrop) { state.targetAugDrop.targeted = false; state.targetAugDrop.typedIndex = 0; state.targetAugDrop = null; }
      if (state.targetMeteorMarker) { state.targetMeteorMarker.targeted = false; state.targetMeteorMarker.typedIndex = 0; state.targetMeteorMarker = null; }
      state.targetChosenViaClick = false;
      state.currentInput = '';
    }

    // Currently targeting a meteor marker
    if (state.targetMeteorMarker) {
      const mm = state.targetMeteorMarker;
      const expected = mm.word[state.currentInput.length];
      if (key === expected) {
        state.keysCorrect++;
        state.currentInput += key;
        mm.typedIndex = state.currentInput.length;
        if (state.currentInput.length === mm.word.length) {
          triggerMeteorStrike(mm);
          meteorMarkers = meteorMarkers.filter((m) => m !== mm);
          state.targetMeteorMarker = null;
          state.currentInput = '';
        }
      } else if (!tryAcquireNewTarget(key, null, null, null, mm)) {
        state.keysMissed++;
        state.combo = 0; state.lastStreakThreshold = 0;
        state.currentInput = '';
        mm.typedIndex = 0;
        state.targetMeteorMarker = null;
        audio.invalid();
        spawnParticles(player.x, player.y - 20, '#ef4444', 3, 1);
      }
      return;
    }

    // Currently targeting an augmentation drop
    if (state.targetAugDrop) {
      const expected = state.targetAugDrop.word[state.currentInput.length];
      if (key === expected) {
        state.keysCorrect++;
        state.currentInput += key;
        state.targetAugDrop.typedIndex = state.currentInput.length;
        if (state.currentInput.length === state.targetAugDrop.word.length) {
          const drop = state.targetAugDrop;
          activateAugmentationDrop(drop);
          augmentationDrops = augmentationDrops.filter((d) => d !== drop);
        }
      } else if (!tryAcquireNewTarget(key, null, null, state.targetAugDrop, null)) {
        state.keysMissed++;
        state.combo = 0; state.lastStreakThreshold = 0;
        state.currentInput = '';
        state.targetAugDrop.typedIndex = 0;
        audio.invalid();
        spawnParticles(player.x, player.y - 20, '#ef4444', 3, 1);
      }
      return;
    }

    // Currently targeting a power drop
    if (state.targetDrop) {
      const expected = state.targetDrop.word[state.currentInput.length];
      if (key === expected) {
        state.keysCorrect++;
        state.currentInput += key;
        state.targetDrop.typedIndex = state.currentInput.length;
        if (state.currentInput.length === state.targetDrop.word.length) {
          const drop = state.targetDrop;
          activatePowerDrop(drop);
          powerDrops = powerDrops.filter((d) => d !== drop);
        }
      } else if (!tryAcquireNewTarget(key, null, state.targetDrop, null, null)) {
        state.keysMissed++;
        state.combo = 0; state.lastStreakThreshold = 0;
        state.currentInput = '';
        state.targetDrop.typedIndex = 0;
        audio.invalid();
        spawnParticles(player.x, player.y - 20, '#ef4444', 3, 1);
      }
      return;
    }

    // Currently targeting an enemy
    if (state.targetEnemy) {
      const te = state.targetEnemy;
      if ((te.type === 'shielder' || te.type === 'bossShielded') && te.shieldActive) {
        const expected = te.shieldWord[te.shieldTypedIndex];
        if (key === expected) {
          state.keysCorrect++;
          state.currentInput += key;
          te.shieldTypedIndex++;
          if (te.shieldTypedIndex >= te.shieldWord.length) {
            te.shieldActive = false;
            state.currentInput = '';
            te.typedIndex = 0;
            spawnParticles(te.x, te.y, '#38bdf8', 15, 4);
            spawnFloatingText(te.x, te.y - 30, 'SHIELD BROKEN!', '#38bdf8');
            audio.shieldBreak();
          }
        } else if (!tryAcquireNewTarget(key, te, null, null, null)) {
          state.keysMissed++;
          state.combo = 0; state.lastStreakThreshold = 0;
          state.currentInput = '';
          te.shieldTypedIndex = 0;
          te.missFlashTimer = 0.4;
          audio.invalid();
          spawnParticles(player.x, player.y - 20, '#ef4444', 3, 1);
        }
      } else {
        const expected = te.word[state.currentInput.length];
        if (key === expected) {
          state.keysCorrect++;
          state.currentInput += key;
          te.typedIndex = state.currentInput.length;
          if (state.currentInput.length === te.word.length) {
            const completedWord = te.word;
            fireWeapon(te);
            handleWordCompletionEffects(completedWord);
            state.currentInput = '';
            if (te.hp > 1) {
              te.word = getWord();
              te.typedIndex = 0;
            }
          }
        } else if (!tryAcquireNewTarget(key, te, null, null, null)) {
          state.keysMissed++;
          state.combo = 0; state.lastStreakThreshold = 0;
          state.currentInput = '';
          te.typedIndex = 0;
          te.missFlashTimer = 0.4;
          audio.invalid();
          spawnParticles(player.x, player.y - 20, '#ef4444', 3, 1);
        }
      }
      return;
    }

    // No target -- find one among drops and enemies
    if (!tryAcquireNewTarget(key, null, null, null, null)) {
      state.combo = 0; state.lastStreakThreshold = 0;
    }
  }

  function screenToWorld(screenX, screenY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const sx = (screenX - rect.left) * scaleX;
    const sy = (screenY - rect.top) * scaleY;
    return {
      x: (sx - W / 2) / CAMERA_ZOOM + player.x,
      y: (sy - H / 2) / CAMERA_ZOOM + player.y,
    };
  }

  function selectTargetViaClick(worldX, worldY) {
    if (state.screen !== 'playing') return;
    const alive = enemies.filter((e) => e.hp > 0 && e.spawnAlpha >= 0.5);
    const hit = alive.find((e) => Math.hypot(e.x - worldX, e.y - worldY) < e.size + 15);
    if (hit) {
      if (state.targetEnemy) { state.targetEnemy.targeted = false; state.targetEnemy.typedIndex = 0; }
      state.targetEnemy = hit;
      state.targetEnemy.targeted = true;
      state.targetEnemy.typedIndex = 0;
      state.targetDrop = null;
      state.targetAugDrop = null;
      state.targetMeteorMarker = null;
      state.currentInput = '';
      state.targetChosenViaClick = true;
    }
  }

  canvas.addEventListener('click', (e) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    selectTargetViaClick(x, y);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!dom.scoresScreen.classList.contains('hidden')) {
        dom.scoresScreen.classList.add('hidden');
        dom.menuScreen.classList.remove('hidden');
        e.preventDefault();
        return;
      }
      if (!dom.statsScreen.classList.contains('hidden')) {
        dom.statsScreen.classList.add('hidden');
        dom.menuScreen.classList.remove('hidden');
        e.preventDefault();
        return;
      }
      if (!dom.settingsScreen.classList.contains('hidden')) {
        dom.settingsScreen.classList.add('hidden');
        dom.menuScreen.classList.remove('hidden');
        e.preventDefault();
        return;
      }
      if (!dom.achievementsScreen.classList.contains('hidden')) {
        dom.achievementsScreen.classList.add('hidden');
        dom.menuScreen.classList.remove('hidden');
        e.preventDefault();
        return;
      }
    }
    handleKeyDown(e);
  });

  dom.startBtn.addEventListener('click', showWeaponSelect);
  dom.restartBtn.addEventListener('click', showWeaponSelect);
  dom.menuBtn.addEventListener('click', showMenu);

  // Theme cycle wiring (Dark -> Light -> Neon -> Retro -> Minimal -> Dark)
  if (dom.themeBtn) dom.themeBtn.addEventListener('click', cycleTheme);
  if (dom.themeToggleHud) dom.themeToggleHud.addEventListener('click', cycleTheme);

  // Scores screen
  if (dom.scoresBtn) dom.scoresBtn.addEventListener('click', () => {
    state.scoresViewMode = state.scoresViewMode || 'all';
    renderScoresScreen();
    document.querySelectorAll('.scores-tab').forEach((t) => t.classList.toggle('active', t.id === 'scores-tab-' + state.scoresViewMode));
    dom.menuScreen.classList.add('hidden');
    dom.scoresScreen.classList.remove('hidden');
  });
  if (dom.scoresCloseBtn) dom.scoresCloseBtn.addEventListener('click', () => {
    dom.scoresScreen.classList.add('hidden');
    dom.menuScreen.classList.remove('hidden');
  });
  document.getElementById('scores-tab-all')?.addEventListener('click', () => {
    state.scoresViewMode = 'all';
    renderScoresScreen();
    document.querySelectorAll('.scores-tab').forEach((t) => t.classList.toggle('active', t.id === 'scores-tab-all'));
  });
  document.getElementById('scores-tab-daily')?.addEventListener('click', () => {
    state.scoresViewMode = 'daily';
    renderScoresScreen();
    document.querySelectorAll('.scores-tab').forEach((t) => t.classList.toggle('active', t.id === 'scores-tab-daily'));
  });

  // Stats screen
  if (dom.statsBtn) dom.statsBtn.addEventListener('click', () => {
    renderStatsScreen();
    dom.menuScreen.classList.add('hidden');
    dom.statsScreen.classList.remove('hidden');
  });
  if (dom.statsCloseBtn) dom.statsCloseBtn.addEventListener('click', () => {
    dom.statsScreen.classList.add('hidden');
    dom.menuScreen.classList.remove('hidden');
  });

  if (dom.achievementsBtn) dom.achievementsBtn.addEventListener('click', () => {
    renderAchievementsScreen();
    dom.menuScreen.classList.add('hidden');
    dom.achievementsScreen.classList.remove('hidden');
  });
  if (dom.achievementsCloseBtn) dom.achievementsCloseBtn.addEventListener('click', () => {
    dom.achievementsScreen.classList.add('hidden');
    dom.menuScreen.classList.remove('hidden');
  });

  // Pause
  function updatePauseStats() {
    const el = document.getElementById('pause-stats');
    if (!el) return;
    const elapsed = (performance.now() - state.startTime) / 1000;
    const m = Math.floor(elapsed / 60);
    const s = Math.floor(elapsed % 60);
    const wpm = elapsed > 0 ? Math.round((state.totalCharsTyped / 5) / (elapsed / 60)) : 0;
    el.innerHTML = `
      <div class="pause-stat-row">Wave ${state.wave} · Score ${state.score.toLocaleString()}</div>
      <div class="pause-stat-row">Time ${m}:${String(s).padStart(2, '0')} · WPM ${wpm}</div>
    `;
    const loadoutEl = document.getElementById('pause-loadout');
    if (loadoutEl) {
      const wDef = WEAPONS[state.weapon];
      let html = `<div class="pause-loadout-weapons">`;
      if (wDef) {
        html += `<span class="pause-weapon" style="color:${wDef.color}" title="${wDef.name}">${wDef.icon} ${wDef.name}</span>`;
      }
      if (state.subWeapon && WEAPONS[state.subWeapon]) {
        const sw = WEAPONS[state.subWeapon];
        html += `<span class="pause-weapon pause-weapon--sub" style="color:${sw.color}99" title="Sub: ${sw.name}">${sw.icon} ${sw.name}</span>`;
      }
      html += `</div>`;
      const counts = {};
      state.upgrades.forEach((id) => { counts[id] = (counts[id] || 0) + 1; });
      html += `<div class="pause-loadout-upgrades">`;
      Object.keys(counts).forEach((id) => {
        const upg = getUpgradeById(id);
        if (!upg) return;
        const badge = counts[id] > 1 ? `<span class="upg-badge">x${counts[id]}</span>` : '';
        html += `<div class="upg-icon" title="${upg.name}">${upg.icon}${badge}</div>`;
      });
      html += `</div>`;
      loadoutEl.innerHTML = html;
    }
  }

  function togglePause() {
    if (state.screen !== 'playing' && state.screen !== 'paused') return;
    if (state.screen === 'playing') {
      state.screen = 'paused';
      dom.pauseScreen.classList.remove('hidden');
      updatePauseStats();
      updateDensityButtons();
      updateSoundButtons();
    } else {
      state.screen = 'playing';
      dom.pauseScreen.classList.add('hidden');
      lastTime = performance.now();
    }
  }
  if (dom.pauseBtn) dom.pauseBtn.addEventListener('click', togglePause);
  if (dom.pauseResumeBtn) dom.pauseResumeBtn.addEventListener('click', () => {
    state.screen = 'playing';
    dom.pauseScreen.classList.add('hidden');
    lastTime = performance.now();
  });
  if (dom.pauseRestartBtn) dom.pauseRestartBtn.addEventListener('click', () => {
    if (confirm('Restart run? Progress will be lost.')) {
      dom.pauseScreen.classList.add('hidden');
      showWeaponSelect();
    }
  });
  if (dom.pauseQuitBtn) dom.pauseQuitBtn.addEventListener('click', () => {
    dom.pauseScreen.classList.add('hidden');
    showMenu();
  });

  // --- Drawing ---

  function drawPolygon(cx, cy, radius, sides, angle, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(cx, cy); ctx.rotate(angle);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
      else ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    }
    ctx.closePath(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowColor = color; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawPlayer() {
    const { x, y } = player, t = performance.now() / 1000;
    const wDef = WEAPONS[state.weapon];
    const wColor = wDef.color;
    ctx.save(); ctx.translate(x, y);
    const cg = Math.min(state.combo / 10, 3), rc = state.combo >= 20 ? 3 : 2;
    const sides = state.weapon === 'shrapnel' ? 6 : state.weapon === 'pulse' ? 12 : state.weapon === 'venom' ? 5 : state.weapon === 'ricochet' ? 8 : 8;
    for (let ring = 0; ring < rc; ring++) {
      const r = 18 + ring * 10, a = t * (ring % 2 === 0 ? 1 : -1) * (1 + cg * 0.3);
      ctx.beginPath();
      for (let i = 0; i < sides; i++) { const ang = a + (i / sides) * Math.PI * 2; if (i === 0) ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r); else ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r); }
      ctx.closePath();
      if (ring === 0) { ctx.strokeStyle = wColor; ctx.lineWidth = 2; ctx.shadowColor = wColor; ctx.shadowBlur = 20 + cg * 5; }
      else if (ring === 1) { ctx.strokeStyle = `rgba(139,92,246,${0.4 + cg * 0.1})`; ctx.lineWidth = 1; ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 10 + cg * 3; }
      else { ctx.strokeStyle = `rgba(251,191,36,${0.5 + Math.sin(t * 4) * 0.2})`; ctx.lineWidth = 1.5; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 15; }
      ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = wColor; ctx.shadowColor = wColor; ctx.shadowBlur = 20; ctx.fill();

    // Double damage glow
    if (state.doubleTimer > 0) {
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251,191,36,${0.3 + Math.sin(t * 5) * 0.15})`; ctx.lineWidth = 2;
      ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20; ctx.stroke();
    }

    // Shield visual
    if (state.shieldHits > 0) {
      ctx.beginPath(); ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(34,211,238,${0.25 + Math.sin(t * 3) * 0.1})`; ctx.lineWidth = 2;
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 15; ctx.stroke();
      ctx.font = 'bold 10px "Orbitron", sans-serif'; ctx.fillStyle = '#22d3ee'; ctx.textAlign = 'center';
      ctx.shadowBlur = 8; ctx.fillText(`x${state.shieldHits}`, 0, 50);
    }
    ctx.restore();

    if (state.enemySlowFactor < 1) drawCryoField();
    if (Math.min(2, state.autoTyperCount || 0) > 0) drawDrones(t);
  }

  function drawCryoField() {
    const { x, y } = player, t = performance.now() / 1000, radius = 120;
    const alpha = 0.06 + Math.sin(t * 2) * 0.02;
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, `rgba(100,200,255,${alpha})`); grad.addColorStop(0.7, `rgba(100,200,255,${alpha * 0.5})`); grad.addColorStop(1, 'rgba(100,200,255,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(100,200,255,${0.15 + Math.sin(t * 3) * 0.05})`; ctx.lineWidth = 1; ctx.setLineDash([6, 8]);
    ctx.beginPath(); ctx.arc(x, y, radius, t, t + Math.PI * 1.5); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    if (Math.random() < 0.3 * getParticleDensity()) { const a = Math.random() * Math.PI * 2, r = 20 + Math.random() * 100; particles.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, vx: (Math.random() - 0.5) * 0.3, vy: 0.3 + Math.random() * 0.5, life: 1, decay: 0.03, size: 1 + Math.random() * 1.5, color: '#a0d8ef' }); }
  }

  function drawDrones(t) {
    const { x, y } = player;
    const droneCount = Math.min(2, state.autoTyperCount || 0);
    for (let i = 0; i < droneCount; i++) {
      const off = (i / droneCount) * Math.PI * 2, da = t * 2 + off, dr = 38 + i * 6;
      ctx.save(); ctx.translate(x + Math.cos(da) * dr, y + Math.sin(da) * dr); ctx.rotate(da + Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(4, 4); ctx.lineTo(-4, 4); ctx.closePath();
      ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 1.5; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 10; ctx.stroke();
      ctx.fillStyle = 'rgba(244,114,182,0.3)'; ctx.fill(); ctx.restore();
    }
  }

  function drawGrid() {
    const th = getTheme(), spacing = 60;
    const aliveCount = enemies.filter((e) => e.hp > 0).length;
    const boost = Math.min(aliveCount * 0.004, 0.06);
    const p = Math.sin(gridPulse) * 0.02 + 0.04 + boost;
    const halfW = (W / CAMERA_ZOOM) / 2, halfH = (H / CAMERA_ZOOM) / 2;
    const left = player.x - halfW - spacing, right = player.x + halfW + spacing;
    const top = player.y - halfH - spacing, bottom = player.y + halfH + spacing;
    const startX = Math.floor(left / spacing) * spacing;
    const startY = Math.floor(top / spacing) * spacing;
    ctx.save(); ctx.strokeStyle = `rgba(${th.gridR},${th.gridG},${th.gridB},${p})`; ctx.lineWidth = 0.5;
    for (let x = startX; x <= right; x += spacing) { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke(); }
    for (let y = startY; y <= bottom; y += spacing) { ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke(); }
    ctx.restore();
  }

  function drawEnemy(e) {
    const t = performance.now() / 1000, th = getTheme();
    const pulse = 1 + Math.sin(e.pulsePhase + t * 3) * 0.08, size = e.size * pulse, alpha = e.spawnAlpha;
    const effectiveAlpha = alpha * (e.stealthAlpha ?? 1);
    const frozen = state.freezeTimer > 0;
    const drawColor = frozen ? desaturate(e.color, 0.4) : e.color;

    // Speeder motion trail
    if (e.type === 'speeder' && effectiveAlpha > 0.5) {
      for (let i = 1; i <= 3; i++) {
        const dx = player.x - e.x, dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const tx = e.x - (dx / dist) * i * 12;
        const ty = e.y - (dy / dist) * i * 12;
        drawPolygon(tx, ty, size * (1 - i * 0.15), e.sides, e.angle - i * 0.3, drawColor, effectiveAlpha * (0.3 - i * 0.08));
      }
    }

    drawPolygon(e.x, e.y, size, e.sides, e.angle, drawColor, effectiveAlpha);

    // Miss flash — red glow when player types wrong letter
    if (e.missFlashTimer > 0 && effectiveAlpha > 0.5) {
      ctx.save();
      ctx.globalAlpha = e.missFlashTimer * 0.8;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15 + (1 - e.missFlashTimer) * 10;
      ctx.beginPath();
      ctx.arc(e.x, e.y, size + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Boss extra rings
    if (e.type === 'boss' && effectiveAlpha > 0.5) {
      ctx.save(); ctx.globalAlpha = effectiveAlpha * 0.4;
      ctx.strokeStyle = '#ff2d55'; ctx.lineWidth = 1.5; ctx.shadowColor = '#ff2d55'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.arc(e.x, e.y, size + 10 + Math.sin(t * 2) * 3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(e.x, e.y, size + 18 + Math.sin(t * 3) * 2, t, t + Math.PI * 1.5); ctx.stroke();
      ctx.restore();
    }

    // Shielder hex barrier
    if ((e.type === 'shielder' || e.type === 'bossShielded') && e.shieldActive && effectiveAlpha > 0.5) {
      ctx.save(); ctx.globalAlpha = effectiveAlpha * (0.5 + Math.sin(t * 4) * 0.15);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 12;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.5;
        const r = size + 8;
        if (i === 0) ctx.moveTo(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r);
        else ctx.lineTo(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r);
      }
      ctx.closePath(); ctx.stroke(); ctx.restore();
    }

    if (frozen && effectiveAlpha > 0.5) {
      ctx.save(); ctx.globalAlpha = effectiveAlpha * 0.3;
      ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 1; ctx.shadowColor = '#67e8f9'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(e.x, e.y, size + 6, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }

    // HP bar -- boss/miniboss get wider bar, others get standard
    if (e.maxHp > 1 && effectiveAlpha > 0.5) {
      const isBossOrMiniboss = isBossType(e.type) || e.type === 'miniboss';
      const bw = isBossOrMiniboss ? 50 : 30, bh = isBossOrMiniboss ? 4 : 3;
      const ratio = Math.max(0, e.hp / e.maxHp);
      ctx.save(); ctx.globalAlpha = effectiveAlpha;
      ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(e.x - bw / 2, e.y + e.size + 18, bw, bh);
      ctx.fillStyle = drawColor; ctx.fillRect(e.x - bw / 2, e.y + e.size + 18, bw * ratio, bh);
      if (isBossType(e.type)) {
        const segs = 5;
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1;
        for (let i = 1; i < segs; i++) {
          const sx = e.x - bw / 2 + (bw / segs) * i;
          ctx.beginPath(); ctx.moveTo(sx, e.y + e.size + 18); ctx.lineTo(sx, e.y + e.size + 18 + bh); ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (effectiveAlpha < 0.3) return;

    // Word display (shielder shows shield word if active)
    ctx.save(); ctx.globalAlpha = effectiveAlpha;
    ctx.font = '14px "Share Tech Mono", monospace'; ctx.textAlign = 'center';

    const clusterRadius = 70;
    const nearby = enemies.filter((o) => o.hp > 0 && o !== e && Math.hypot(o.x - e.x, o.y - e.y) < clusterRadius);
    nearby.push(e);
    nearby.sort((a, b) => a.y - b.y || a.x - b.x);
    const stackIndex = nearby.indexOf(e);
    const wordOffsetY = stackIndex * 14;

    if ((e.type === 'shielder' || e.type === 'bossShielded') && e.shieldActive) {
      const sw = e.shieldWord;
      const shieldY = e.y - e.size - 26 - wordOffsetY;
      for (let i = 0; i < sw.length; i++) {
        const cx = e.x - ((sw.length - 1) * 9) / 2 + i * 9;
        if (i < e.shieldTypedIndex) { ctx.fillStyle = '#67e8f9'; ctx.shadowColor = '#67e8f9'; ctx.shadowBlur = 8; }
        else if (e.targeted) { ctx.fillStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 4; }
        else { ctx.fillStyle = '#38bdf8aa'; ctx.shadowBlur = 0; }
        ctx.fillText(sw[i], cx, shieldY);
      }
      ctx.font = '11px "Share Tech Mono", monospace';
      ctx.fillStyle = th.textDim + '88'; ctx.shadowBlur = 0;
      const wordY = e.y - e.size - 10 - wordOffsetY;
      for (let i = 0; i < e.word.length; i++) {
        const cx = e.x - ((e.word.length - 1) * 8) / 2 + i * 8;
        ctx.fillText(e.word[i], cx, wordY);
      }
    } else {
      const wordY = e.y - e.size - 12 - wordOffsetY;
      for (let i = 0; i < e.word.length; i++) {
        const cx = e.x - ((e.word.length - 1) * 9) / 2 + i * 9;
        if (i < e.typedIndex) { ctx.fillStyle = th.wordTyped; ctx.shadowColor = th.wordTyped; ctx.shadowBlur = 8; }
        else if (e.targeted) { ctx.fillStyle = th.wordTarget; ctx.shadowColor = th.wordTarget; ctx.shadowBlur = 4; }
        else { ctx.fillStyle = th.textDim; ctx.shadowBlur = 0; }
        ctx.fillText(e.word[i], cx, wordY);
      }
    }

    if (e.targeted) {
      ctx.globalAlpha = 1; ctx.strokeStyle = `rgba(${getTheme().gridR},${getTheme().gridG},${getTheme().gridB},0.3)`;
      ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(e.x, e.y); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function desaturate(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    const gray = (r + g + b) / 3;
    const nr = Math.round(r + (gray - r) * amount), ng = Math.round(g + (gray - g) * amount), nb = Math.round(b + (gray - b) * amount);
    return `rgb(${nr},${ng},${nb})`;
  }

  function drawPowerDrop(d) {
    const t = performance.now() / 1000, th = getTheme();
    const blinking = d.lifeTimer < 2;
    const visible = !blinking || Math.sin(t * 10) > 0;
    if (!visible) return;

    const size = 14 + Math.sin(t * 3) * 2;
    ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(Math.PI / 4 + Math.sin(t * 2) * 0.1);
    ctx.beginPath(); ctx.rect(-size / 2, -size / 2, size, size); ctx.closePath();
    ctx.strokeStyle = d.color; ctx.lineWidth = 2; ctx.shadowColor = d.color; ctx.shadowBlur = 20; ctx.stroke();
    ctx.fillStyle = d.color + '18'; ctx.fill();
    ctx.restore();

    // Icon
    ctx.save(); ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = d.color;
    ctx.shadowColor = d.color; ctx.shadowBlur = 10;
    ctx.fillText(d.icon, d.x, d.y + 5); ctx.restore();

    // Word above
    ctx.save(); ctx.font = '13px "Share Tech Mono", monospace'; ctx.textAlign = 'center';
    const wordY = d.y - 22;
    for (let i = 0; i < d.word.length; i++) {
      const cx = d.x - ((d.word.length - 1) * 8) / 2 + i * 8;
      if (i < d.typedIndex) { ctx.fillStyle = th.wordTyped; ctx.shadowColor = th.wordTyped; ctx.shadowBlur = 8; }
      else if (d.targeted) { ctx.fillStyle = th.wordTarget; ctx.shadowColor = th.wordTarget; ctx.shadowBlur = 4; }
      else { ctx.fillStyle = d.color; ctx.shadowBlur = 0; }
      ctx.fillText(d.word[i], cx, wordY);
    }
    ctx.restore();

    // Timer bar
    const barW = 30, barH = 3, ratio = d.lifeTimer / d.maxLife;
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(d.x - barW / 2, d.y + 22, barW, barH);
    ctx.fillStyle = d.color; ctx.fillRect(d.x - barW / 2, d.y + 22, barW * ratio, barH);
    ctx.restore();

    // Targeting line
    if (d.targeted) {
      ctx.save(); ctx.strokeStyle = d.color + '55'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(d.x, d.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
  }

  function drawAugmentationDrop(d) {
    const t = performance.now() / 1000, th = getTheme();
    const blinking = d.lifeTimer < 2;
    const visible = !blinking || Math.sin(t * 10) > 0;
    if (!visible) return;

    const size = 14 + Math.sin(t * 3) * 2;
    ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(t * 0.5);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const r = size;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.strokeStyle = d.color; ctx.lineWidth = 2; ctx.shadowColor = d.color; ctx.shadowBlur = 20; ctx.stroke();
    ctx.fillStyle = d.color + '22'; ctx.fill();
    ctx.restore();

    ctx.save(); ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = d.color;
    ctx.shadowColor = d.color; ctx.shadowBlur = 10;
    ctx.fillText(d.icon || '\u2699', d.x, d.y + 5); ctx.restore();

    ctx.save(); ctx.font = '13px "Share Tech Mono", monospace'; ctx.textAlign = 'center';
    const wordY = d.y - 22;
    for (let i = 0; i < d.word.length; i++) {
      const cx = d.x - ((d.word.length - 1) * 8) / 2 + i * 8;
      if (i < d.typedIndex) { ctx.fillStyle = th.wordTyped; ctx.shadowColor = th.wordTyped; ctx.shadowBlur = 8; }
      else if (d.targeted) { ctx.fillStyle = th.wordTarget; ctx.shadowColor = th.wordTarget; ctx.shadowBlur = 4; }
      else { ctx.fillStyle = d.color; ctx.shadowBlur = 0; }
      ctx.fillText(d.word[i], cx, wordY);
    }
    ctx.restore();

    const barW = 30, barH = 3, ratio = d.lifeTimer / d.maxLife;
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(d.x - barW / 2, d.y + 22, barW, barH);
    ctx.fillStyle = d.color; ctx.fillRect(d.x - barW / 2, d.y + 22, barW * ratio, barH);
    ctx.restore();

    if (d.targeted) {
      ctx.save(); ctx.strokeStyle = d.color + '55'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(d.x, d.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
  }

  function drawProjectile(p) {
    ctx.save();
    const t = performance.now() / 1000;
    if (p.type === 'shrapnel') {
      const a = Math.atan2(p.vy, p.vx);
      ctx.translate(p.x, p.y); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-3, -3); ctx.lineTo(-1, 0); ctx.lineTo(-3, 3); ctx.closePath();
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 12; ctx.fill();
    } else if (p.type === 'venom') {
      const wobble = Math.sin(t * 12) * 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, 5 + wobble * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = p.color + 'aa'; ctx.shadowColor = p.color; ctx.shadowBlur = 18; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x + wobble, p.y - 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#2dd464'; ctx.fill();
    } else if (p.type === 'ricochet') {
      ctx.translate(p.x, p.y); ctx.rotate(t * 15);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2, r = i % 2 === 0 ? 7 : 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = p.color + 'cc'; ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
      ctx.shadowColor = p.color; ctx.shadowBlur = 15; ctx.fill(); ctx.stroke();
    } else if (p.type === 'meteor') {
      const size = 12 + Math.sin(t * 8) * 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 25; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '44'; ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 15; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '22'; ctx.fill();
    }
    ctx.restore();
  }
  function drawParticle(p) { ctx.save(); ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill(); ctx.restore(); }
  function drawFloatingText(ft) { ctx.save(); ctx.globalAlpha = ft.life; ctx.font = 'bold 14px "Orbitron", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = ft.color; ctx.shadowColor = ft.color; ctx.shadowBlur = 10; ctx.fillText(ft.text, ft.x, ft.y); ctx.restore(); }
  function drawShockwaveRing(r) { ctx.save(); ctx.globalAlpha = r.life * 0.5; ctx.strokeStyle = r.color; ctx.lineWidth = 2 * r.life; ctx.shadowColor = r.color; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  function drawLightningArc(a) { ctx.save(); ctx.globalAlpha = a.life; ctx.strokeStyle = a.color; ctx.lineWidth = 2 * a.life; ctx.shadowColor = a.color; ctx.shadowBlur = 12; ctx.beginPath(); a.segments.forEach((s, i) => { if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y); }); ctx.stroke(); ctx.restore(); }
  function drawOrb(o) { ctx.save(); ctx.globalAlpha = o.life; ctx.beginPath(); ctx.arc(o.x, o.y, 3 + Math.sin(o.phase), 0, Math.PI * 2); ctx.fillStyle = o.color; ctx.shadowColor = o.color; ctx.shadowBlur = 12; ctx.fill(); ctx.globalAlpha = o.life * 0.3; ctx.beginPath(); ctx.arc(o.x, o.y, 6 + Math.sin(o.phase) * 2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  function drawOrbitingOrb(o) {
    const t = performance.now() / 1000;
    ctx.save();
    ctx.beginPath(); ctx.arc(o.x, o.y, 10 + Math.sin(o.phase) * 2, 0, Math.PI * 2);
    ctx.fillStyle = o.color || '#a78bfa'; ctx.shadowColor = o.color || '#a78bfa'; ctx.shadowBlur = 18; ctx.fill();
    ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(o.x, o.y, 14 + Math.sin(o.phase), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawSpectreDrone(d) {
    ctx.save();
    ctx.beginPath(); ctx.arc(d.x, d.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = d.color || '#8b5cf6'; ctx.shadowColor = d.color || '#8b5cf6'; ctx.shadowBlur = 12; ctx.fill();
    ctx.restore();
  }
  function drawMine(m) {
    const t = performance.now() / 1000;
    ctx.save();
    ctx.beginPath(); ctx.arc(m.x, m.y, m.radius || 12, 0, Math.PI * 2);
    ctx.fillStyle = (m.color || '#64748b') + '88'; ctx.strokeStyle = m.color || '#64748b'; ctx.lineWidth = 2;
    ctx.shadowColor = m.color || '#64748b'; ctx.shadowBlur = 10; ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function drawMeteorMarker(mm) {
    const t = performance.now() / 1000, th = getTheme();
    const pulse = 1 + Math.sin(t * 4) * 0.1;
    ctx.save();
    ctx.beginPath(); ctx.arc(mm.x, mm.y, 12 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 15; ctx.stroke();
    ctx.fillStyle = '#f59e0b22'; ctx.fill();
    ctx.restore();
    ctx.save(); ctx.font = '12px "Share Tech Mono", monospace'; ctx.textAlign = 'center';
    const wordY = mm.y - 20;
    for (let i = 0; i < mm.word.length; i++) {
      const cx = mm.x - ((mm.word.length - 1) * 7) / 2 + i * 7;
      if (i < (mm.typedIndex || 0)) { ctx.fillStyle = th.wordTyped; ctx.shadowColor = th.wordTyped; ctx.shadowBlur = 6; }
      else if (mm.targeted) { ctx.fillStyle = th.wordTarget; ctx.shadowColor = th.wordTarget; ctx.shadowBlur = 4; }
      else { ctx.fillStyle = '#f59e0b'; ctx.shadowBlur = 0; }
      ctx.fillText(mm.word[i], cx, wordY);
    }
    ctx.restore();
  }
  function drawBeamProjectile(bp) {
    const t = Math.min(1, bp.progress);
    const x2 = bp.x1 + (bp.x2 - bp.x1) * t, y2 = bp.y1 + (bp.y2 - bp.y1) * t;
    drawBeam({ x1: bp.x1, y1: bp.y1, x2, y2, life: 1 - t * 0.5, color: bp.color });
  }
  function drawBeam(b) {
    ctx.save();
    ctx.globalAlpha = (b.life || 1) * 2;
    const dx = b.x2 - b.x1, dy = b.y2 - b.y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const segs = Math.max(4, Math.floor(dist / 30));
    const px = -(dy), py = dx, len = dist || 1;
    const life = b.life ?? 1;

    ctx.strokeStyle = b.color; ctx.lineWidth = 3 * life; ctx.shadowColor = b.color; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.moveTo(b.x1, b.y1);
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      const mx = b.x1 + dx * t, my = b.y1 + dy * t;
      const jit = (Math.random() - 0.5) * 20 * life;
      ctx.lineTo(mx + (px / len) * jit, my + (py / len) * jit);
    }
    ctx.lineTo(b.x2, b.y2); ctx.stroke();

    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1 * life; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(b.x1, b.y1);
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      const mx = b.x1 + dx * t, my = b.y1 + dy * t;
      const jit = (Math.random() - 0.5) * 10 * life;
      ctx.lineTo(mx + (px / len) * jit, my + (py / len) * jit);
    }
    ctx.lineTo(b.x2, b.y2); ctx.stroke();
    ctx.restore();
  }

  function drawPoisonPool(pool) {
    const t = performance.now() / 1000;
    const pulse = 1 + Math.sin(t * 4) * 0.08;
    const r = pool.radius * pulse;
    const alpha = Math.min(pool.life / pool.maxLife, 1) * 0.5;

    ctx.save();
    const grad = ctx.createRadialGradient(pool.x, pool.y, 0, pool.x, pool.y, r);
    grad.addColorStop(0, `rgba(74,222,128,${alpha * 0.6})`);
    grad.addColorStop(0.5, `rgba(74,222,128,${alpha * 0.3})`);
    grad.addColorStop(1, 'rgba(74,222,128,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(pool.x, pool.y, r, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = `rgba(74,222,128,${alpha * 0.5})`;
    ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.arc(pool.x, pool.y, r * 0.7, t * 2, t * 2 + Math.PI * 1.6); ctx.stroke();
    ctx.setLineDash([]);

    if (Math.random() < 0.15 * getParticleDensity()) {
      const a = Math.random() * Math.PI * 2, dr = Math.random() * r * 0.7;
      particles.push({ x: pool.x + Math.cos(a) * dr, y: pool.y + Math.sin(a) * dr, vx: 0, vy: -0.5 - Math.random() * 0.5, life: 0.6, decay: 0.03, size: 1.5, color: '#4ade80' });
    }
    ctx.restore();
  }

  function drawPlayerTrail() { if (state.combo < 10) return; const alpha = Math.min((state.combo - 10) / 40, 0.3); playerTrail.forEach((pos, i) => { const a = alpha * (i / playerTrail.length) * 0.5; drawPolygon(pos.x, pos.y, 18, 8, pos.angle, `rgba(0,240,255,${a})`, a); }); }

  function drawDangerVignette() {
    if (state.hp >= state.maxHp * 0.3) return;
    const t = performance.now() / 1000, intensity = 1 - state.hp / (state.maxHp * 0.3);
    const pa = intensity * (0.15 + Math.sin(t * 4) * 0.08);
    ctx.save(); const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(255,0,0,0)'); g.addColorStop(1, `rgba(255,0,0,${pa})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function drawCritFlash() {
    if (state.critFlashTimer <= 0) return;
    ctx.save(); const a = state.critFlashTimer * 0.6;
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(251,191,36,0)'); g.addColorStop(1, `rgba(251,191,36,${a})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function drawNukeFlash() {
    if (state.nukeFlash <= 0) return;
    ctx.save(); ctx.globalAlpha = state.nukeFlash;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawFreezeOverlay() {
    if (state.freezeTimer <= 0) return;
    const t = performance.now() / 1000;
    ctx.save(); const a = 0.06 + Math.sin(t * 2) * 0.02;
    ctx.fillStyle = `rgba(100,200,255,${a})`; ctx.fillRect(0, 0, W, H);
    ctx.restore();
    if (Math.random() < 0.2 * getParticleDensity()) {
      const halfVW = (W / CAMERA_ZOOM) / 2, halfVH = (H / CAMERA_ZOOM) / 2;
      particles.push({ x: player.x + (Math.random() - 0.5) * halfVW * 2, y: player.y + (Math.random() - 0.5) * halfVH * 2, vx: (Math.random() - 0.5) * 0.5, vy: 0.3 + Math.random() * 0.5, life: 0.7, decay: 0.03, size: 1.5, color: '#a0d8ef' });
    }
  }

  function drawSlowOverlay() {
    if (state.slowDropTimer <= 0) return;
    const t = performance.now() / 1000;
    ctx.save(); const a = 0.04 + Math.sin(t * 3) * 0.02;
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(167,139,250,0)'); g.addColorStop(1, `rgba(167,139,250,${a})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function worldToScreen(wx, wy) {
    return {
      x: W / 2 + (wx - player.x) * CAMERA_ZOOM,
      y: H / 2 + (wy - player.y) * CAMERA_ZOOM,
    };
  }

  function drawEdgeIndicators() {
    const margin = 20;
    ctx.save();
    enemies.forEach((e) => {
      if (e.hp <= 0 || e.spawnAlpha < 0.5) return;
      const sp = worldToScreen(e.x, e.y);
      if (sp.x > 0 && sp.x < W && sp.y > 0 && sp.y < H) return;
      const dx = e.x - player.x, dy = e.y - player.y, a = Math.atan2(dy, dx);
      let ix = Math.max(margin, Math.min(W - margin, W / 2 + Math.cos(a) * (W / 2 - margin)));
      let iy = Math.max(margin, Math.min(H - margin, H / 2 + Math.sin(a) * (H / 2 - margin)));
      ctx.save(); ctx.translate(ix, iy); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-4, -5); ctx.lineTo(-4, 5); ctx.closePath();
      ctx.fillStyle = e.color; ctx.globalAlpha = 0.6; ctx.shadowColor = e.color; ctx.shadowBlur = 8; ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }

  function drawRegenEffect() {
    if (state.regenRate <= 0 || Math.random() > 0.15 * getParticleDensity()) return;
    particles.push({ x: player.x + (Math.random() - 0.5) * 16, y: player.y, vx: (Math.random() - 0.5) * 0.3, vy: -0.8 - Math.random() * 0.5, life: 1, decay: 0.025, size: 1.5, color: '#4ade80' });
  }

  // --- HUD ---

  function updateHUD() {
    dom.hudWave.textContent = state.wave;
    if (dom.hudLevel) dom.hudLevel.textContent = state.level || 1;
    const expToNext = state.expToNextLevel || 5;
    const expPct = expToNext > 0 ? ((state.exp || 0) / expToNext) * 100 : 0;
    if (dom.expProgressBar) dom.expProgressBar.style.width = `${expPct}%`;
    dom.hudScore.textContent = state.score.toLocaleString();
    dom.hudCombo.textContent = state.combo > 1 ? `x${state.combo}` : 'x1';
    dom.hudCombo.style.color = state.combo >= 20 ? '#fbbf24' : '#f472b6';

    const elapsed = (performance.now() - state.startTime) / 1000;
    dom.hudWpm.textContent = elapsed > 5 ? Math.round((state.totalCharsTyped / 5) / (elapsed / 60)) : 0;

    const totalKeys = (state.keysCorrect || 0) + (state.keysMissed || 0);
    const accPct = totalKeys > 0 ? ((state.keysCorrect / totalKeys) * 100).toFixed(1) : '100';
    if (dom.hudAccuracy) dom.hudAccuracy.textContent = accPct + '%';

    if (state.waveEnemiesTotal > 0) {
      const alive = enemies.filter((e) => e.hp > 0).length;
      dom.waveProgressBar.style.width = `${(1 - (state.waveEnemiesLeft + alive) / state.waveEnemiesTotal) * 100}%`;
    }

    const hpPct = Math.max(0, (state.hp / state.maxHp) * 100);
    dom.healthBar.style.width = `${hpPct}%`;
    dom.healthText.textContent = `${Math.ceil(state.hp)} / ${state.maxHp}`;
    dom.healthBar.style.background = hpPct < 25 ? 'linear-gradient(90deg,#ef4444,#f87171)' : hpPct < 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#22c55e,#4ade80)';

    // Typing display
    const target = state.targetMeteorMarker || state.targetAugDrop || state.targetDrop || state.targetEnemy;
    if (target) {
      const isShieldPhase = target.shieldWord && (target.type === 'shielder' || target.type === 'bossShielded') && target.shieldActive;
      const word = isShieldPhase ? target.shieldWord : target.word;
      let html = '';
      if (isShieldPhase) html += '<span style="color:#38bdf8;font-size:0.7em">SHIELD: </span>';
      for (let i = 0; i < word.length; i++) {
        html += i < state.currentInput.length ? `<span style="color:#4ade80">${word[i]}</span>` : `<span>${word[i]}</span>`;
      }
      dom.typingDisplay.innerHTML = html;
    } else {
      dom.typingDisplay.innerHTML = '<span style="color:var(--muted); animation: pulse 2s infinite">TYPE TO ATTACK</span>';
    }

    const wDef = WEAPONS[state.weapon];
    if (dom.hudWeapon) {
      dom.hudWeapon.textContent = `${wDef.icon} ${wDef.name}`;
      dom.hudWeapon.style.color = wDef.color;
    }
    if (dom.hudMastery && state.weaponKills) {
      const k = state.weaponKills[state.weapon] || 0;
      const next = k < 25 ? 25 : k < 50 ? 50 : null;
      dom.hudMastery.textContent = next ? `${k}/${next}` : k >= 50 ? `${k} \u2713` : '';
      dom.hudMastery.style.display = next || k >= 50 ? 'inline' : 'none';
    }

    // Active effects pills
    let pills = '';
    if (state.freezeTimer > 0) pills += `<span class="effect-pill" style="border:1px solid #67e8f9;color:#67e8f9">FREEZE ${state.freezeTimer.toFixed(1)}s</span>`;
    if (state.bombTimer > 0) pills += `<span class="effect-pill" style="border:1px solid #f97316;color:#f97316">BOMB ${state.bombTimer.toFixed(1)}s</span>`;
    if (state.slowDropTimer > 0) pills += `<span class="effect-pill" style="border:1px solid #a78bfa;color:#a78bfa">SLOW ${state.slowDropTimer.toFixed(1)}s</span>`;
    if (state.doubleTimer > 0) pills += `<span class="effect-pill" style="border:1px solid #fbbf24;color:#fbbf24">2x DMG ${state.doubleTimer.toFixed(1)}s</span>`;
    if (state.shieldHits > 0) pills += `<span class="effect-pill" style="border:1px solid #22d3ee;color:#22d3ee">SHIELD x${state.shieldHits}</span>`;
    if (state.comboSpeedTimer > 0) pills += `<span class="effect-pill" style="border:1px solid #4ade80;color:#4ade80">SWIFT ${state.comboSpeedTimer.toFixed(1)}s</span>`;
    if (state.comboCritTimer > 0) pills += `<span class="effect-pill" style="border:1px solid #a78bfa;color:#a78bfa">CRIT+ ${state.comboCritTimer.toFixed(1)}s</span>`;
    dom.hudEffects.innerHTML = pills;

    const boss = enemies.find((e) => e.hp > 0 && isBossType(e.type));
    const bossContainer = document.getElementById('boss-health-container');
    const bossFill = document.getElementById('boss-health-fill');
    const bossText = document.getElementById('boss-health-text');
    if (boss && bossContainer && bossFill && bossText) {
      bossContainer.classList.remove('hidden');
      const pct = Math.max(0, (boss.hp / boss.maxHp) * 100);
      bossFill.style.width = `${pct}%`;
      bossText.textContent = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
    } else if (bossContainer) {
      bossContainer.classList.add('hidden');
    }
  }

  // --- Game loop ---

  let lastTime = performance.now();

  function gameLoop(now) {
    const rawDt = (now - lastTime) / 1000;
    const dt = Math.max(0.001, Math.min(rawDt, 0.05));
    lastTime = now;

    const th = getTheme();
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, W, H);

    if (state.screen === 'playing' || state.screen === 'paused') {
      const isPaused = state.screen === 'paused';
      const frameDt = isPaused ? 0 : dt;
      gridPulse += frameDt * 0.5;

      ctx.save();
      if (state.shakeAmount > 0.5 && !reducedMotion) {
        ctx.translate((Math.random() - 0.5) * state.shakeAmount, (Math.random() - 0.5) * state.shakeAmount);
        state.shakeAmount *= state.shakeDecay;
      } else if (state.shakeAmount > 0.5) {
        state.shakeAmount *= state.shakeDecay;
      }

      // Camera zoom: scale from player center so the arena feels bigger
      const cx = W / 2, cy = H / 2;
      ctx.translate(cx, cy);
      ctx.scale(CAMERA_ZOOM, CAMERA_ZOOM);
      ctx.translate(-player.x, -player.y);

      drawGrid();

      if (!isPaused) {
      // Timers
      if (state.comboTimer > 0) {
        const decayRate = state.mode === 'relaxed' ? 0.5 : 1;
        state.comboTimer -= dt * decayRate;
        if (state.comboTimer <= 0 && state.mode !== 'relaxed') {
          state.combo = 0;
          state.lastStreakThreshold = 0;
        } else if (state.comboTimer <= 0 && state.mode === 'relaxed') {
          state.comboTimer = 0.1;
        }
      }
      if (state.critFlashTimer > 0) state.critFlashTimer -= dt;
      if (state.nukeFlash > 0) state.nukeFlash -= dt * 1.5;
      if (state.freezeTimer > 0) state.freezeTimer = Math.max(0, state.freezeTimer - dt);
      if (state.bombTimer > 0) state.bombTimer = Math.max(0, state.bombTimer - dt);
      if (state.slowDropTimer > 0) state.slowDropTimer = Math.max(0, state.slowDropTimer - dt);
      if (state.doubleTimer > 0) state.doubleTimer = Math.max(0, state.doubleTimer - dt);
      if (state.comboSpeedTimer > 0) {
        state.comboSpeedTimer = Math.max(0, state.comboSpeedTimer - dt);
        if (state.comboSpeedTimer <= 0) state.comboSpeedBoost = 1;
      }
      if (state.comboCritTimer > 0) {
        state.comboCritTimer = Math.max(0, state.comboCritTimer - dt);
        if (state.comboCritTimer <= 0) state.comboCritBoost = 0;
      }

      if (state.regenRate > 0) {
        state.regenAccum += dt;
        if (state.regenAccum >= 3) { state.regenAccum = 0; state.hp = Math.min(state.maxHp, state.hp + state.regenRate); spawnFloatingText(player.x + 20, player.y - 10, `+${state.regenRate}`, '#4ade80'); }
        drawRegenEffect();
      }

      updateAutoTyper(dt);

      // Spawning
      if (state.waveActive && state.waveEnemiesLeft > 0) {
        state.spawnTimer -= dt;
        const maxAlive = getViewportBalanceMults().maxAlive;
        while (state.spawnTimer <= 0 && state.waveEnemiesLeft > 0) {
          const alive = enemies.filter((e) => e.hp > 0).length;
          if (alive >= maxAlive) {
            state.spawnTimer = 0.22;
            break;
          }
          spawnEnemy();
          state.waveEnemiesLeft--;
          state.spawnTimer += state.spawnInterval;
        }
      }
      if (state.waveActive && state.waveEnemiesLeft <= 0 && enemies.filter((e) => e.hp > 0).length === 0) {
        state.waveActive = false;
        setTimeout(() => { if (state.screen === 'playing') showWaveClearScreen(); }, 800);
      }

      // Spawn alpha
      enemies.forEach((e) => {
        if (e.spawnAlpha < 1) e.spawnAlpha = Math.min(1, e.spawnAlpha + dt * 4);
        if (e.missFlashTimer > 0) e.missFlashTimer -= dt;
        if (e.type === 'stealth') {
          const d = Math.hypot(player.x - e.x, player.y - e.y);
          e.stealthAlpha = d > 180 ? 0.15 : d < 80 ? 1 : 0.15 + 0.85 * (1 - (d - 80) / 100);
        }
      });

      // Move enemies (skip if frozen)
      const isFrozen = state.freezeTimer > 0;
      enemies.forEach((e) => {
        if (e.hp <= 0) return;
        if (!isFrozen) {
          if (e.type === 'regenerator' && e.regenRate) {
            e.regenTimer = (e.regenTimer || 0) + dt;
            if (e.regenTimer >= 1) {
              e.regenTimer = 0;
              e.hp = Math.min(e.maxHp, e.hp + e.regenRate);
              if (e.hp < e.maxHp) spawnParticles(e.x, e.y, '#10b981', 2, 0.5);
            }
          }
          if (e.type === 'teleporter' && e.teleportInterval) {
            e.teleportTimer = (e.teleportTimer || 0) + dt;
            if (e.teleportTimer >= e.teleportInterval) {
              e.teleportTimer = 0;
              const angle = Math.random() * Math.PI * 2;
              const dist = 80 + Math.random() * 120;
              e.x = player.x + Math.cos(angle) * dist;
              e.y = player.y + Math.sin(angle) * dist;
              spawnParticles(e.x, e.y, '#8b5cf6', 8, 3);
            }
          }
          if (e.type === 'berserker' && e.baseSpeed !== undefined) {
            const hpRatio = e.hp / e.maxHp;
            if (hpRatio < 0.5) {
              e.speed = e.baseSpeed * 1.6;
              e.berserkerDamageMult = 2;
            } else {
              e.speed = e.baseSpeed;
              e.berserkerDamageMult = 1;
            }
          }
          const dx = player.x - e.x, dy = player.y - e.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            let speedMult = state.enemySlowFactor * (state.enemySpeedCurse || 1);
            if (state.slowDropTimer > 0) speedMult *= 0.3;
            if (e.cryoUntil && e.cryoUntil > performance.now()) speedMult *= 0.5;
            const spd = e.speed * speedMult * 30;
            e.x += (dx / dist) * spd * dt;
            e.y += (dy / dist) * spd * dt;
          }
          e.angle += e.rotSpeed * dt;

          if (state.enemySlowFactor < 1 && Math.sqrt((player.x - e.x) ** 2 + (player.y - e.y) ** 2) < 120 && Math.random() < 0.1 * getParticleDensity()) {
            particles.push({ x: e.x + (Math.random() - 0.5) * e.size, y: e.y + (Math.random() - 0.5) * e.size, vx: (Math.random() - 0.5) * 0.5, vy: 0.3 + Math.random() * 0.3, life: 0.7, decay: 0.04, size: 1, color: '#a0d8ef' });
          }
        }

        const dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist < player.radius + e.size) {
          if (state.shieldHits > 0) {
            state.shieldHits--;
            spawnParticles(player.x, player.y, '#22d3ee', 10, 3);
            spawnFloatingText(player.x, player.y - 40, 'SHIELD!', '#22d3ee');
            audio.play(800, 0.15, 'sine', 0.06);
          } else {
            const dmg = Math.round((e.berserkerDamageMult || 1) * 10);
            state.hp -= dmg;
            state.shakeAmount = 8;
            spawnFloatingText(player.x, player.y - 40, `-${dmg} HP`, '#ef4444');
            audio.hit();
          }
          spawnParticles(e.x, e.y, '#ef4444', 10, 3);
          e.hp = -999;
          if (state.targetEnemy === e) { state.targetEnemy = null; state.currentInput = ''; }
          if (state.hp <= 0) { state.hp = 0; showGameOver(); }
        }
      });
      enemies = enemies.filter((e) => e.hp > 0);

      // Update power drops
      powerDrops.forEach((d) => { d.lifeTimer -= dt; });
      powerDrops = powerDrops.filter((d) => {
        if (d.lifeTimer <= 0) {
          if (state.targetDrop === d) { state.targetDrop = null; state.currentInput = ''; }
          return false;
        }
        return true;
      });

      // Update augmentation drops
      augmentationDrops.forEach((d) => { d.lifeTimer -= dt; });
      augmentationDrops = augmentationDrops.filter((d) => {
        if (d.lifeTimer <= 0) {
          if (state.targetAugDrop === d) { state.targetAugDrop = null; state.currentInput = ''; }
          return false;
        }
        return true;
      });

      // Update rings / arcs
      shockwaveRings.forEach((r) => {
        r.radius += r.speed * dt;
        r.life -= dt * 1.5;
        if (r.damageTargets) {
          r.damageTargets.forEach((t) => {
            if (t.enemy.hp <= 0 || r.hitEnemies.has(t.enemy)) return;
            if (r.radius >= t.dist) {
              r.hitEnemies.add(t.enemy);
              damageEnemy(t.enemy, 1, 'weapon', t.precomputed);
              spawnParticles(t.enemy.x, t.enemy.y, r.color, 3, 2);
            }
          });
        }
      });
      shockwaveRings = shockwaveRings.filter((r) => r.life > 0 && r.radius < r.maxRadius);
      lightningArcs.forEach((a) => { a.life -= dt * 4; });
      lightningArcs = lightningArcs.filter((a) => a.life > 0);

      // Update orbs
      orbs.forEach((o) => {
        o.phase += dt * 6;
        const dx = player.x - o.x, dy = player.y - o.y, dist = Math.sqrt(dx * dx + dy * dy);
        const accel = 200 + (1 - o.life) * 500;
        if (dist > 1) { o.vx += (dx / dist) * accel * dt; o.vy += (dy / dist) * accel * dt; }
        o.x += o.vx * dt; o.y += o.vy * dt;
        if (dist < 15) { o.life = -1; spawnParticles(o.x, o.y, o.color, 3, 1); }
      });
      orbs = orbs.filter((o) => o.life > 0);

      // Update beams (arc beam weapon)
      beams.forEach((b) => { b.life -= dt * 2.5; });
      beams = beams.filter((b) => b.life > 0);

      // Update beam projectiles (traveling arc beams)
      beamProjectiles.forEach((bp) => {
        bp.progress += dt * bp.speed;
        if (bp.progress >= 1 && bp.target && bp.target.hp > 0) {
          damageEnemy(bp.target, bp.damage, bp.source || 'weapon', bp.precomputed);
          spawnParticles(bp.target.x, bp.target.y, bp.color, 5, 2);
          bp.progress = 999;
        }
      });
      beamProjectiles = beamProjectiles.filter((bp) => bp.progress < 1);

      // Update poison pools (venom weapon)
      poisonPools.forEach((pool) => {
        pool.life -= dt;
        pool.dotTimer -= dt;
        if (pool.dotTimer <= 0) {
          pool.dotTimer = 0.5;
          enemies.forEach((e) => {
            if (e.hp <= 0) return;
            if (Math.hypot(e.x - pool.x, e.y - pool.y) < pool.radius) {
              const baseMult = pool.fireTrail ? 0.2 : 0.3 * (state.venomDotMult || 1);
              let mult = state.damageMultiplier * baseMult;
              if (state.doubleTimer > 0) mult *= 2;
              e.hp -= mult;
              spawnParticles(e.x, e.y, pool.color || '#4ade80', 2, 1);
              if (e.hp <= 0) killEnemy(e);
            }
          });
        }
      });
      poisonPools = poisonPools.filter((p) => p.life > 0);

      // Orbiting orbs
      const orbCount = state.orbCount || 0;
      while (orbitingOrbs.length < orbCount) {
        orbitingOrbs.push({ angle: (orbitingOrbs.length / Math.max(1, orbCount)) * Math.PI * 2, radius: 60, phase: Math.random() * Math.PI * 2 });
      }
      orbitingOrbs = orbitingOrbs.slice(0, orbCount);
      orbitingOrbs.forEach((o, i) => {
        o.angle += dt * 3;
        o.x = player.x + Math.cos(o.angle + (i / Math.max(1, orbCount)) * Math.PI * 2) * o.radius;
        o.y = player.y + Math.sin(o.angle + (i / Math.max(1, orbCount)) * Math.PI * 2) * o.radius;
        o.phase += dt * 4;
        o.color = '#a78bfa';
        enemies.forEach((e) => {
          if (e.hp <= 0) return;
          if ((e.lastOrbHit || 0) + 500 > performance.now()) return;
          if (Math.hypot(e.x - o.x, e.y - o.y) < e.size + 12) {
            e.lastOrbHit = performance.now();
            damageEnemy(e, 1, 'weapon');
            spawnParticles(e.x, e.y, o.color, 3, 2);
          }
        });
      });

      // Spectre drones
      spectreDrones.forEach((d) => {
        if (!d.target || d.target.hp <= 0) {
          d.target = enemies.filter((e) => e.hp > 0).sort((a, b) => Math.hypot(a.x - d.x, a.y - d.y) - Math.hypot(b.x - d.x, b.y - d.y))[0];
        }
        if (d.target) {
          const dx = d.target.x - d.x, dy = d.target.y - d.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < d.target.size + 8) {
            damageEnemy(d.target, 1, 'weapon');
            spawnParticles(d.x, d.y, d.color, 5, 2);
            d.life = -1;
          } else if (dist > 1) {
            d.x += (dx / dist) * d.speed * dt * 60;
            d.y += (dy / dist) * d.speed * dt * 60;
          }
        }
        d.life -= dt;
      });
      spectreDrones = spectreDrones.filter((d) => d.life > 0);

      // Mines
      mines.forEach((m) => {
        m.x += m.vx * dt * 60;
        m.y += m.vy * dt * 60;
        m.life -= dt;
        let exploded = false;
        enemies.forEach((e) => {
          if (e.hp <= 0 || exploded) return;
          if (Math.hypot(e.x - m.x, e.y - m.y) < e.size + m.radius) {
            exploded = true;
            enemies.forEach((e2) => {
              if (e2.hp <= 0) return;
              const d = Math.hypot(e2.x - m.x, e2.y - m.y);
              if (d < m.radius + e2.size) {
                const falloff = 1 - (d / (m.radius + 20)) * 0.5;
                const mult = state.damageMultiplier * 0.8 * falloff * (state.doubleTimer > 0 ? 2 : 1);
                e2.hp -= mult;
                spawnParticles(e2.x, e2.y, m.color, 4, 2);
                if (e2.hp <= 0) killEnemy(e2, 'weapon');
              }
            });
            spawnParticles(m.x, m.y, m.color, 15, 4);
          }
        });
        if (exploded) m.life = -1;
      });
      mines = mines.filter((m) => m.life > 0);

      // Meteor markers
      if (state.meteorEnabled) {
        state.meteorTimer = (state.meteorTimer || 0) + dt;
        if (state.meteorTimer >= 8) {
          state.meteorTimer = 0;
          const angle = Math.random() * Math.PI * 2;
          const dist = 80 + Math.random() * 120;
          meteorMarkers.push({
            x: player.x + Math.cos(angle) * dist, y: player.y + Math.sin(angle) * dist,
            word: getWord(WORDS_EASY), typedIndex: 0, life: 15,
          });
        }
      }
      meteorMarkers.forEach((mm) => { mm.life -= dt; });
      meteorMarkers = meteorMarkers.filter((mm) => mm.life > 0);
      if (state.targetMeteorMarker && !meteorMarkers.includes(state.targetMeteorMarker)) {
        state.targetMeteorMarker = null;
        state.currentInput = '';
      }

      // Update projectiles
      projectiles.forEach((p) => {
        p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.life -= dt;

        if (p.type === 'meteor') {
          if (p.y >= (p.targetY || p.y)) {
            const radius = p.aoeRadius || 80;
            enemies.forEach((e) => {
              if (e.hp <= 0) return;
              const dist = Math.hypot(e.x - p.x, e.y - p.y);
              if (dist < radius + e.size) {
                const falloff = 1 - (dist / (radius + 20)) * 0.5;
                const isCrit = Math.random() < state.critChance;
                const mult = state.damageMultiplier * 1.5 * falloff * (isCrit ? 2 : 1) * (state.doubleTimer > 0 ? 2 : 1);
                damageEnemy(e, 1, 'weapon', { isCrit, mult });
              }
            });
            spawnParticles(p.x, p.y, p.color, 25, 5);
            p.life = -1;
          }
        } else if (p.type === 'shrapnel') {
          enemies.forEach((e) => {
            if (e.hp <= 0 || p.pierced.has(e)) return;
            if (Math.hypot(e.x - p.x, e.y - p.y) < e.size + 10) {
              p.pierced.add(e);
              const isCrit = Math.random() < state.critChance;
              let mult = state.damageMultiplier * (p.damage || 0.6) * (state.shrapnelDamageMult || 1) * (isCrit ? 2 : 1);
              if (state.doubleTimer > 0) mult *= 2;
              e.hp -= mult;
              if (state.cryoChance && Math.random() < state.cryoChance) { e.cryoUntil = performance.now() + 2000; spawnParticles(e.x, e.y, '#67e8f9', 5, 1); }
              spawnParticles(p.x, p.y, p.color, 4, 2);
              if (isCrit) { spawnFloatingText(e.x, e.y - 30, 'CRIT!', '#fbbf24'); state.critFlashTimer = 0.15; }
              if (state.shrapnelFireTrail) {
                poisonPools.push({ x: p.x, y: p.y, radius: 35, life: 1.5, maxLife: 1.5, dotTimer: 0, color: '#ef4444', fireTrail: true });
              }
              if (e.hp <= 0) killEnemy(e, 'weapon');
            }
          });
          if (Math.random() < 0.3) spawnParticles(p.x, p.y, p.color, 1, 0.5);
        } else if (p.type === 'venom') {
          if (p.target && p.target.hp > 0 && Math.hypot(p.target.x - p.x, p.target.y - p.y) < 25) {
            const r = Math.min(VENOM_MAX_POOL_RADIUS, 55 * (state.venomPoolRadius || 1));
            const dur = Math.min(VENOM_POOL_DURATION_MAX, 3 + (state.venomPoolDuration || 0));
            poisonPools.push({ x: p.x, y: p.y, radius: r, life: dur, maxLife: dur, dotTimer: 0, color: '#4ade80' });
            spawnParticles(p.x, p.y, '#4ade80', 12, 3);
            p.life = -1;
          } else if (!p.target || p.target.hp <= 0) {
            const r = Math.min(VENOM_MAX_POOL_RADIUS, 55 * (state.venomPoolRadius || 1));
            const dur = Math.min(VENOM_POOL_DURATION_MAX, 3 + (state.venomPoolDuration || 0));
            poisonPools.push({ x: p.x, y: p.y, radius: r, life: dur, maxLife: dur, dotTimer: 0, color: '#4ade80' });
            spawnParticles(p.x, p.y, '#4ade80', 12, 3);
            p.life = -1;
          }
          if (Math.random() < 0.4) spawnParticles(p.x, p.y, '#4ade80', 1, 0.3);
        } else if (p.type === 'ricochet') {
          let hitEnemy = null;
          enemies.forEach((e) => {
            if (e.hp <= 0 || p.hitEnemies.has(e)) return;
            if (Math.hypot(e.x - p.x, e.y - p.y) < e.size + 12) hitEnemy = e;
          });
          if (hitEnemy) {
            p.hitEnemies.add(hitEnemy);
            const isCrit = Math.random() < state.critChance;
            let mult = state.damageMultiplier * p.damageMult * (isCrit ? 2 : 1);
            if (state.doubleTimer > 0) mult *= 2;
            hitEnemy.hp -= mult;
            if (state.cryoChance && Math.random() < state.cryoChance) { hitEnemy.cryoUntil = performance.now() + 2000; spawnParticles(hitEnemy.x, hitEnemy.y, '#67e8f9', 5, 1); }
            spawnParticles(p.x, p.y, '#fbbf24', 8, 3);
            if (isCrit) { spawnFloatingText(hitEnemy.x, hitEnemy.y - 30, 'CRIT!', '#fbbf24'); state.critFlashTimer = 0.15; }
            if (hitEnemy.hp <= 0) killEnemy(hitEnemy, 'weapon');

            if (p.bouncesLeft > 0) {
              p.bouncesLeft--;
              p.damageMult *= (state.ricochetBounceMult || 0.7);
              audio.ricochetBounce();
              const next = enemies
                .filter((e) => e.hp > 0 && !p.hitEnemies.has(e) && Math.hypot(e.x - p.x, e.y - p.y) <= RICOCHET_MAX_BOUNCE_RANGE)
                .sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
              if (next) {
                const a = Math.atan2(next.y - p.y, next.x - p.x);
                const spd = 14 * state.projectileSpeed;
                p.vx = Math.cos(a) * spd; p.vy = Math.sin(a) * spd;
                p.target = next;
              } else {
                p.life = -1;
              }
            } else {
              p.life = -1;
            }
          }
          spawnParticles(p.x, p.y, '#fbbf24', 1, 0.3);
        } else {
          if (p.target && p.target.hp > 0) {
            if (Math.hypot(p.target.x - p.x, p.target.y - p.y) < 20) {
              spawnParticles(p.x, p.y, p.color, 8, 2);
              if (p.precomputed) {
                damageEnemy(p.target, p.damage || 1, p.source || 'weapon', p.precomputed);
              }
              p.life = -1;
            }
          }
          spawnParticles(p.x, p.y, p.color, 1, 0.5);
        }
      });
      projectiles = projectiles.filter((p) => p.life > 0);

      // Update particles
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life -= p.decay; });
      particles = particles.filter((p) => p.life > 0);

      floatingTexts.forEach((ft) => { ft.y += ft.vy; ft.life -= 0.02; });
      floatingTexts = floatingTexts.filter((ft) => ft.life > 0);

      // Player trail
      if (state.combo >= 10) {
        const t = performance.now() / 1000;
        if (!playerTrail.length || performance.now() - (playerTrail._lastPush || 0) > 80) {
          playerTrail.push({ x: player.x, y: player.y, angle: t });
          playerTrail._lastPush = performance.now();
          if (playerTrail.length > 8) playerTrail.shift();
        }
      } else { playerTrail.length = 0; }
      } // end if (!isPaused)

      // --- Draw (world space, inside camera transform) ---
      drawPlayerTrail();
      poisonPools.forEach(drawPoisonPool);
      shockwaveRings.forEach(drawShockwaveRing);
      lightningArcs.forEach(drawLightningArc);
      particles.forEach(drawParticle);
      orbs.forEach(drawOrb);
      orbitingOrbs.forEach(drawOrbitingOrb);
      spectreDrones.forEach(drawSpectreDrone);
      mines.forEach(drawMine);
      meteorMarkers.forEach(drawMeteorMarker);
      powerDrops.forEach(drawPowerDrop);
      augmentationDrops.forEach(drawAugmentationDrop);
      enemies.forEach((e) => { if (e.hp > 0) drawEnemy(e); });
      beams.forEach(drawBeam);
      beamProjectiles.forEach(drawBeamProjectile);
      projectiles.forEach(drawProjectile);
      drawPlayer();
      floatingTexts.forEach(drawFloatingText);

      // End camera transform, back to screen space for overlays
      ctx.restore();

      drawEdgeIndicators();
      drawFreezeOverlay();
      drawSlowOverlay();
      drawDangerVignette();
      drawCritFlash();
      drawNukeFlash();
      if (isPaused) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
      updateHUD();
    } else if (state.screen === 'menu') {
      drawMenuBackground(now);
    }

    updateSoftKeyboardVisibility();
    requestAnimationFrame(gameLoop);
  }

  function drawMenuGrid() {
    const th = getTheme(), spacing = 60, p = 0.04;
    ctx.save(); ctx.strokeStyle = `rgba(${th.gridR},${th.gridG},${th.gridB},${p})`; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }

  function drawMenuBackground(now) {
    const t = now / 1000;
    drawMenuGrid();
    for (let i = 0; i < 5; i++) {
      const x = W * 0.5 + Math.cos(t * 0.3 + i * 1.2) * W * 0.3;
      const y = H * 0.5 + Math.sin(t * 0.4 + i * 0.9) * H * 0.3;
      const sides = 3 + (i % 4);
      const color = ['#00f0ff', '#8b5cf6', '#f472b6', '#4ade80', '#f59e0b'][i];
      drawPolygon(x, y, 15 + i * 3, sides, t + i, color, 0.15);
    }
  }

  // Init
  loadTheme();
  loadParticleDensity();
  loadSoundSettings();
  loadAccessibilitySettings();

  function updateDensityButtons() {
    const d = getParticleDensity();
    document.querySelectorAll('.density-btn').forEach((btn) => {
      const val = parseFloat(btn.dataset.density);
      btn.classList.toggle('active', Math.abs(val - d) < 0.01);
    });
  }

  function wireDensityButtons() {
    document.querySelectorAll('.density-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.density);
        setParticleDensity(val);
        updateDensityButtons();
      });
    });
  }

  wireDensityButtons();
  initSoftKeyboard();
  updateDensityButtons();

  function updateSoundButtons() {
    const muteBtn = document.getElementById('sound-mute-btn');
    const pauseMuteBtn = document.getElementById('pause-sound-mute-btn');
    const volLabel = document.getElementById('sound-volume-label');
    const pauseVolLabel = document.getElementById('pause-sound-volume-label');
    const volSlider = document.getElementById('sound-volume-slider');
    const pauseVolSlider = document.getElementById('pause-sound-volume-slider');
    if (muteBtn) muteBtn.textContent = soundMuted ? 'UNMUTE' : 'MUTE';
    if (pauseMuteBtn) pauseMuteBtn.textContent = soundMuted ? 'UNMUTE' : 'MUTE';
    const pct = Math.round(soundVolume * 100);
    if (volLabel) volLabel.textContent = pct + '%';
    if (pauseVolLabel) pauseVolLabel.textContent = pct + '%';
    if (volSlider) volSlider.value = pct;
    if (pauseVolSlider) pauseVolSlider.value = pct;
  }

  function wireSoundButtons() {
    const muteBtn = document.getElementById('sound-mute-btn');
    const pauseMuteBtn = document.getElementById('pause-sound-mute-btn');
    const volSlider = document.getElementById('sound-volume-slider');
    const pauseVolSlider = document.getElementById('pause-sound-volume-slider');
    if (muteBtn) muteBtn.addEventListener('click', () => { setSoundMuted(!soundMuted); updateSoundButtons(); });
    if (pauseMuteBtn) pauseMuteBtn.addEventListener('click', () => { setSoundMuted(!soundMuted); updateSoundButtons(); });
    const onVolChange = (el) => { setSoundVolume(parseInt(el.value, 10) / 100); updateSoundButtons(); };
    if (volSlider) volSlider.addEventListener('input', () => onVolChange(volSlider));
    if (pauseVolSlider) pauseVolSlider.addEventListener('input', () => onVolChange(pauseVolSlider));
  }

  wireSoundButtons();
  updateSoundButtons();

  function updateAccessibilityButtons() {
    document.getElementById('colorblind-btn')?.classList.toggle('active', colorblindMode);
    const fontSizeBtn = document.getElementById('font-size-btn');
    if (fontSizeBtn) fontSizeBtn.textContent = 'FONT: ' + fontSizeMode.toUpperCase();
    document.getElementById('reduced-motion-btn')?.classList.toggle('active', reducedMotion);
  }

  function wireAccessibilityButtons() {
    document.getElementById('colorblind-btn')?.addEventListener('click', () => {
      setColorblindMode(!colorblindMode);
      updateAccessibilityButtons();
    });
    document.getElementById('font-size-btn')?.addEventListener('click', () => {
      const next = fontSizeMode === 'small' ? 'medium' : fontSizeMode === 'medium' ? 'large' : 'small';
      setFontSizeMode(next);
      updateAccessibilityButtons();
    });
    document.getElementById('reduced-motion-btn')?.addEventListener('click', () => {
      setReducedMotion(!reducedMotion);
      updateAccessibilityButtons();
    });
  }

  wireAccessibilityButtons();
  updateAccessibilityButtons();

  function loadWordlistSettings() {
    try {
      const src = localStorage.getItem('typocalypse-wordlist-source');
      if (src === 'builtin' || src === 'custom' || src === 'api') state.wordlistSource = src;
      const custom = localStorage.getItem('typocalypse-custom-words');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (parsed && Array.isArray(parsed.words)) state.wordlistOverride = parsed;
      }
      if (state.wordlistSource === 'api' && !state.apiWordBuffer?.length) refillWordBuffer();
    } catch {}
  }

  function wireWordSourceButtons() {
    document.querySelectorAll('.word-source-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.wordlistSource = btn.dataset.source;
        localStorage.setItem('typocalypse-wordlist-source', state.wordlistSource);
        document.querySelectorAll('.word-source-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('custom-words-section').style.display = state.wordlistSource === 'custom' ? 'block' : 'none';
        if (state.wordlistSource === 'api') refillWordBuffer();
      });
    });
    const customSection = document.getElementById('custom-words-section');
    if (customSection) customSection.style.display = state.wordlistSource === 'custom' ? 'block' : 'none';
  }

  function wireCustomWords() {
    const input = document.getElementById('custom-words-input');
    const saveBtn = document.getElementById('save-custom-words');
    if (input && state.wordlistOverride?.words) {
      input.value = state.wordlistOverride.words.join('\n');
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const text = (input?.value || '').trim();
        const words = text.split(/\s+/).filter((w) => w.length >= 2).map((w) => w.toLowerCase().replace(/[^a-z]/g, ''));
        if (words.length > 0) {
          state.wordlistOverride = { name: 'Custom', words };
          localStorage.setItem('typocalypse-custom-words', JSON.stringify(state.wordlistOverride));
          state.wordlistSource = 'custom';
          localStorage.setItem('typocalypse-wordlist-source', 'custom');
          document.querySelectorAll('.word-source-btn').forEach((b) => b.classList.toggle('active', b.dataset.source === 'custom'));
        }
      });
    }
  }

  loadWordlistSettings();
  wireWordSourceButtons();
  wireCustomWords();

  document.querySelectorAll('.input-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => setInputMode(btn.dataset.mode));
  });

  if (dom.settingsBtn) dom.settingsBtn.addEventListener('click', () => {
    updateDensityButtons();
    updateSoundButtons();
    updateAccessibilityButtons();
    const input = document.getElementById('custom-words-input');
    if (input && state.wordlistOverride?.words) input.value = state.wordlistOverride.words.join('\n');
    document.querySelectorAll('.word-source-btn').forEach((b) => b.classList.toggle('active', b.dataset.source === state.wordlistSource));
    document.getElementById('custom-words-section').style.display = state.wordlistSource === 'custom' ? 'block' : 'none';
    dom.menuScreen.classList.add('hidden');
    dom.settingsScreen.classList.remove('hidden');
  });
  if (dom.settingsCloseBtn) dom.settingsCloseBtn.addEventListener('click', () => {
    dom.settingsScreen.classList.add('hidden');
    dom.menuScreen.classList.remove('hidden');
  });

  requestAnimationFrame(gameLoop);
})();
