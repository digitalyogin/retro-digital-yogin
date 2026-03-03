interface OnboardingTourProps {
  open: boolean;
  onSkip: () => void;
  onComplete: () => void;
  step: number;
  onNext: () => void;
}

const STEPS = [
  {
    title: "Navigazione Rapida",
    body: "Puoi muoverti usando i codici in basso: ad esempio [01] per Quick Scan e [08] per Blog.",
  },
  {
    title: "Due Modalita",
    body: "Apri il Command Center: modalita GUIDATA per azioni veloci, modalita TERMINALE per comandi testuali.",
  },
  {
    title: "Personalizza Esperienza",
    body: "In Settings [09] puoi gestire animazioni, suoni e livello guida per adattare il portale al tuo stile.",
  },
];

export const OnboardingTour = ({ open, onSkip, onComplete, step, onNext }: OnboardingTourProps) => {
  if (!open) return null;

  const current = STEPS[step] ?? STEPS[0];
  const isLast = step >= STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[220] bg-background/85 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <div className="w-full max-w-2xl border-2 border-primary bg-card p-6 space-y-4 font-terminal">
        <p className="text-xs text-primary">GUIDA INIZIALE [{step + 1}/{STEPS.length}]</p>
        <h2 className="text-2xl text-primary text-glow">{current.title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{current.body}</p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
          <button
            onClick={onSkip}
            className="px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Salta guida
          </button>
          <button
            onClick={isLast ? onComplete : onNext}
            className="px-4 py-2 border border-primary bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
          >
            {isLast ? "Completa" : "Avanti"}
          </button>
        </div>
      </div>
    </div>
  );
};
