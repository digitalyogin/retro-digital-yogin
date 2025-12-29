// ASCII Art animations for TRON-style terminal

export const DIGITAL_YOGIN_LOGO = `
██████╗ ██╗ ██████╗ ██╗████████╗ █████╗ ██╗     
██╔══██╗██║██╔════╝ ██║╚══██╔══╝██╔══██╗██║     
██║  ██║██║██║  ███╗██║   ██║   ███████║██║     
██║  ██║██║██║   ██║██║   ██║   ██╔══██║██║     
██████╔╝██║╚██████╔╝██║   ██║   ██║  ██║███████╗
╚═════╝ ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
                    ॐ                           
██╗   ██╗ ██████╗  ██████╗ ██╗███╗   ██╗        
╚██╗ ██╔╝██╔═══██╗██╔════╝ ██║████╗  ██║        
 ╚████╔╝ ██║   ██║██║  ███╗██║██╔██╗ ██║        
  ╚██╔╝  ██║   ██║██║   ██║██║██║╚██╗██║        
   ██║   ╚██████╔╝╚██████╔╝██║██║ ╚████║        
   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝        
`;

export const LIGHTCYCLE_FRAMES = [
  `
    ____
   /    \\____
  |  ॐ  |=====>
   \\____/----
`,
  `
    ____
   /    \\____
  |  ॐ  |====>
   \\____/---
`,
  `
    ____
   /    \\____
  |  ॐ  |===>
   \\____/--
`,
  `
    ____
   /    \\____
  |  ॐ  |==>
   \\____/-
`,
  `
    ____
   /    \\____
  |  ॐ  |=>
   \\____/
`,
];

export const BOOT_SEQUENCE = [
  '╔══════════════════════════════════════════╗',
  '║  DIGITAL YOGIN OPERATING SYSTEM v2.4.1   ║',
  '║  "La via di mezzo tra antico e moderno"  ║',
  '╚══════════════════════════════════════════╝',
  '',
  '[████████████████████████████████] 100%',
  '',
  'BIOS......................OK',
  'MEMORY....................OK', 
  'GRID CONNECTION............OK',
  'CONSCIOUSNESS MATRIX.......OK',
  'SACRED ALGORITHMS..........OK',
  '',
  'System ready. Welcome to the Grid, Program.',
];

export const MCP_QUOTES = [
  '"End of line." - MCP',
  '"I will take over the system." - MCP',
  '"You are to remain in the Game Grid." - MCP',
  '"In games? Are you crazy?" - MCP',
  '"No one will be able to stop the MCP." - MCP',
];

export const FLYNN_QUOTES = [
  '"The Grid. A digital frontier." - Flynn',
  '"I tried to picture clusters of information..." - Flynn',
  '"...as they move through the computer." - Flynn',
  '"What did they look like? Ships? Motorcycles?" - Flynn',
  '"Were the circuits like freeways?" - Flynn',
  '"I kept dreaming of a world I thought I\'d never see." - Flynn',
  '"And then, one day... I got in." - Flynn',
];

export const TRON_QUOTES = [
  '"I fight for the Users!" - Tron',
  '"It\'s my job to protect the Users." - Tron',
  '"Programs don\'t die, Alan." - Tron',
  '"That is a big door." - Tron',
];

export const GLITCH_CHARS = '!@#$%^&*()_+=-[]{}|;:,.<>?/~`ॐΩψφθλπ∞∆Σ';

export const generateGlitchText = (text: string): string => {
  return text.split('').map(char => {
    if (Math.random() < 0.3 && char !== ' ') {
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    return char;
  }).join('');
};

export const SCAN_ANIMATION = [
  '[▓░░░░░░░░░░░░░░░░░░░] 5%',
  '[▓▓▓░░░░░░░░░░░░░░░░░] 15%',
  '[▓▓▓▓▓░░░░░░░░░░░░░░░] 25%',
  '[▓▓▓▓▓▓▓░░░░░░░░░░░░░] 35%',
  '[▓▓▓▓▓▓▓▓▓░░░░░░░░░░░] 45%',
  '[▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░] 55%',
  '[▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░] 65%',
  '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░] 75%',
  '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░] 85%',
  '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░] 95%',
  '[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%',
];

export const OM_SYMBOL = `
      ॐ
   ╭─────╮
  │ YOGIN │
   ╰─────╯
`;
