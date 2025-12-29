import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Minimize2, Maximize2, X, Cpu, HardDrive, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  playKeyBeep, 
  playSuccessSound, 
  playErrorSound, 
  playBootSound,
  playLightcycleSound,
  playGlitchSound,
  playArcadeSound,
  playHackerSound,
  playCRTSound,
} from '@/lib/terminalSounds';
import {
  DIGITAL_YOGIN_LOGO,
  LIGHTCYCLE_FRAMES,
  BOOT_SEQUENCE,
  MCP_QUOTES,
  FLYNN_QUOTES,
  TRON_QUOTES,
  generateGlitchText,
  SCAN_ANIMATION,
  SNAKE_GAME_FRAMES,
  PONG_GAME_FRAMES,
  generateMatrixLine,
  HACKER_HEADER,
  ERROR_ALERTS,
} from '@/lib/asciiArt';

interface LogEntry {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'ascii';
}

type TerminalMode = 
  | 'normal' 
  | 'login_email' 
  | 'login_password' 
  | 'register_email' 
  | 'register_password' 
  | 'register_confirm';

const SACRED_SYMBOLS = "ॐΩψφθλπ∞∆Σ☿♀⊕♂♃♄⛢☉☽अआइईउऊऋएऐओऔ".split('');
const KEYWORDS = ['VOLONTÀ', 'RAPPRESENTAZIONE', 'MAYA', 'VELO', 'ILLUSIONE', 'REALTÀ'];

export const TerminalConsole = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mode, setMode] = useState<TerminalMode>('normal');
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [typingQueue, setTypingQueue] = useState<LogEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [hackerMode, setHackerMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'default' | 'tron' | 'matrix' | 'cyberpunk'>('default');
  
  // System stats
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);
  const [network, setNetwork] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const bootCompleted = useRef(false);

  // System stats updater
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 30);
      setMemory(Math.floor(Math.random() * 30) + 50);
      setNetwork(Math.floor(Math.random() * 50) + 30);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Typing effect processor
  const typeText = useCallback((text: string, onComplete: () => void) => {
    let index = 0;
    const chars: string[] = [];
    
    const typeChar = () => {
      if (index < text.length) {
        chars.push(text[index]);
        if (soundEnabled && Math.random() < 0.3) playKeyBeep();
        index++;
        setLogs(prev => {
          const newLogs = [...prev];
          if (newLogs.length > 0) {
            newLogs[newLogs.length - 1] = { ...newLogs[newLogs.length - 1], text: chars.join('') };
          }
          return newLogs;
        });
        setTimeout(typeChar, 15 + Math.random() * 25);
      } else {
        onComplete();
      }
    };
    
    setLogs(prev => [...prev, { text: '', type: 'output' }]);
    typeChar();
  }, [soundEnabled]);

  // Add log with optional typing effect
  const addLog = useCallback((entry: LogEntry, withTyping = false) => {
    if (withTyping && entry.type !== 'input') {
      setTypingQueue(prev => [...prev, entry]);
    } else {
      setLogs(prev => [...prev, entry]);
    }
  }, []);

  // Process typing queue
  useEffect(() => {
    if (typingQueue.length > 0 && !isTyping) {
      setIsTyping(true);
      const entry = typingQueue[0];
      typeText(entry.text, () => {
        setTypingQueue(prev => prev.slice(1));
        setIsTyping(false);
      });
    }
  }, [typingQueue, isTyping, typeText]);

  // Boot sequence
  useEffect(() => {
    if (isOpen && !bootCompleted.current) {
      bootCompleted.current = true;
      if (soundEnabled) playBootSound();
      
      let i = 0;
      const bootInterval = setInterval(() => {
        if (i < BOOT_SEQUENCE.length) {
          setLogs(prev => [...prev, { text: BOOT_SEQUENCE[i], type: i < 4 ? 'ascii' : 'success' }]);
          i++;
        } else {
          clearInterval(bootInterval);
          setIsBooting(false);
          setLogs(prev => [...prev, 
            { text: '', type: 'output' },
            { text: 'Digita "help" per la lista dei comandi disponibili', type: 'output' }
          ]);
        }
      }, 100);
      
      return () => clearInterval(bootInterval);
    }
  }, [isOpen, soundEnabled]);

  // Sacred alerts now only appear on errors (removed periodic alerts)

  const getPromptText = () => {
    switch (mode) {
      case 'login_email': return 'EMAIL >';
      case 'login_password': return 'PASSWORD >';
      case 'register_email': return 'EMAIL >';
      case 'register_password': return 'PASSWORD >';
      case 'register_confirm': return 'CONFERMA >';
      default: return '>';
    }
  };

  const handleAuthInput = async (value: string) => {
    switch (mode) {
      case 'login_email':
        setAuthData({ ...authData, email: value });
        addLog({ text: `EMAIL > ${value}`, type: 'input' });
        addLog({ text: 'Inserisci la tua chiave di accesso:', type: 'output' }, true);
        setMode('login_password');
        break;
        
      case 'login_password':
        addLog({ text: 'PASSWORD > ********', type: 'input' });
        addLog({ text: '[VERIFICA IN CORSO...]', type: 'output' }, true);
        
        const { error: loginError } = await signIn(authData.email, value);
        
        if (loginError) {
          if (soundEnabled) playErrorSound();
          addLog({ text: `[ERRORE] ${loginError.message}`, type: 'error' });
          addLog({ text: 'Accesso negato. Riprova con "login"', type: 'error' });
        } else {
          if (soundEnabled) playSuccessSound();
          addLog({ text: '[ACCESSO GARANTITO]', type: 'success' });
          addLog({ text: `Benvenuto nel Portale, ${authData.email}`, type: 'success' });
          addLog({ text: TRON_QUOTES[Math.floor(Math.random() * TRON_QUOTES.length)], type: 'output' });
        }
        setAuthData({ email: '', password: '' });
        setMode('normal');
        break;
        
      case 'register_email':
        setAuthData({ ...authData, email: value });
        addLog({ text: `EMAIL > ${value}`, type: 'input' });
        addLog({ text: 'Crea la tua chiave di accesso:', type: 'output' }, true);
        setMode('register_password');
        break;
        
      case 'register_password':
        setAuthData({ ...authData, password: value });
        addLog({ text: 'PASSWORD > ********', type: 'input' });
        addLog({ text: 'Conferma la chiave di accesso:', type: 'output' }, true);
        setMode('register_confirm');
        break;
        
      case 'register_confirm':
        if (value !== authData.password) {
          if (soundEnabled) playErrorSound();
          addLog({ text: '[ERRORE] Le chiavi non corrispondono!', type: 'error' });
          setAuthData({ email: '', password: '' });
          setMode('normal');
          return;
        }
        
        addLog({ text: 'CONFERMA > ********', type: 'input' });
        addLog({ text: '[CREAZIONE UTENTE IN CORSO...]', type: 'output' }, true);
        
        const { error: signUpError } = await signUp(authData.email, authData.password);
        
        if (signUpError) {
          if (soundEnabled) playErrorSound();
          addLog({ text: `[ERRORE] ${signUpError.message}`, type: 'error' });
        } else {
          if (soundEnabled) playSuccessSound();
          addLog({ text: '[REGISTRAZIONE COMPLETATA]', type: 'success' });
          addLog({ text: 'Sei ora parte del Portale, Program.', type: 'success' });
          addLog({ text: FLYNN_QUOTES[0], type: 'output' });
        }
        setAuthData({ email: '', password: '' });
        setMode('normal');
        break;
    }
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (mode !== 'normal') {
      await handleAuthInput(cmd);
      return;
    }
    
    addLog({ text: `> ${cmd}`, type: 'input' });

    if (trimmedCmd === 'clear') {
      setLogs([]);
      return;
    }

    const commands: Record<string, () => void> = {
      help: () => {
        const helpText = [
          '╔════════════════════════════════════╗',
          '║       COMANDI DISPONIBILI          ║',
          '╠════════════════════════════════════╣',
          '║ help       - Questa guida          ║',
          '║ login      - Accedi al Portale     ║',
          '║ register   - Unisciti al sistema   ║',
          '║ logout     - Disconnetti           ║',
          '║ whoami     - Chi sei, Program?     ║',
          '║ status     - Stato del sistema     ║',
          '║ scan       - Apri Digital Oracle   ║',
          '║ incentivi  - Vai agli incentivi    ║',
          '║ glitch     - ??? [CLASSIFIED]      ║',
          '║ lightcycle - Corri sul Portale     ║',
          '║ arcade     - Mini-giochi TRON      ║',
          '║ crt        - Toggle effetto CRT    ║',
          '║ hack       - Modalità hacker       ║',
          '║ theme      - Cambia tema colori    ║',
          '║ mcp        - Citazione MCP         ║',
          '║ flynn      - Citazione Flynn       ║',
          '║ quote      - Citazione casuale     ║',
          '║ logo       - ASCII Art logo        ║',
          '║ sound      - Toggle audio 8-bit    ║',
          '║ clear      - Pulisci terminale     ║',
          '╚════════════════════════════════════╝',
        ];
        helpText.forEach(line => addLog({ text: line, type: 'output' }));
      },
      
      login: () => {
        if (user) {
          addLog({ text: '[GIÀ CONNESSO] Sei già nel Portale.', type: 'error' });
          return;
        }
        addLog({ text: '[PROTOCOLLO_ACCESSO INIZIALIZZATO]', type: 'success' });
        addLog({ text: 'Il Portale richiede identificazione.', type: 'output' }, true);
        addLog({ text: 'Inserisci il tuo identificatore (email):', type: 'output' });
        setMode('login_email');
      },
      
      register: () => {
        if (user) {
          addLog({ text: '[GIÀ REGISTRATO] Sei già parte del Portale.', type: 'error' });
          return;
        }
        addLog({ text: '[CREAZIONE NUOVO UTENTE]', type: 'success' });
        addLog({ text: 'Benvenuto, nuovo Program.', type: 'output' }, true);
        addLog({ text: 'Inserisci il tuo identificatore (email):', type: 'output' });
        setMode('register_email');
      },
      
      logout: async () => {
        if (!user) {
          addLog({ text: '[ERRORE] Non sei connesso al Portale.', type: 'error' });
          return;
        }
        addLog({ text: '[DISCONNESSIONE IN CORSO...]', type: 'output' });
        await signOut();
        if (soundEnabled) playSuccessSound();
        addLog({ text: MCP_QUOTES[0], type: 'success' });
        addLog({ text: '[SESSIONE TERMINATA]', type: 'success' });
      },
      
      whoami: () => {
        if (user) {
          addLog({ text: `[UTENTE IDENTIFICATO]`, type: 'success' });
          addLog({ text: `ID: ${user.email}`, type: 'output' });
          addLog({ text: `STATUS: PROGRAM ATTIVO`, type: 'output' });
        } else {
          addLog({ text: '[GUEST_USER]', type: 'output' });
          addLog({ text: 'Non identificato. Usa "login" o "register".', type: 'output' });
        }
      },
      
      status: () => {
        addLog({ text: '╔═══════ SYSTEM STATUS ═══════╗', type: 'success' });
        addLog({ text: `║ CPU:    [${cpu}%] ${'█'.repeat(Math.floor(cpu/5))}${'░'.repeat(20-Math.floor(cpu/5))}`, type: 'output' });
        addLog({ text: `║ MEMORY: [${memory}%] ${'█'.repeat(Math.floor(memory/5))}${'░'.repeat(20-Math.floor(memory/5))}`, type: 'output' });
        addLog({ text: `║ NETWORK:[${network}%] ${'█'.repeat(Math.floor(network/5))}${'░'.repeat(20-Math.floor(network/5))}`, type: 'output' });
        addLog({ text: '║ GRID:   [ONLINE]            ║', type: 'success' });
        addLog({ text: '╚═════════════════════════════╝', type: 'success' });
      },
      
      scan: () => {
        addLog({ text: '[INIZIALIZZAZIONE DIGITAL ORACLE...]', type: 'success' });
        SCAN_ANIMATION.forEach((frame, i) => {
          setTimeout(() => {
            setLogs(prev => {
              const newLogs = [...prev];
              if (newLogs[newLogs.length - 1]?.text.startsWith('[')) {
                newLogs[newLogs.length - 1] = { text: frame, type: 'output' };
              } else {
                newLogs.push({ text: frame, type: 'output' });
              }
              return newLogs;
            });
          }, i * 200);
        });
        setTimeout(() => {
          addLog({ text: '[ORACLE PRONTO] Scroll to Oracle Widget...', type: 'success' });
          document.getElementById('oracle-section')?.scrollIntoView({ behavior: 'smooth' });
        }, SCAN_ANIMATION.length * 200);
      },
      
      incentivi: () => {
        addLog({ text: '[NAVIGAZIONE] Reindirizzamento a /incentivi...', type: 'success' });
        setTimeout(() => navigate('/incentivi'), 500);
      },
      
      glitch: () => {
        if (soundEnabled) playGlitchSound();
        const glitchedLogs: LogEntry[] = [];
        for (let i = 0; i < 5; i++) {
          glitchedLogs.push({ text: generateGlitchText('MATRIX_DISTORTION_DETECTED'), type: 'error' });
        }
        glitchedLogs.forEach((log, i) => {
          setTimeout(() => {
            addLog(log);
          }, i * 100);
        });
        setTimeout(() => {
          addLog({ text: '[REALTÀ STABILIZZATA]', type: 'success' });
        }, 600);
        
        // Apply glitch effect to page
        document.body.classList.add('glitch-effect');
        setTimeout(() => document.body.classList.remove('glitch-effect'), 500);
      },
      
      lightcycle: () => {
        if (soundEnabled) playLightcycleSound();
        addLog({ text: '[LIGHTCYCLE ATTIVATA]', type: 'success' });
        let frameIndex = 0;
        const animInterval = setInterval(() => {
          if (frameIndex < LIGHTCYCLE_FRAMES.length * 3) {
            const frame = LIGHTCYCLE_FRAMES[frameIndex % LIGHTCYCLE_FRAMES.length];
            setLogs(prev => {
              const newLogs = [...prev];
              if (newLogs[newLogs.length - 1]?.type === 'ascii') {
                newLogs[newLogs.length - 1] = { text: frame, type: 'ascii' };
              } else {
                newLogs.push({ text: frame, type: 'ascii' });
              }
              return newLogs;
            });
            frameIndex++;
          } else {
            clearInterval(animInterval);
            addLog({ text: '"The game has changed." - CLU', type: 'output' });
          }
        }, 150);
      },
      
      mcp: () => {
        const quote = MCP_QUOTES[Math.floor(Math.random() * MCP_QUOTES.length)];
        addLog({ text: '[MASTER CONTROL PROGRAM]', type: 'error' });
        addLog({ text: quote, type: 'output' }, true);
      },
      
      flynn: () => {
        const quote = FLYNN_QUOTES[Math.floor(Math.random() * FLYNN_QUOTES.length)];
        addLog({ text: '[KEVIN FLYNN]', type: 'success' });
        addLog({ text: quote, type: 'output' }, true);
      },
      
      quote: () => {
        const allQuotes = [...TRON_QUOTES, ...MCP_QUOTES, ...FLYNN_QUOTES];
        const quote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        addLog({ text: '[CITAZIONE DAL PORTALE]', type: 'success' });
        addLog({ text: quote, type: 'output' }, true);
      },
      
      logo: () => {
        DIGITAL_YOGIN_LOGO.split('\n').forEach(line => {
          addLog({ text: line, type: 'ascii' });
        });
      },
      
      sound: () => {
        setSoundEnabled(!soundEnabled);
        addLog({ text: `[AUDIO ${!soundEnabled ? 'ATTIVATO' : 'DISATTIVATO'}]`, type: 'success' });
      },
      
      theme: () => {
        addLog({ text: '[THEME SELECTOR] Scegli un tema:', type: 'success' });
        addLog({ text: '• default   - Yogin Gold (originale)', type: currentTheme === 'default' ? 'success' : 'output' });
        addLog({ text: '• tron      - TRON Blue', type: currentTheme === 'tron' ? 'success' : 'output' });
        addLog({ text: '• matrix    - Matrix Green', type: currentTheme === 'matrix' ? 'success' : 'output' });
        addLog({ text: '• cyberpunk - Cyberpunk Pink', type: currentTheme === 'cyberpunk' ? 'success' : 'output' });
        addLog({ text: 'Digita il nome del tema per attivarlo', type: 'output' });
      },
      
      default: () => {
        if (soundEnabled) playSuccessSound();
        document.body.classList.add('theme-transitioning');
        document.documentElement.classList.remove('theme-tron', 'theme-matrix', 'theme-cyberpunk');
        setCurrentTheme('default');
        addLog({ text: '[TEMA ATTIVATO] Yogin Gold', type: 'success' });
        addLog({ text: '"La via di mezzo tra antico e moderno"', type: 'output' });
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
      },
      
      tron: () => {
        if (soundEnabled) playSuccessSound();
        document.body.classList.add('theme-transitioning');
        document.documentElement.classList.remove('theme-tron', 'theme-matrix', 'theme-cyberpunk');
        document.documentElement.classList.add('theme-tron');
        setCurrentTheme('tron');
        addLog({ text: '[TEMA ATTIVATO] TRON Blue', type: 'success' });
        addLog({ text: '"Greetings, Program." - MCP', type: 'output' });
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
      },
      
      matrix: () => {
        if (soundEnabled) playSuccessSound();
        document.body.classList.add('theme-transitioning');
        document.documentElement.classList.remove('theme-tron', 'theme-matrix', 'theme-cyberpunk');
        document.documentElement.classList.add('theme-matrix');
        setCurrentTheme('matrix');
        addLog({ text: '[TEMA ATTIVATO] Matrix Green', type: 'success' });
        addLog({ text: '"Wake up, Neo..." - Trinity', type: 'output' });
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
      },
      
      cyberpunk: () => {
        if (soundEnabled) playSuccessSound();
        document.body.classList.add('theme-transitioning');
        document.documentElement.classList.remove('theme-tron', 'theme-matrix', 'theme-cyberpunk');
        document.documentElement.classList.add('theme-cyberpunk');
        setCurrentTheme('cyberpunk');
        addLog({ text: '[TEMA ATTIVATO] Cyberpunk Pink', type: 'success' });
        addLog({ text: '"Night City non dorme mai, chooms."', type: 'output' });
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
      },
      
      arcade: () => {
        if (soundEnabled) playArcadeSound();
        addLog({ text: '[ARCADE MODE] Seleziona gioco:', type: 'success' });
        addLog({ text: '1. snake - Snake sul Portale', type: 'output' });
        addLog({ text: '2. pong  - Disc Wars', type: 'output' });
        addLog({ text: 'Digita "snake" o "pong" per iniziare', type: 'output' });
      },
      
      snake: () => {
        if (soundEnabled) playArcadeSound();
        addLog({ text: '[SNAKE GRID] Inizializzazione...', type: 'success' });
        let frameIndex = 0;
        const gameInterval = setInterval(() => {
          if (frameIndex < SNAKE_GAME_FRAMES.length) {
            SNAKE_GAME_FRAMES[frameIndex].split('\n').forEach(line => {
              addLog({ text: line, type: 'ascii' });
            });
            frameIndex++;
          } else {
            clearInterval(gameInterval);
            addLog({ text: '[GAME OVER] Punteggio salvato nel Portale', type: 'success' });
          }
        }, 1000);
      },
      
      pong: () => {
        if (soundEnabled) playArcadeSound();
        addLog({ text: '[DISC WARS] Inizializzazione...', type: 'success' });
        let frameIndex = 0;
        const gameInterval = setInterval(() => {
          if (frameIndex < PONG_GAME_FRAMES.length) {
            PONG_GAME_FRAMES[frameIndex].split('\n').forEach(line => {
              addLog({ text: line, type: 'ascii' });
            });
            frameIndex++;
          } else {
            clearInterval(gameInterval);
            addLog({ text: TRON_QUOTES[0], type: 'success' });
          }
        }, 1200);
      },
      
      crt: () => {
        if (soundEnabled) playCRTSound();
        const newState = !crtEnabled;
        setCrtEnabled(newState);
        
        if (newState) {
          document.body.classList.add('crt-mode');
          addLog({ text: '[CRT MODE ATTIVATO]', type: 'success' });
          addLog({ text: 'Scanlines e curvatura schermo abilitati', type: 'output' });
          addLog({ text: 'Benvenuto negli anni 80, Program.', type: 'output' });
        } else {
          document.body.classList.remove('crt-mode');
          addLog({ text: '[CRT MODE DISATTIVATO]', type: 'success' });
          addLog({ text: 'Display moderno ripristinato', type: 'output' });
        }
      },
      
      hack: () => {
        if (soundEnabled) playHackerSound();
        const wasHackerMode = hackerMode;
        setHackerMode(!wasHackerMode);
        
        if (!wasHackerMode) {
          document.body.classList.add('hacker-mode');
          HACKER_HEADER.split('\n').forEach(line => {
            addLog({ text: line, type: 'success' });
          });
          
          // Matrix rain effect
          let streamCount = 0;
          const matrixInterval = setInterval(() => {
            if (streamCount < 20) {
              addLog({ text: generateMatrixLine(50), type: 'output' });
              streamCount++;
            } else {
              clearInterval(matrixInterval);
              addLog({ text: '[INFILTRAZIONE COMPLETATA]', type: 'success' });
              addLog({ text: 'Accesso totale al Portale ottenuto.', type: 'output' });
              addLog({ text: '"Wake up, Neo..." - Trinity', type: 'output' });
            }
          }, 150);
        } else {
          document.body.classList.remove('hacker-mode');
          addLog({ text: '[HACKER MODE DISATTIVATO]', type: 'success' });
          addLog({ text: 'Connessione al Portale normalizzata', type: 'output' });
        }
      },
    };

    if (trimmedCmd in commands) {
      commands[trimmedCmd]();
    } else if (trimmedCmd !== '') {
      if (soundEnabled) playErrorSound();
      addLog({ text: `[ERRORE] Comando non riconosciuto: ${cmd}`, type: 'error' });
      
      // Show random error alert
      const randomAlert = ERROR_ALERTS[Math.floor(Math.random() * ERROR_ALERTS.length)];
      addLog({ text: `[${new Date().toLocaleTimeString('it-IT')}] ⚠ ${randomAlert}`, type: 'error' });
      
      addLog({ text: 'Digita "help" per la lista dei comandi', type: 'output' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || mode !== 'normal') {
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
      isMinimized ? 'w-64 h-12' : 'w-full max-w-2xl h-[28rem]'
    }`}>
      {/* Header with System Stats */}
      <div className="border-b border-primary p-2 flex items-center justify-between bg-primary/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-primary" size={16} />
            <span className="text-xs text-primary hidden sm:inline">YOGIN_TERMINAL</span>
          </div>
          {!isMinimized && (
            <div className="hidden md:flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <Cpu size={10} className="text-primary" />
                <span className="text-primary">{cpu}%</span>
              </div>
              <div className="flex items-center gap-1">
                <HardDrive size={10} className="text-accent" />
                <span className="text-accent">{memory}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi size={10} className="text-secondary" />
                <span className="text-secondary">{network}%</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user && !isMinimized && (
            <span className="text-[10px] text-accent hidden sm:inline">● {user.email?.split('@')[0]}</span>
          )}
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
                className={`whitespace-pre-wrap ${
                  log.type === 'input' ? 'text-primary' :
                  log.type === 'error' ? 'text-destructive' :
                  log.type === 'success' ? 'text-accent' :
                  log.type === 'ascii' ? 'text-primary font-bold' :
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
              <span className="text-primary text-xs">{getPromptText()}</span>
              <input
                ref={inputRef}
                type={mode.includes('password') ? 'password' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-primary text-xs outline-none placeholder-muted-foreground"
                placeholder={mode === 'normal' ? 'Digita un comando...' : ''}
                disabled={isBooting || authLoading}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
};
