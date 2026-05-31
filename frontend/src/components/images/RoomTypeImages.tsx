export function RoomImageSingle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0f4ff" />
          <stop offset="100%" stopColor="#dbe4ff" />
        </linearGradient>
        <linearGradient id="sg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8dcc8" />
          <stop offset="100%" stopColor="#d4c4a8" />
        </linearGradient>
        <linearGradient id="sg3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="100%" stopColor="#fff3cc" />
        </linearGradient>
        <linearGradient id="sg4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8db8e8" />
          <stop offset="100%" stopColor="#6ba3d6" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sg1)" />
      <rect x="0" y="380" width="800" height="120" fill="url(#sg2)" />
      <rect x="60" y="60" width="200" height="260" rx="4" fill="url(#sg4)" opacity="0.35" />
      <rect x="80" y="80" width="160" height="220" rx="3" fill="#b8d4f0" opacity="0.5" />
      <line x1="160" y1="80" x2="160" y2="300" stroke="#7aaed4" strokeWidth="1.5" opacity="0.4" />
      <line x1="80" y1="190" x2="240" y2="190" stroke="#7aaed4" strokeWidth="1.5" opacity="0.4" />
      <rect x="100" y="100" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="170" y="100" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="100" y="210" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="170" y="210" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="540" y="60" width="200" height="260" rx="4" fill="url(#sg4)" opacity="0.35" />
      <rect x="560" y="80" width="160" height="220" rx="3" fill="#b8d4f0" opacity="0.5" />
      <line x1="640" y1="80" x2="640" y2="300" stroke="#7aaed4" strokeWidth="1.5" opacity="0.4" />
      <line x1="560" y1="190" x2="720" y2="190" stroke="#7aaed4" strokeWidth="1.5" opacity="0.4" />
      <rect x="580" y="100" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="650" y="100" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="580" y="210" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="650" y="210" width="50" height="50" rx="2" fill="#a3cef1" opacity="0.4" />
      <rect x="280" y="240" width="240" height="150" rx="6" fill="url(#sg3)" />
      <rect x="290" y="250" width="220" height="130" rx="4" fill="#fff8e1" opacity="0.6" />
      <rect x="310" y="280" width="180" height="80" rx="3" fill="#f5e6c8" opacity="0.5" />
      <rect x="340" y="285" width="120" height="70" rx="2" fill="#ede0c8" opacity="0.6" />
      <rect x="310" y="370" width="180" height="10" rx="2" fill="#e8d5b0" />
      <ellipse cx="400" cy="200" rx="60" ry="40" fill="#e8e0d0" opacity="0.3" />
      <rect x="360" y="160" width="80" height="80" rx="40" fill="#f5f0e8" opacity="0.4" />
      <ellipse cx="160" cy="350" rx="30" ry="8" fill="#c9b896" opacity="0.3" />
      <ellipse cx="640" cy="350" rx="30" ry="8" fill="#c9b896" opacity="0.3" />
      <circle cx="150" cy="340" r="15" fill="#e8dcc8" opacity="0.3" />
      <circle cx="640" cy="340" r="15" fill="#e8dcc8" opacity="0.3" />
      <rect x="300" y="80" width="200" height="16" rx="3" fill="#c9b896" opacity="0.25" />
      <circle cx="400" cy="88" r="3" fill="#d4c4a8" opacity="0.4" />
      <rect x="250" y="310" width="20" height="80" rx="2" fill="#cab898" opacity="0.2" />
      <rect x="530" y="310" width="20" height="80" rx="2" fill="#cab898" opacity="0.2" />
    </svg>
  );
}

export function RoomImageDouble({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3f2" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
        <linearGradient id="dg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fce4ec" />
          <stop offset="100%" stopColor="#f8bbd0" />
        </linearGradient>
        <linearGradient id="dg3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fce4ec" />
        </linearGradient>
        <linearGradient id="dg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e63" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>
        <linearGradient id="dg5" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5e6d3" />
          <stop offset="100%" stopColor="#e8d5b8" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#dg1)" />
      <rect x="0" y="400" width="800" height="100" fill="url(#dg5)" />
      <rect x="60" y="50" width="320" height="280" rx="4" fill="#d4a574" opacity="0.15" />
      <rect x="260" y="70" width="100" height="100" rx="4" fill="url(#dg4)" opacity="0.2" />
      <rect x="270" y="80" width="80" height="80" rx="2" fill="#f8bbd0" opacity="0.3" />
      <rect x="80" y="70" width="150" height="200" rx="4" fill="#fff" opacity="0.4" />
      <rect x="95" y="90" width="120" height="150" rx="2" fill="#fce4ec" opacity="0.3" />
      <line x1="155" y1="90" x2="155" y2="240" stroke="#f48fb1" strokeWidth="1" opacity="0.3" />
      <rect x="100" y="95" width="45" height="55" rx="1" fill="#f8bbd0" opacity="0.3" />
      <rect x="165" y="95" width="45" height="55" rx="1" fill="#f8bbd0" opacity="0.3" />
      <rect x="100" y="180" width="45" height="55" rx="1" fill="#f8bbd0" opacity="0.3" />
      <rect x="165" y="180" width="45" height="55" rx="1" fill="#f8bbd0" opacity="0.3" />
      <rect x="420" y="70" width="160" height="220" rx="4" fill="#d4a574" opacity="0.12" />
      <rect x="440" y="90" width="120" height="180" rx="2" fill="#fff" opacity="0.3" />
      <rect x="480" y="100" width="40" height="55" rx="1" fill="#e1bee7" opacity="0.3" />
      <rect x="480" y="190" width="40" height="55" rx="1" fill="#e1bee7" opacity="0.3" />
      <rect x="620" y="100" width="100" height="80" rx="4" fill="#e1bee7" opacity="0.2" />
      <rect x="630" y="110" width="80" height="60" rx="2" fill="#fff" opacity="0.3" />
      <rect x="200" y="260" width="400" height="140" rx="8" fill="url(#dg3)" />
      <rect x="210" y="270" width="380" height="120" rx="6" fill="#fff" opacity="0.6" />
      <rect x="220" y="290" width="360" height="80" rx="4" fill="#fce4ec" opacity="0.3" />
      <ellipse cx="320" cy="330" rx="60" ry="25" fill="#f8bbd0" opacity="0.3" />
      <ellipse cx="480" cy="330" rx="60" ry="25" fill="#f8bbd0" opacity="0.3" />
      <circle cx="320" cy="325" r="8" fill="#ec407a" opacity="0.15" />
      <circle cx="480" cy="325" r="8" fill="#ec407a" opacity="0.15" />
      <rect x="210" y="395" width="100" height="8" rx="2" fill="#d4a574" opacity="0.3" />
      <rect x="330" y="395" width="100" height="8" rx="2" fill="#d4a574" opacity="0.3" />
      <rect x="450" y="395" width="100" height="8" rx="2" fill="#d4a574" opacity="0.3" />
      <circle cx="150" cy="370" r="20" fill="#fce4ec" opacity="0.3" />
      <circle cx="650" cy="360" r="25" fill="#e1bee7" opacity="0.25" />
      <rect x="380" y="60" width="40" height="20" rx="3" fill="#ec407a" opacity="0.12" />
      <path d="M400 60 Q400 45 420 50" fill="none" stroke="#ec407a" strokeWidth="1" opacity="0.2" />
      <circle cx="120" cy="380" r="3" fill="#f48fb1" opacity="0.3" />
      <circle cx="680" cy="380" r="3" fill="#ce93d8" opacity="0.3" />
      <rect x="300" y="440" width="200" height="6" rx="3" fill="#d4a574" opacity="0.2" />
    </svg>
  );
}

export function RoomImageSuite({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef9e7" />
          <stop offset="50%" stopColor="#fdebd0" />
          <stop offset="100%" stopColor="#f9e79f" />
        </linearGradient>
        <linearGradient id="stg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id="stg3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="100%" stopColor="#fef9e7" />
        </linearGradient>
        <linearGradient id="stg4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#daa520" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#stg1)" />
      <rect x="0" y="420" width="800" height="80" fill="url(#stg2)" opacity="0.3" />
      <rect x="30" y="30" width="740" height="300" rx="8" fill="#fff" opacity="0.2" />
      <rect x="50" y="50" width="200" height="260" rx="4" fill="#d4a574" opacity="0.15" />
      <rect x="65" y="65" width="170" height="230" rx="3" fill="#fff" opacity="0.3" />
      <rect x="80" y="80" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="155" y="80" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="80" y="180" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="155" y="180" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="280" y="50" width="200" height="260" rx="4" fill="#d4a574" opacity="0.15" />
      <rect x="295" y="65" width="170" height="230" rx="3" fill="#fff" opacity="0.3" />
      <rect x="310" y="80" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="385" y="80" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="310" y="180" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="385" y="180" width="65" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="510" y="50" width="240" height="260" rx="4" fill="#d4a574" opacity="0.15" />
      <rect x="525" y="65" width="210" height="230" rx="3" fill="#fff" opacity="0.3" />
      <rect x="545" y="85" width="85" height="90" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="640" y="85" width="80" height="90" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="545" y="195" width="85" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="640" y="195" width="80" height="80" rx="2" fill="#fef9e7" opacity="0.5" />
      <rect x="80" y="360" width="640" height="60" rx="6" fill="url(#stg3)" />
      <rect x="90" y="370" width="620" height="40" rx="4" fill="#fef9e7" opacity="0.6" />
      <circle cx="200" cy="390" r="12" fill="#ffd700" opacity="0.3" />
      <circle cx="400" cy="390" r="12" fill="#ffd700" opacity="0.3" />
      <circle cx="600" cy="390" r="12" fill="#ffd700" opacity="0.3" />
      <ellipse cx="400" cy="340" rx="120" ry="30" fill="#f9e79f" opacity="0.3" />
      <circle cx="400" cy="330" r="18" fill="#ffd700" opacity="0.15" />
      <circle cx="380" cy="325" r="5" fill="#ffd700" opacity="0.15" />
      <circle cx="420" cy="325" r="5" fill="#ffd700" opacity="0.15" />
      <rect x="100" y="320" width="30" height="80" rx="2" fill="#d4a574" opacity="0.1" />
      <rect x="670" y="320" width="30" height="80" rx="2" fill="#d4a574" opacity="0.1" />
      <rect x="150" y="440" width="500" height="8" rx="4" fill="#b8860b" opacity="0.15" />
      <rect x="340" y="460" width="120" height="4" rx="2" fill="#d4a574" opacity="0.2" />
      <circle cx="720" cy="50" r="40" fill="#ffd700" opacity="0.06" />
      <circle cx="80" cy="40" r="30" fill="#ffd700" opacity="0.06" />
      <path d="M60 340 Q 80 330 100 340" fill="none" stroke="#d4a574" strokeWidth="1.5" opacity="0.2" />
      <path d="M700 340 Q 720 330 740 340" fill="none" stroke="#d4a574" strokeWidth="1.5" opacity="0.2" />
    </svg>
  );
}

export function HotelHeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#0f3460" />
        </linearGradient>
        <linearGradient id="hg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#daa520" />
        </linearGradient>
        <linearGradient id="hg3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f5e6d3" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id="hg4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#hg1)" />
      <circle cx="900" cy="80" r="100" fill="#ffd700" opacity="0.05" />
      <circle cx="950" cy="60" r="60" fill="#ffd700" opacity="0.04" />
      <polygon points="0,400 0,300 80,260 160,300 240,240 320,280 400,220 480,260 560,300 640,250 720,280 800,300 880,260 960,300 1040,280 1120,300 1200,260 1200,400" fill="#0a1628" opacity="0.3" />
      <polygon points="0,400 0,330 80,310 160,330 240,290 320,320 400,280 480,310 560,340 640,300 720,320 800,340 880,310 960,330 1040,320 1120,340 1200,310 1200,400" fill="#0d1b33" opacity="0.25" />
      <rect x="500" y="80" width="200" height="220" rx="4" fill="#1a2744" stroke="#ffd700" strokeWidth="1" opacity="0.8" />
      <line x1="500" y1="100" x2="700" y2="100" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />
      <line x1="500" y1="120" x2="700" y2="120" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />
      <line x1="500" y1="140" x2="700" y2="140" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />
      <line x1="500" y1="160" x2="700" y2="160" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />
      <line x1="500" y1="180" x2="700" y2="180" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />
      <line x1="600" y1="80" x2="600" y2="300" stroke="#ffd700" strokeWidth="0.5" opacity="0.5" />
      <rect x="570" y="270" width="60" height="30" rx="2" fill="#ffd700" opacity="0.3" />
      <rect x="585" y="275" width="30" height="20" rx="1" fill="#0d1b33" opacity="0.5" />
      <rect x="510" y="105" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="555" y="105" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="610" y="105" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="655" y="105" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="510" y="145" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="555" y="145" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="610" y="145" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="655" y="145" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="510" y="185" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="555" y="185" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="610" y="185" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="655" y="185" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="510" y="225" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="555" y="225" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="610" y="225" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="655" y="225" width="35" height="25" rx="2" fill="url(#hg4)" />
      <rect x="430" y="130" width="60" height="170" rx="2" fill="#142038" stroke="#7aaed4" strokeWidth="0.5" opacity="0.6" />
      <rect x="440" y="140" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="440" y="170" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="440" y="200" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="440" y="230" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="710" y="130" width="60" height="170" rx="2" fill="#142038" stroke="#7aaed4" strokeWidth="0.5" opacity="0.6" />
      <rect x="720" y="140" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="720" y="170" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="720" y="200" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="720" y="230" width="40" height="20" rx="1" fill="url(#hg4)" />
      <rect x="300" y="180" width="120" height="120" rx="2" fill="#142038" stroke="#7aaed4" strokeWidth="0.5" opacity="0.4" />
      <rect x="310" y="190" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="365" y="190" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="310" y="240" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="365" y="240" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="780" y="180" width="120" height="120" rx="2" fill="#142038" stroke="#7aaed4" strokeWidth="0.5" opacity="0.4" />
      <rect x="790" y="190" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="845" y="190" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="790" y="240" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="845" y="240" width="45" height="35" rx="1" fill="url(#hg4)" />
      <rect x="600" y="55" width="40" height="15" rx="3" fill="url(#hg2)" opacity="0.8" />
      <text x="620" y="66" textAnchor="middle" fill="#1a1a2e" fontSize="7" fontWeight="bold">HOTEL</text>
      <ellipse cx="600" cy="300" rx="160" ry="10" fill="#ffd700" opacity="0.06" />
      <line x1="0" y1="300" x2="500" y2="300" stroke="#ffd700" strokeWidth="0.3" opacity="0.2" />
      <line x1="700" y1="300" x2="1200" y2="300" stroke="#ffd700" strokeWidth="0.3" opacity="0.2" />
      <circle cx="150" cy="260" r="3" fill="#ffd700" opacity="0.15" />
      <circle cx="350" cy="290" r="2" fill="#ffd700" opacity="0.12" />
      <circle cx="850" cy="270" r="3" fill="#ffd700" opacity="0.15" />
      <circle cx="1050" cy="250" r="2" fill="#ffd700" opacity="0.12" />
      <rect x="920" y="200" width="80" height="100" rx="2" fill="#142038" stroke="#ffd700" strokeWidth="0.3" opacity="0.3" />
      <rect x="930" y="210" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="965" y="210" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="930" y="240" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="965" y="240" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="930" y="270" width="60" height="20" rx="1" fill="url(#hg4)" />
      <rect x="200" y="220" width="80" height="80" rx="2" fill="#142038" stroke="#ffd700" strokeWidth="0.3" opacity="0.3" />
      <rect x="210" y="230" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="245" y="230" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="210" y="260" width="25" height="20" rx="1" fill="url(#hg4)" />
      <rect x="245" y="260" width="25" height="20" rx="1" fill="url(#hg4)" />
      <circle cx="100" cy="100" r="2" fill="#fff" opacity="0.3" />
      <circle cx="300" cy="70" r="1.5" fill="#fff" opacity="0.2" />
      <circle cx="1100" cy="90" r="2" fill="#fff" opacity="0.3" />
      <circle cx="950" cy="120" r="1" fill="#fff" opacity="0.2" />
      <circle cx="50" cy="200" r="1.5" fill="#fff" opacity="0.15" />
      <circle cx="550" cy="50" r="1" fill="#fff" opacity="0.2" />
    </svg>
  );
}