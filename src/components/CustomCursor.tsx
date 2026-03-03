import { useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isTextInput = target.closest('input, textarea, [contenteditable="true"]');
      const isClickable = target.closest('a, button, [role="button"]');
      
      setIsTyping(!!isTextInput);
      setIsHovering(!!isClickable && !isTextInput);
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // Nasconde il cursore custom quando si è in un campo di testo
  if (isTyping) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-2px, -2px)',
      }}
    >
      {isHovering ? (
        <div 
          className="text-4xl font-bold text-primary animate-om"
          style={{
            filter: 'drop-shadow(0 0 6px hsl(var(--primary))) drop-shadow(0 0 10px hsl(var(--primary) / 0.3))',
            textShadow: '0 0 6px hsl(var(--primary)), 0 0 12px hsl(var(--primary) / 0.3)',
          }}
        >
          ॐ
        </div>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            imageRendering: 'pixelated',
            filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.8))',
          }}
        >
          <path
            d="M0 0 L0 14 L3 11 L5 16 L7 15 L5 10 L9 10 Z"
            fill="black"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M1 1 L1 12 L3 10 L5.5 14.5 L6 14 L4 9 L8 9 Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
};