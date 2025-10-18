import { useState, useEffect, useRef } from 'react';
import { Terminal, Minimize2, Maximize2, X } from 'lucide-react';

interface LogEntry {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export const TerminalConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: 'DIGITAL_YOGIN Terminal v2.4.1', type: 'success' },
    { text: 'Digita "help" per la lista dei comandi disponibili', type: 'output' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const commands = {
    help: () => [
      { text: 'Comandi disponibili:', type: 'output' as const },
      { text: '  help       - Mostra questa guida', type: 'output' as const },
      { text: '  servizi    - Mostra servizi disponibili', type: 'output' as const },
      { text: '  progetti   - Mostra progetti completati', type: 'output' as const },
      { text: '  info       - Informazioni su Digital Yogin', type: 'output' as const },
      { text: '  clear      - Pulisci il terminale', type: 'output' as const },
      { text: '  matrix     - ???', type: 'output' as const },
    ],
    servizi: () => [
      { text: '=== SERVIZI DISPONIBILI ===', type: 'success' as const },
      { text: '01. Sviluppo Web', type: 'output' as const },
      { text: '02. App Mobili', type: 'output' as const },
      { text: '03. Design UI/UX', type: 'output' as const },
      { text: '04. Consulenza Tech', type: 'output' as const },
    ],
    progetti: () => [
      { text: '=== DATABASE PROGETTI ===', type: 'success' as const },
      { text: 'Totale progetti completati: 6', type: 'output' as const },
      { text: 'In produzione: 2', type: 'output' as const },
      { text: 'Deployed: 3', type: 'output' as const },
      { text: 'In sviluppo: 1', type: 'output' as const },
    ],
    info: () => [
      { text: '=== DIGITAL YOGIN ===', type: 'success' as const },
      { text: 'Agenzia digitale specializzata in:', type: 'output' as const },
      { text: '- Sviluppo web e mobile', type: 'output' as const },
      { text: '- Design UI/UX', type: 'output' as const },
      { text: '- Consulenza tecnologica', type: 'output' as const },
      { text: '"La via di mezzo tra l\'antico e il moderno"', type: 'output' as const },
    ],
    matrix: () => [
      { text: 'Inizializzazione protocollo Matrix...', type: 'success' as const },
      { text: '01001000 01100101 01101100 01101100 01101111', type: 'output' as const },
      { text: 'Wake up, Neo...', type: 'success' as const },
    ],
    clear: () => [],
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setLogs(prev => [...prev, { text: `> ${cmd}`, type: 'input' }]);

    if (trimmedCmd === 'clear') {
      setLogs([]);
      return;
    }

    if (trimmedCmd in commands) {
      const output = commands[trimmedCmd as keyof typeof commands]();
      setLogs(prev => [...prev, ...output]);
    } else if (trimmedCmd === '') {
      return;
    } else {
      setLogs(prev => [
        ...prev,
        { text: `Comando non riconosciuto: ${cmd}`, type: 'error' },
        { text: 'Digita "help" per la lista dei comandi', type: 'output' },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 border-2 border-primary bg-card/95 backdrop-blur-sm p-3 hover:bg-primary/10 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Terminal className="text-primary" size={20} />
          <span className="text-xs text-primary font-mono hidden sm:inline">TERMINALE</span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 left-4 z-50 border-2 border-primary bg-card/95 backdrop-blur-sm font-mono transition-all duration-300 ${
      isMinimized ? 'w-64 h-12' : 'w-full max-w-2xl h-96'
    }`}>
      {/* Header */}
      <div className="border-b border-primary p-2 flex items-center justify-between bg-primary/10">
        <div className="flex items-center gap-2">
          <Terminal className="text-primary" size={16} />
          <span className="text-xs text-primary">DIGITAL_YOGIN_TERMINAL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-primary hover:bg-primary/20 p-1"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-destructive hover:bg-destructive/20 p-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <>
          <div className="h-[calc(100%-6rem)] overflow-y-auto p-4 space-y-1 text-xs">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.type === 'input' ? 'text-primary' :
                  log.type === 'error' ? 'text-destructive' :
                  log.type === 'success' ? 'text-accent' :
                  'text-muted-foreground'
                }`}
              >
                {log.text}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-primary p-2">
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-primary text-xs outline-none placeholder-muted-foreground"
                placeholder="Digita un comando..."
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};
