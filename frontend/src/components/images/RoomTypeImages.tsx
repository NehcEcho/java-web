const baseUrl = 'https://images.unsplash.com';

const singleImages = [
  `${baseUrl}/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1631049552057-403cdb8f0658?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1711059985570-4c32ed12a12c?w=800&h=500&fit=crop&auto=format`,
];

const doubleImages = [
  `${baseUrl}/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1595576508898-0ad5c879a061?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1618773928121-c32242e63f39?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1505693416388-ac5ce068fe85?w=800&h=500&fit=crop&auto=format`,
];

const suiteImages = [
  `${baseUrl}/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1591088398332-8a7791972843?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop&auto=format`,
  `${baseUrl}/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop&auto=format`,
];

const heroImages = [
  `${baseUrl}/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop&auto=format`,
  `${baseUrl}/photo-1551882547-ff40c63fe5fa?w=1200&h=400&fit=crop&auto=format`,
  `${baseUrl}/photo-1542314831-068cd1dbfeeb?w=1200&h=400&fit=crop&auto=format`,
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function RoomImg({ src, className = '', roomNumber, tag, tagClass }: { src: string; className?: string; roomNumber?: string; tag?: string; tagClass?: string }) {
  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <img
        src={src}
        alt={roomNumber ? `Room ${roomNumber}` : 'hotel room'}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {roomNumber && (
        <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur text-white text-xs px-2 py-0.5 rounded-md">
          {roomNumber}
        </span>
      )}
      {tag && (
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-md backdrop-blur ${tagClass || 'bg-white/60 text-gray-700'}`}>
          {tag}
        </span>
      )}
    </div>
  );
}

export function RoomImageSingle({ className = '', roomNumber }: { className?: string; roomNumber?: string }) {
  const idx = hash(roomNumber || '0') % singleImages.length;
  return <RoomImg src={singleImages[idx]} className={className} roomNumber={roomNumber} tag="单人" tagClass="bg-slate-100/80 text-slate-600" />;
}

export function RoomImageDouble({ className = '', roomNumber }: { className?: string; roomNumber?: string }) {
  const idx = hash(roomNumber || '0') % doubleImages.length;
  return <RoomImg src={doubleImages[idx]} className={className} roomNumber={roomNumber} tag="双人" tagClass="bg-amber-100/80 text-amber-700" />;
}

export function RoomImageSuite({ className = '', roomNumber }: { className?: string; roomNumber?: string }) {
  const idx = hash(roomNumber || '0') % suiteImages.length;
  return <RoomImg src={suiteImages[idx]} className={className} roomNumber={roomNumber} tag="套房" tagClass="bg-indigo-100/80 text-indigo-700" />;
}

let heroIdx = 0;
export function HotelHeroIllustration({ className = '' }: { className?: string }) {
  const src = heroImages[heroIdx++ % heroImages.length];
  return <RoomImg src={src} className={className} />;
}
