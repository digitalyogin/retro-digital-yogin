import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Wifi } from 'lucide-react';

export const SystemStats = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);
  const [network, setNetwork] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 30);
      setMemory(Math.floor(Math.random() * 30) + 50);
      setNetwork(Math.floor(Math.random() * 50) + 30);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 font-mono">
      <div className={`border-2 border-primary bg-card/95 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-64'
      }`}>
        {/* Header */}
        <div 
          className="border-b border-primary p-2 flex items-center justify-between cursor-pointer hover:bg-primary/10"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <span className="text-xs text-primary">SYSTEM_MONITOR</span>
          <span className="text-xs text-muted-foreground">{isMinimized ? '[+]' : '[-]'}</span>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-3 space-y-3">
            {/* CPU */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Cpu size={12} className="text-primary" />
                  <span className="text-foreground">CPU</span>
                </div>
                <span className="text-primary">{cpu}%</span>
              </div>
              <div className="h-1 bg-muted relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                  style={{ width: `${cpu}%` }}
                />
              </div>
            </div>

            {/* Memory */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <HardDrive size={12} className="text-accent" />
                  <span className="text-foreground">MEM</span>
                </div>
                <span className="text-accent">{memory}%</span>
              </div>
              <div className="h-1 bg-muted relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-accent transition-all duration-500"
                  style={{ width: `${memory}%` }}
                />
              </div>
            </div>

            {/* Network */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Wifi size={12} className="text-secondary" />
                  <span className="text-foreground">NET</span>
                </div>
                <span className="text-secondary">{network}%</span>
              </div>
              <div className="h-1 bg-muted relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-secondary transition-all duration-500"
                  style={{ width: `${network}%` }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="pt-2 border-t border-primary/30 text-xs">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-primary animate-pulse" />
                <span className="text-muted-foreground">STATUS: ONLINE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
