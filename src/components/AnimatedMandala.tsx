export const AnimatedMandala = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
      >
        <defs>
          {/* Subtle glow filter */}
          <filter id="sacred-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cerchi concentrici sottili */}
        {[100, 140, 180].map((r, i) => (
          <circle
            key={`circle-${i}`}
            cx="250"
            cy="250"
            r={r}
            fill="none"
            stroke="hsl(30, 70%, 35%)"
            strokeWidth="1"
            opacity="0.4"
            filter="url(#sacred-glow)"
            className="animate-draw-circle"
            style={{
              strokeDasharray: `${2 * Math.PI * r}`,
              strokeDashoffset: `${2 * Math.PI * r}`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}

        {/* Geometria pentagonale complessa */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180 - Math.PI / 2;
          const x1 = 250 + Math.cos(angle) * 120;
          const y1 = 250 + Math.sin(angle) * 120;
          const x2 = 250 + Math.cos(angle + (72 * 2 * Math.PI) / 180) * 120;
          const y2 = 250 + Math.sin(angle + (72 * 2 * Math.PI) / 180) * 120;
          
          return (
            <line
              key={`penta-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(30, 80%, 40%)"
              strokeWidth="1.5"
              opacity="0.6"
              filter="url(#sacred-glow)"
              className="animate-draw-line"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            />
          );
        })}

        {/* Linee intrecciate centrali */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180 - Math.PI / 2;
          const x1 = 250 + Math.cos(angle) * 50;
          const y1 = 250 + Math.sin(angle) * 50;
          const x2 = 250 + Math.cos(angle + (72 * 2 * Math.PI) / 180) * 120;
          const y2 = 250 + Math.sin(angle + (72 * 2 * Math.PI) / 180) * 120;
          
          return (
            <line
              key={`cross-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(35, 70%, 45%)"
              strokeWidth="1"
              opacity="0.5"
              filter="url(#sacred-glow)"
              className="animate-draw-line"
              style={{ animationDelay: `${0.8 + i * 0.1}s` }}
            />
          );
        })}

        {/* Triangoli interni sottili */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180 - Math.PI / 2;
          const x = 250 + Math.cos(angle) * 80;
          const y = 250 + Math.sin(angle) * 80;
          const nextAngle = ((i + 1) * 72 * Math.PI) / 180 - Math.PI / 2;
          const nextX = 250 + Math.cos(nextAngle) * 80;
          const nextY = 250 + Math.sin(nextAngle) * 80;
          
          return (
            <path
              key={`triangle-${i}`}
              d={`M250,250 L${x},${y} L${nextX},${nextY} Z`}
              fill="hsl(30, 60%, 30%)"
              fillOpacity="0.1"
              stroke="hsl(35, 70%, 40%)"
              strokeWidth="1"
              opacity="0.5"
              filter="url(#sacred-glow)"
              className="animate-draw-path"
              style={{ animationDelay: `${1.5 + i * 0.2}s` }}
            />
          );
        })}

        {/* Cerchio centrale */}
        <circle
          cx="250"
          cy="250"
          r="30"
          fill="none"
          stroke="hsl(30, 70%, 40%)"
          strokeWidth="1.5"
          opacity="0.6"
          filter="url(#sacred-glow)"
          className="animate-draw-circle"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Nodi sottili sui vertici del pentagono */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 * Math.PI) / 180 - Math.PI / 2;
          const x = 250 + Math.cos(angle) * 120;
          const y = 250 + Math.sin(angle) * 120;
          
          return (
            <circle
              key={`node-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="hsl(35, 70%, 50%)"
              opacity="0.7"
              filter="url(#sacred-glow)"
              className="animate-node-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
};
