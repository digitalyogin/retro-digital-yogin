export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t-2 border-primary relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <div className="text-2xl md:text-4xl font-bold text-glow mb-6">
            DIGITAL_YOGIN
          </div>
          
          <div className="text-sm md:text-base text-muted-foreground space-y-2">
            <p>
              <span className="text-primary">{'>'}</span> SEDE: Padova, Italia
            </p>
            <p>
              <span className="text-secondary">{'>'}</span> COLLABORATORI: In tutto il mondo
            </p>
          </div>
          
          <div className="pt-8 text-xs md:text-sm text-muted-foreground border-t border-primary/30 mt-8">
            <p>© {new Date().getFullYear()} DIGITAL YOGIN</p>
            <p className="mt-2">
              <span className="animate-pulse">▓</span> SYSTEM_ONLINE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
