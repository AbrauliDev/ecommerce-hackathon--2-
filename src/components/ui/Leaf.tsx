// Decoración SVG de hoja — uso sutil en bordes de secciones
// Tres variantes para variar a lo largo del sitio

interface LeafProps {
  className?: string;
  variant?: 1 | 2 | 3;
  color?: string;
}

export const Leaf = ({ className = '', variant = 1, color = 'currentColor' }: LeafProps) => {
  if (variant === 1) {
    // Hoja monstera estilizada
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 50 95 Q 48 70 50 50 Q 52 30 50 5 M 50 25 Q 35 22 25 30 M 50 25 Q 65 22 75 30 M 50 45 Q 30 42 18 55 M 50 45 Q 70 42 82 55 M 50 65 Q 35 65 25 75"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 2) {
    // Hoja palma con divisiones radiales
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 50 95 L 50 50 M 50 50 Q 30 40 15 35 M 50 50 Q 35 30 25 15 M 50 50 Q 50 30 50 10 M 50 50 Q 65 30 75 15 M 50 50 Q 70 40 85 35"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Variant 3 — rama sencilla
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 20 80 Q 40 60 80 20 M 35 65 Q 30 55 25 50 M 50 50 Q 45 40 40 35 M 65 35 Q 60 25 55 20"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
