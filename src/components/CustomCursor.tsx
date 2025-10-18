import { useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  useEffect(() => {
    const newTrail = [...trail, { x, y, id: Date.now() }].slice(-8);
    setTrail(newTrail);
  }, [x, y]);

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9999] w-1 h-1 bg-primary rounded-full"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: (index + 1) / trail.length * 0.3,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999] transition-all duration-200"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        {/* Outer ring */}
        <div className={`w-8 h-8 border-2 border-primary rounded-full ${isHovering ? 'animate-pulse' : ''}`}>
          {/* Crosshair lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-primary transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-primary transform -translate-x-1/2" />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full blur-md" />
      </div>
    </>
  );
};
