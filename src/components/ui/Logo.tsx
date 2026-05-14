// Logo Lazy - perezoso en hamaca minimalista geométrico
// Tres variantes: full (con texto), mark (solo círculo), text (solo letras)

interface LogoProps {
  variant?: 'full' | 'mark' | 'text';
  className?: string;
  // 'auto' usa colores del tema; 'light' usa crema (para fondos oscuros)
  tone?: 'auto' | 'light';
}

export const Logo = ({ variant = 'full', className = '', tone = 'auto' }: LogoProps) => {
  const stroke = tone === 'light' ? '#fdfbf6' : '#2d2520';
  const fill = tone === 'light' ? '#fdfbf6' : '#2d2520';

  // SVG mark: círculo + perezoso esquemático en hamaca + palmeras simplificadas
  const Mark = (
    <svg
      viewBox="0 0 80 80"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lazy logo"
    >
      {/* Círculo exterior */}
      <circle cx="40" cy="40" r="37" fill="none" stroke={stroke} strokeWidth="2" />

      {/* Palmera izquierda — tronco curvo */}
      <path
        d="M 18 60 Q 22 45 24 28"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hojas palmera izquierda */}
      <path
        d="M 24 28 Q 16 22 12 26 M 24 28 Q 30 18 28 14 M 24 28 Q 32 26 36 22 M 24 28 Q 18 30 14 32"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Palmera derecha */}
      <path
        d="M 62 60 Q 58 45 56 28"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 56 28 Q 64 22 68 26 M 56 28 Q 50 18 52 14 M 56 28 Q 48 26 44 22 M 56 28 Q 62 30 66 32"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Hamaca — curva entre las palmeras */}
      <path
        d="M 22 38 Q 40 52 58 38"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Perezoso — cuerpo ovalado */}
      <ellipse cx="40" cy="42" rx="9" ry="6" fill={fill} />
      {/* Cabeza */}
      <circle cx="40" cy="38" r="4" fill={fill} />
      {/* Z de dormido */}
      <text
        x="48"
        y="32"
        fontSize="7"
        fontFamily="Fraunces, serif"
        fontWeight="700"
        fill={fill}
      >z</text>
    </svg>
  );

  if (variant === 'mark') {
    return <div className={className}>{Mark}</div>;
  }

  if (variant === 'text') {
    return (
      <span
        className={`font-display font-bold tracking-tight ${className}`}
        style={{ color: tone === 'light' ? '#fdfbf6' : '#2d2520' }}
      >
        Lazy<span className="text-clay-500">.</span>
      </span>
    );
  }

  // full: mark + texto
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="h-9 w-9 shrink-0">{Mark}</div>
      <span
        className="font-display text-2xl font-bold tracking-tight"
        style={{ color: tone === 'light' ? '#fdfbf6' : '#2d2520' }}
      >
        Lazy<span className="text-clay-500">.</span>
      </span>
    </div>
  );
};
