import { useEffect, useRef, useState } from 'react';

const SYMBOLS = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽108OM AUM10अआइईउऊऋएऐओऔVOLONTÀRAPPRESENTAZIONEMAYAVELOILLUSIONEREALTÀ';
const KEYWORDS = ['VOLONTÀ', 'RAPPRESENTAZIONE', 'MAYA', 'VELO', 'ILLUSIONE', 'REALTÀ'];
const SACRED_SYMBOLS = 'ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽अआइईउऊऋएऐओऔ'.split('');

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
      
      // Inizializza griglia con simboli casuali
      for (let i = 0; i < columns; i++) {
        grid[i] = [];
        for (let r = 0; r < rows; r++) {
          const rand = Math.random();
          if (rand < 0.3) {
            grid[i][r] = ''; // Cella vuota
          } else if (rand < 0.5) {
            // Aumenta probabilità simboli sacri
            grid[i][r] = SACRED_SYMBOLS[Math.floor(Math.random() * SACRED_SYMBOLS.length)];
          } else {
            grid[i][r] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          }
        }
      }
      
      // Inserisci forzatamente le parole chiave in posizioni casuali
      KEYWORDS.forEach(keyword => {
        const attempts = Math.floor(Math.random() * 2) + 1; // 1-2 occorrenze per parola
        for (let attempt = 0; attempt < attempts; attempt++) {
          const startCol = Math.floor(Math.random() * (columns - keyword.length));
          const row = Math.floor(Math.random() * rows);
          
          // Inserisci la parola orizzontalmente
          for (let i = 0; i < keyword.length; i++) {
            grid[startCol + i][row] = keyword[i];
          }
        }
      });
      
      setStaticGrid(grid);
      
      // Trova le parole chiave nella griglia
      const words = findWordsInGrid(grid);
      setWordPositions(words);
      
      console.log('Parole trovate nella griglia:', words);
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
      const count = Math.floor(Math.random() * 5) + 5; // 5-10 simboli o parole
      
      const columns = staticGrid.length;
      const rows = staticGrid[0]?.length || 0;
      
      for (let i = 0; i < count; i++) {
        const col = Math.floor(Math.random() * columns);
        const row = Math.floor(Math.random() * rows);
        const cellKey = `${col}-${row}`;
        const char = staticGrid[col]?.[row];
        
        // PRIORITÀ 1: Simbolo sacro → illumina sempre individualmente
        if (char && SACRED_SYMBOLS.includes(char)) {
          newGlowing.add(cellKey);
          continue;
        }
        
        // PRIORITÀ 2: Parte di una parola chiave → illumina tutta la parola
        const wordMatch = wordPositions.find(wp => wp.cells.includes(cellKey));
        if (wordMatch) {
          wordMatch.cells.forEach(cell => newGlowing.add(cell));
          continue;
        }
        
        // PRIORITÀ 3: Carattere normale → illumina solo questo
        if (char) {
          newGlowing.add(cellKey);
        }
      }
      
      setGlowingCells(newGlowing);
    }, 1800); // Ogni 1.8 secondi (più frequente)
    
    return () => clearInterval(interval);
  }, [staticGrid, wordPositions]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Mandala con Om Centrale */}
      {showGeometry && (
        <div 
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
        >
          <svg 
            width="60vmin" 
            height="60vmin" 
            viewBox="0 0 200 200"
            className="animate-sacred-pulse"
            style={{
              filter: 'drop-shadow(0 0 20px hsla(45, 100%, 50%, 0.3))'
            }}
          >
            {/* Cerchio esterno */}
            <circle 
              cx="100" 
              cy="100" 
              r="80" 
              fill="none" 
              stroke="hsl(45 100% 50%)" 
              strokeWidth="0.6" 
              strokeOpacity="0.4" 
            />
            
            {/* Cerchio medio */}
            <circle 
              cx="100" 
              cy="100" 
              r="55" 
              fill="none" 
              stroke="hsl(280 80% 60%)" 
              strokeWidth="0.5" 
              strokeOpacity="0.35" 
            />
            
            {/* Cerchio interno */}
            <circle 
              cx="100" 
              cy="100" 
              r="30" 
              fill="none" 
              stroke="hsl(180 70% 50%)" 
              strokeWidth="0.4" 
              strokeOpacity="0.3" 
            />
            
            {/* Linee radianti (8 direzioni) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <line
                key={angle}
                x1="100"
                y1="100"
                x2={100 + 80 * Math.cos((angle * Math.PI) / 180)}
                y2={100 + 80 * Math.sin((angle * Math.PI) / 180)}
                stroke="hsl(45 100% 50%)"
                strokeWidth="0.3"
                strokeOpacity="0.25"
              />
            ))}
            
            {/* Simbolo Om centrale */}
            <text 
              x="100" 
              y="115" 
              textAnchor="middle" 
              fontSize="40" 
              fill="hsl(45 100% 50%)" 
              fillOpacity="0.5"
              fontFamily="serif"
              className="animate-glow-gold"
            >
              ॐ
            </text>
          </svg>
        </div>
      )}
    </>
  );
};

export default BackgroundStaticMatrix;
