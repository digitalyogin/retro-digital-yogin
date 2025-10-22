import { useEffect, useRef, useState } from 'react';

const SYMBOLS = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽108OM AUM10अआइईउऊऋएऐओऔVOLONTÀRAPPRESENTAZIONEMAYAVELOILLUSIONEREALTÀ';
const KEYWORDS = ['VOLONTÀ', 'RAPPRESENTAZIONE', 'MAYA', 'VELO', 'ILLUSIONE', 'REALTÀ'];

type WordPosition = {
  word: string;
  cells: string[];
};

export const BackgroundStaticMatrix = ({ showGeometry = true }: { showGeometry?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glowingCells, setGlowingCells] = useState<Set<string>>(new Set());
  const [staticGrid, setStaticGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);

  // Helper per trovare parole chiave nella griglia
  const findWordsInGrid = (grid: string[][]): WordPosition[] => {
    const found: WordPosition[] = [];
    const rows = grid[0]?.length || 0;
    const cols = grid.length;
    
    // Scansione orizzontale riga per riga
    for (let row = 0; row < rows; row++) {
      let rowText = '';
      let cellMap: Array<{col: number}> = [];
      
      for (let col = 0; col < cols; col++) {
        const char = grid[col][row];
        if (char) {
          rowText += char;
          cellMap.push({col});
        } else {
          // Spazio vuoto = controlla parole accumulate
          checkForKeywords(rowText, cellMap, row, found);
          rowText = '';
          cellMap = [];
        }
      }
      
      // Controlla anche alla fine della riga
      checkForKeywords(rowText, cellMap, row, found);
    }
    
    return found;
  };

  const checkForKeywords = (
    text: string, 
    cellMap: Array<{col: number}>,
    row: number,
    found: WordPosition[]
  ) => {
    KEYWORDS.forEach(keyword => {
      let index = text.indexOf(keyword);
      while (index !== -1) {
        const cells = cellMap
          .slice(index, index + keyword.length)
          .map(cell => `${cell.col}-${row}`);
        
        found.push({ word: keyword, cells });
        
        // Cerca altre occorrenze della stessa parola nella riga
        index = text.indexOf(keyword, index + 1);
      }
    });
  };

  // Generare griglia statica una volta sola
  useEffect(() => {
    const initGrid = () => {
      const columns = Math.floor(window.innerWidth / 12);
      const rows = Math.floor(window.innerHeight / 14.4);
      const grid: string[][] = [];
      
      for (let i = 0; i < columns; i++) {
        grid[i] = [];
        for (let r = 0; r < rows; r++) {
          if (Math.random() < 0.5) {
            grid[i][r] = ''; // Cella vuota
          } else {
            grid[i][r] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          }
        }
      }
      
      setStaticGrid(grid);
      
      // Trova le parole chiave nella griglia
      const words = findWordsInGrid(grid);
      setWordPositions(words);
    };
    
    initGrid();
    const onResize = () => initGrid();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Ridisegnare canvas usando griglia statica
  useEffect(() => {
    const drawStatic = () => {
      const canvas = canvasRef.current;
      if (!canvas || staticGrid.length === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Sfondo nero pieno
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Testo nitido
      const fontSize = 12;
      const stepY = Math.floor(fontSize * 1.2);
      ctx.font = `600 ${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      // Renderizzare da griglia statica
      for (let i = 0; i < staticGrid.length; i++) {
        const x = Math.floor(i * fontSize);
        for (let r = 0; r < (staticGrid[i]?.length || 0); r++) {
          const ch = staticGrid[i][r];
          if (!ch) continue; // Salta celle vuote
          
          const y = Math.floor(r * stepY);
          const isGlowing = glowingCells.has(`${i}-${r}`);
          
          if (isGlowing) {
            // Simbolo illuminato
            ctx.fillStyle = 'rgba(0, 220, 180, 1)';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0, 220, 180, 0.6)';
          } else {
            // Simbolo normale (discreto)
            ctx.fillStyle = 'rgba(0, 180, 120, 0.4)';
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          }
          
          ctx.fillText(ch, x, y);
        }
      }
    };

    drawStatic();
  }, [glowingCells, staticGrid]);

  // Animazione simboli rivelatori
  useEffect(() => {
    if (staticGrid.length === 0) return;
    
    const interval = setInterval(() => {
      const newGlowing = new Set<string>();
      const count = Math.floor(Math.random() * 3) + 3; // 3-5 simboli o parole
      
      const columns = staticGrid.length;
      const rows = staticGrid[0]?.length || 0;
      
      for (let i = 0; i < count; i++) {
        const col = Math.floor(Math.random() * columns);
        const row = Math.floor(Math.random() * rows);
        const cellKey = `${col}-${row}`;
        
        // Controlla se questa cella fa parte di una parola chiave
        const wordMatch = wordPositions.find(wp => wp.cells.includes(cellKey));
        
        if (wordMatch) {
          // Illumina TUTTE le lettere della parola
          wordMatch.cells.forEach(cell => newGlowing.add(cell));
        } else {
          // Illumina solo questa cella
          newGlowing.add(cellKey);
        }
      }
      
      setGlowingCells(newGlowing);
    }, 2500); // Ogni 2.5 secondi
    
    return () => clearInterval(interval);
  }, [staticGrid, wordPositions]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Logo Digital Yogin con animazioni mistiche */}
      {showGeometry && (
        <div 
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
        >
          <svg 
            width="50vmin" 
            height="50vmin" 
            viewBox="0 0 200 200" 
            aria-hidden="true"
            className="animate-sacred-pulse"
          >
            {/* Plettro VIOLA (sinistra) */}
            <g className="animate-glow-purple">
              <path
                d="M 40 100 Q 40 40, 100 20 Q 80 50, 80 100 Q 80 150, 100 180 Q 40 160, 40 100 Z"
                fill="none"
                stroke="hsl(250, 80%, 60%)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            
            {/* Plettro ORO (destra) */}
            <g className="animate-glow-gold">
              <path
                d="M 160 100 Q 160 40, 100 20 Q 120 50, 120 100 Q 120 150, 100 180 Q 160 160, 160 100 Z"
                fill="none"
                stroke="hsl(40, 95%, 60%)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            
            {/* Rombo centrale (sottile) */}
            <path
              d="M 100 40 L 140 100 L 100 160 L 60 100 Z"
              fill="none"
              stroke="hsl(200, 40%, 50%)"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default BackgroundStaticMatrix;
