type EncodedSymbolOverlayProps = { progress: number };

export const EncodedSymbolOverlay = ({ progress }: EncodedSymbolOverlayProps) => {
  const active = progress >= 0.66;
  return (
    <div className={`encoded-overlay ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="encoded-formula encoded-formula-attention">Attention(Q,K,V) = softmax(QKᵀ / √dₖ)V</div>
      <div className="encoded-formula encoded-formula-sigma">σ(x) = 1 / (1 + e⁻ˣ)</div>
      <div className="encoded-formula encoded-formula-loss">L = −Σ yᵢ log(pᵢ)</div>
      <svg className="encoded-network" viewBox="0 0 180 118" role="presentation">
        <g className="network-lines">
          {[25, 59, 93].flatMap((y1) => [36, 82].map((y2) => <line key={`${y1}-${y2}`} x1="24" y1={y1} x2="90" y2={y2} />))}
          {[36, 82].flatMap((y1) => [25, 59, 93].map((y2) => <line key={`${y1}-${y2}`} x1="90" y1={y1} x2="156" y2={y2} />))}
        </g>
        <g className="network-nodes">{[[24,25],[24,59],[24,93],[90,36],[90,82],[156,25],[156,59],[156,93]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}</g>
      </svg>
      <div className="encoded-alchemy">
        <span title="Sole">☉</span><span title="Luna">☾</span><span title="Mercurio">☿</span>
        <span title="Fuoco">△</span><span title="Aria">△̶</span><span title="Acqua">▽</span><span title="Terra">▽̶</span>
      </div>
      <div className="encoded-maxim">QUOD EST INFERIUS EST SICUT QUOD EST SUPERIUS</div>
    </div>
  );
};
