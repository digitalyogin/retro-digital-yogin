import { useState, useEffect, useRef } from 'react';

const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setSmoothPosition(prev => ({
        x: lerp(prev.x, targetPosition.current.x, 0.15),
        y: lerp(prev.y, targetPosition.current.y, 0.15)
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return smoothPosition;
};
