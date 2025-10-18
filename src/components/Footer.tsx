export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t-2 border-primary relative z-10 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-3xl font-bold text-primary text-glow mb-4">
              DIGITAL_YOGIN
            </div>
            <p className="text-sm text-muted-foreground">
              Agenzia digitale specializzata in sviluppo web e mobile applications
            </p>
          </div>

          {/* Location Info */}
          <div>
            <h3 className="text-primary text-sm mb-3 border-b border-primary/30 pb-2">LOCATION_DATA</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="text-primary">{'>'}</span> SEDE: Padova, Italia
              </p>
              <p>
                <span className="text-primary">{'>'}</span> TIMEZONE: CET (UTC+1)
              </p>
              <p>
                <span className="text-primary">{'>'}</span> COLLABORATORI: Worldwide
              </p>
            </div>
          </div>

          {/* System Status */}
          <div>
            <h3 className="text-primary text-sm mb-3 border-b border-primary/30 pb-2">SYSTEM_STATUS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API_SERVER:</span>
                <span className="text-primary">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">RESPONSE_TIME:</span>
                <span className="text-primary">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">UPTIME:</span>
                <span className="text-primary">99.9%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="pt-6 border-t-2 border-primary">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} DIGITAL YOGIN :: ALL_RIGHTS_RESERVED</p>
            <p className="flex items-center gap-2">
              <span className="animate-pulse text-primary">▓</span> 
              SYSTEM_STATUS: OPERATIONAL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
