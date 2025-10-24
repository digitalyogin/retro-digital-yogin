import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Wifi } from 'lucide-react';

const SACRED_SYMBOLS = "ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽अआइईउऊऋएऐओऔ".split('');
const KEYWORDS = [
  'VOLONTÀ',
  'RAPPRESENTAZIONE', 
  'MAYA',
  'VELO',
  'ILLUSIONE',
  'REALTÀ'
];

const getAlertType = (word: string): string => {
  const alertMap: Record<string, string> = {
    'MAYA': 'PHILOSOPHICAL_BREACH',
    'VOLONTÀ': 'CONSCIOUSNESS_SHIFT',
    'ILLUSIONE': 'REALITY_DISTORTION',
    'VELO': 'PERCEPTION_ANOMALY',
    'RAPPRESENTAZIONE': 'MATRIX_FLUCTUATION',
    'REALTÀ': 'PARADIGM_SHIFT'
  };
  return alertMap[word] || 'SYSTEM_ANOMALY';
};

interface Alert {
  word: string;
  alertType: string;
  timestamp: string;
  phase: 'typing' | 'complete';
}

export const SystemStats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);
  const [network, setNetwork] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentTyping, setCurrentTyping] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 30);
      setMemory(Math.floor(Math.random() * 30) + 50);
      setNetwork(Math.floor(Math.random() * 50) + 30);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Spawn alerts periodicamente
  useEffect(() => {
    if (!isOpen) return;

    const spawnAlert = () => {
      const selectedWord = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
      let displayWord = selectedWord;
      
      // Mix con sacred symbols (30% chance)
      if (Math.random() < 0.3) {
        const symbol = SACRED_SYMBOLS[Math.floor(Math.random() * SACRED_SYMBOLS.length)];
        displayWord = symbol + ' ' + selectedWord + ' ' + symbol;
      }

      const newAlert: Alert = {
        word: displayWord,
        alertType: getAlertType(selectedWord),
        timestamp: new Date().toLocaleTimeString('it-IT', { hour12: false }),
        phase: 'typing'
      };

      setAlerts(prev => [...prev, newAlert].slice(-5)); // Mantieni max 5 alert
      
      // Typing effect
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= displayWord.length) {
          setCurrentTyping(displayWord.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setAlerts(prev => prev.map(a => 
            a.timestamp === newAlert.timestamp ? { ...a, phase: 'complete' } : a
          ));
          setCurrentTyping('');
        }
      }, 50);
    };

    const interval = setInterval(spawnAlert, 8000); // Ogni 8 secondi
    spawnAlert(); // Primo alert immediato

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <>
      {/* Pulsante per aprire */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 z-50 px-3 py-2 border-2 border-primary bg-card/95 backdrop-blur-sm hover:bg-primary/10 transition-all font-mono text-xs text-primary"
        >
          [SYSTEM_MONITOR]
        </button>
      )}

      {/* Finestra System Monitor */}
      {isOpen && (
        <div className="fixed top-4 right-4 z-50 font-mono">
          <div className={`border-2 border-primary bg-card/95 backdrop-blur-sm transition-all duration-300 ${
            isMinimized ? 'w-12 h-12' : 'w-80'
          }`}>
            {/* Header */}
            <div 
              className="border-b border-primary p-2 flex items-center justify-between hover:bg-primary/10"
            >
              <span className="text-xs text-primary">SYSTEM_MONITOR</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  {isMinimized ? '[+]' : '[-]'}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-red-500 hover:text-red-400"
                >
                  [X]
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
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

                {/* System Alerts Section */}
                <div className="pt-2 border-t border-primary/30">
                  <div className="text-xs text-primary mb-2">$ ./sacred_monitor.sh</div>
                  <div className="space-y-2 text-[10px]">
                    {alerts.map((alert, idx) => (
                      <div key={idx} className="space-y-1 border-l-2 border-primary/30 pl-2">
                        <div className="text-muted-foreground">[{alert.timestamp}] ALERT_DETECTED</div>
                        <div className="text-accent">[TYPE]: {alert.alertType}</div>
                        <div className="font-bold text-primary">
                          {alert.phase === 'complete' ? (
                            <span className="animate-pulse">{'>>> ' + alert.word}</span>
                          ) : (
                            idx === alerts.length - 1 && (
                              <span>{'>>> ' + currentTyping}<span className="animate-pulse">▊</span></span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
