export const AnimatedMandala = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        className="animate-mandala-rotate"
      >
        <defs>
          {/* Glow filter intenso */}
          <filter id="sacred-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feComposite in="SourceGraphic" in2="blur2" operator="over" />
            <feGaussianBlur stdDeviation="12" result="blur3" />
            <feComposite in="SourceGraphic" in2="blur3" operator="over" />
          </filter>
        </defs>

        {/* Cerchi concentrici con draw animation */}
        {[80, 120, 160, 200].map((r, i) => (
          <circle
            key={`circle-${i}`}
            cx="250"
            cy="250"
            r={r}
            fill="none"
            stroke="hsl(35, 100%, 50%)"
            strokeWidth="2"
            filter="url(#sacred-glow)"
            className="animate-draw-circle"
            style={{
              strokeDasharray: `${2 * Math.PI * r}`,
              strokeDashoffset: `${2 * Math.PI * r}`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}

        {/* Linee radiali */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 250 + Math.cos(angle) * 80;
          const y1 = 250 + Math.sin(angle) * 80;
          const x2 = 250 + Math.cos(angle) * 200;
          const y2 = 250 + Math.sin(angle) * 200;
          
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(35, 100%, 50%)"
              strokeWidth="2"
              filter="url(#sacred-glow)"
              className="animate-draw-line"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            />
          );
        })}

        {/* Geometria interna - triangoli */}
        <path
          d="M250,150 L300,220 L200,220 Z"
          fill="hsl(35, 100%, 40%)"
          fillOpacity="0.2"
          stroke="hsl(35, 100%, 60%)"
          strokeWidth="2.5"
          filter="url(#sacred-glow)"
          className="animate-draw-path"
          style={{ animationDelay: '2s' }}
        />

        {/* Triangolo invertito */}
        <path
          d="M250,350 L300,280 L200,280 Z"
          fill="hsl(35, 100%, 40%)"
          fillOpacity="0.2"
          stroke="hsl(35, 100%, 60%)"
          strokeWidth="2.5"
          filter="url(#sacred-glow)"
          className="animate-draw-path"
          style={{ animationDelay: '2.5s' }}
        />

        {/* Om centrale pulsante */}
        <text
          x="250"
          y="270"
          fontSize="60"
          fontWeight="bold"
          textAnchor="middle"
          fill="hsl(45, 100%, 70%)"
          filter="url(#sacred-glow)"
          className="animate-sacred-pulse-intense"
        >
          ॐ
        </text>
        
        {/* Particle trails sui nodi */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 250 + Math.cos(angle) * 200;
          const y = 250 + Math.sin(angle) * 200;
          
          return (
            <circle
              key={`node-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="hsl(35, 100%, 70%)"
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
