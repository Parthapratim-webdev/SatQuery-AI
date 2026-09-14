import React from 'react';

export type MascotMood = 'idle' | 'happy' | 'analyzing' | 'greeting';
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface OrbitMascotProps {
  size?: MascotSize;
  mood?: MascotMood;
  animated?: boolean;
  className?: string;
  showHalo?: boolean;
}

const sizeMap: Record<MascotSize, { container: string; px: number }> = {
  xs: { container: 'w-9 h-9 sm:w-10 sm:h-10', px: 38 },
  sm: { container: 'w-13 h-13 sm:w-14 sm:h-14', px: 54 },
  md: { container: 'w-18 h-18 sm:w-20 sm:h-20', px: 76 },
  lg: { container: 'w-24 h-24 sm:w-28 sm:h-28', px: 104 },
  xl: { container: 'w-36 h-36 sm:w-40 sm:h-40', px: 155 },
};

export const OrbitMascot: React.FC<OrbitMascotProps> = ({
  size = 'md',
  mood = 'idle',
  animated = true,
  className = '',
  showHalo = true,
}) => {
  const { container } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${container} ${
        animated ? 'animate-mascot-float' : ''
      } ${className}`}
      role="img"
      aria-label="Orbit, the SatQuery AI Satellite Mascot"
    >
      {/* Soft Light Accent Around Mascot */}
      {showHalo && (
        <div className="absolute inset-0 rounded-full bg-blue-50 blur-xs pointer-events-none" />
      )}

      {/* SVG Simple, Clean, Circular Satellite Mascot */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible relative z-10"
      >
        <defs>
          {/* Main Pure White Spherical Body Gradient */}
          <linearGradient id="orbit-body-grad" x1="25" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="85%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Blue Side Body Armor Gradient */}
          <linearGradient id="orbit-side-body-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="45%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Visor Screen Dark Glass Gradient */}
          <linearGradient id="orbit-visor-grad" x1="30" y1="36" x2="70" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Planetary Orbital Ring Gradient */}
          <linearGradient id="orbit-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
          </linearGradient>

          {/* Thruster / Beacon Glow Gradient */}
          <radialGradient id="orbit-beacon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Sub-Orbital Thruster Beacon (Bottom Glow) */}
        <ellipse cx="50" cy="85" rx="8" ry="3" fill="url(#orbit-beacon-glow)" />
        <circle cx="50" cy="84" r="2.2" fill="#2563eb" />

        {/* 2. Top Telemetry Antenna Mast with Signal Beacon */}
        <g id="top-antenna">
          <line x1="50" y1="13" x2="50" y2="6" stroke="#0284c7" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="45" y1="9" x2="55" y2="9" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="50" cy="5" r="3.2" fill="#38bdf8" className="animate-pulse" />
          <circle cx="50" cy="5" r="1.3" fill="#ffffff" />
        </g>

        {/* 3. Main Simple, Clean Circular Mascot Hull (Sphere) */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="url(#orbit-body-grad)"
          stroke="#94a3b8"
          strokeWidth="1.8"
        />

        {/* 4. Sleek Blue Side Body Armor Panels (Contouring the Sphere) */}
        {/* Left Blue Flank Armor */}
        <path
          d="M 19 32 A 37 37 0 0 0 19 68 C 24 60 26 40 19 32 Z"
          fill="url(#orbit-side-body-grad)"
          stroke="#38bdf8"
          strokeWidth="1.2"
        />
        {/* Right Blue Flank Armor */}
        <path
          d="M 81 32 A 37 37 0 0 1 81 68 C 76 60 74 40 81 32 Z"
          fill="url(#orbit-side-body-grad)"
          stroke="#38bdf8"
          strokeWidth="1.2"
        />

        {/* 5. Pearlescent Specular Reflection Arc on White Sphere */}
        <ellipse cx="44" cy="28" rx="18" ry="7.5" fill="#ffffff" fillOpacity="0.85" transform="rotate(-15 44 28)" />

        {/* 6. Centered High-Tech Glossy Visor Screen */}
        <rect
          x="28"
          y="38"
          width="44"
          height="24"
          rx="12"
          fill="url(#orbit-visor-grad)"
          stroke="#38bdf8"
          strokeWidth="1.6"
        />

        {/* Visor Glare Reflex Arc */}
        <path
          d="M 35 43 Q 50 40.5 65 43"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />

        {/* 7. Expressive Digital Eyes & Face Moods */}
        {mood === 'happy' || mood === 'greeting' ? (
          /* Joyful Arched Eyes */
          <g id="happy-eyes" stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round">
            <path d="M 38 50 Q 42 44 46 50" />
            <path d="M 54 50 Q 58 44 62 50" />
          </g>
        ) : mood === 'analyzing' ? (
          /* High-Tech Radar Sensor Scan Eyes */
          <g id="analyzing-eyes">
            <rect x="35" y="47.5" width="9" height="4.5" rx="2" fill="#3b82f6" />
            <rect x="56" y="47.5" width="9" height="4.5" rx="2" fill="#3b82f6" />
            <line x1="33" y1="49.5" x2="67" y2="49.5" stroke="#60a5fa" strokeWidth="1.8" />
          </g>
        ) : (
          /* Standard Friendly Awake Eyes (Idle) */
          <g id="idle-eyes">
            {/* Left Eye */}
            <ellipse cx="42" cy="49.5" rx="3.3" ry="5" fill="#3b82f6" />
            <circle cx="43.2" cy="47.8" r="1.3" fill="#ffffff" />
            {/* Right Eye */}
            <ellipse cx="58" cy="49.5" rx="3.3" ry="5" fill="#3b82f6" />
            <circle cx="59.2" cy="47.8" r="1.3" fill="#ffffff" />
          </g>
        )}

        {/* Cute Micro Blush Glow Accents */}
        <circle cx="33.5" cy="54" r="1.6" fill="#38bdf8" fillOpacity="0.45" />
        <circle cx="66.5" cy="54" r="1.6" fill="#38bdf8" fillOpacity="0.45" />

        {/* 8. Planetary Orbit Ring encircling Circular Mascot */}
        <ellipse
          cx="50"
          cy="51"
          rx="47"
          ry="16"
          fill="none"
          stroke="url(#orbit-ring-grad)"
          strokeWidth="1.8"
          strokeDasharray="5 3.5"
          transform="rotate(-16 50 51)"
          className={animated ? 'animate-mascot-orbit' : ''}
          style={{ transformOrigin: '50px 51px' }}
        />

        {/* Micro Telemetry Satellite Node riding the Orbit Ring */}
        <g transform="rotate(-16 50 51)">
          <circle cx="97" cy="51" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
          <circle cx="97" cy="51" r="1.2" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
