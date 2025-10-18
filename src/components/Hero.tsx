import { useEffect, useState } from "react";

export const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "DIGITAL YOGIN";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 150);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 text-sm md:text-base text-secondary">
          <span className="animate-pulse">▓</span> SYSTEM_BOOT.EXE
        </div>
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 text-glow">
          {displayText}
          <span className="animate-pulse">_</span>
        </h1>
        
        <div className="border-2 border-primary p-6 md:p-8 border-glow mb-8 bg-card">
          <p className="text-xl md:text-3xl mb-4 text-primary">
            {'>'} L'<span className="text-accent">immaginazione</span> è più importante della <span className="text-secondary">conoscenza</span>
          </p>
          <p className="text-lg md:text-2xl text-muted-foreground">
            // il tuo team per il digitale
          </p>
        </div>
        
        <div className="space-y-4 text-base md:text-xl text-left max-w-2xl mx-auto border border-primary/30 p-6 bg-muted/30">
          <p className="flex items-start gap-2">
            <span className="text-accent flex-shrink-0">{'>'}</span>
            <span>Sviluppo app, web e strategie di marketing uniche e innovative per il tuo business</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-secondary flex-shrink-0">{'>'}</span>
            <span>Siamo un team multidisciplinare di nerd specializzati in sviluppo web e app e in tutte le sfaccettature del mondo digitale e del marketing.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary flex-shrink-0">{'>'}</span>
            <span>La nostra sede è a Padova, ma i nostri collaboratori si trovano in tutto il mondo.</span>
          </p>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground animate-pulse">
          <span>▼ SCROLL_DOWN</span>
        </div>
      </div>
    </section>
  );
};
