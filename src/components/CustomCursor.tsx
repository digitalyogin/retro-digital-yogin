import { useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {/* 8-bit Macintosh style arrow cursor */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          imageRendering: 'pixelated',
          filter: isHovering 
            ? 'drop-shadow(0 0 8px hsl(var(--primary))) drop-shadow(0 0 16px hsl(var(--primary) / 0.5))' 
            : 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))',
          transform: isHovering ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.1s ease-out, filter 0.1s ease-out',
        }}
      >
        {/* Black outline */}
        <path
          d="M0 0 L0 14 L3 11 L5 16 L7 15 L5 10 L9 10 Z"
          fill="black"
          stroke="black"
          strokeWidth="1"
        />
        {/* White/Primary fill */}
        <path
          d="M1 1 L1 12 L3 10 L5.5 14.5 L6 14 L4 9 L8 9 Z"
          fill={isHovering ? "hsl(var(--primary))" : "white"}
        />
      </svg>
    </div>
  );
};