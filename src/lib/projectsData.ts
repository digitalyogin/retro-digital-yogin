export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  services: string[];
  website: string;
  description: string;
  fullDescription: string[];
  tech: string[];
  status: string;
}

export const projects: Project[] = [
  {
    id: "PRJ_001",
    slug: "hoya-vision-care",
    title: "HOYA_VISION_CARE",
    client: "Hoya Lens Italia",
    year: "2022",
    services: ["Gestionale admin - React e Firebase", "App user in Flutter per iOS e Android"],
    website: "https://www.hoyavision.com/it/",
    description: "App e gestionale per distribuzione contenuti informativi e commerciali agli ottici, gestibile in totale autonomia dallo staff Hoya.",
    fullDescription: [
      "Hoya Lens Italia, azienda leader mondiale nella produzione di lenti, ci ha affidato il compito di progettare una nuova applicazione per sostituire quella vecchia, ormai obsoleta.",
      "L'app era stata sviluppata solo per iPad e l'azienda era completamente dipendente dalla vecchia agenzia per qualsiasi tipo di modifica.",
      "Hoya aveva bisogno di una nuova app per distribuire contenuti informativi, commerciali e divulgativi agli ottici, che fosse completamente gestibile dallo staff Hoya in autonomia e semplicità.",
      "Abbiamo sviluppato una nuova app multilingua e con un nuovo backend, per renderla utilizzabile da tutti i device e permettere la gestione completa e in totale autonomia di: creazione e gestione utenti, inserimento di cataloghi e brochure, gestione di video e corsi di formazione, invio di notifiche push.",
    ],
    tech: ["React", "Firebase", "Flutter", "iOS", "Android"],
    status: "DEPLOYED",
  },
  {
    id: "PRJ_002",
    slug: "we-bold",
    title: "WE-BOLD",
    client: "WeBold",
    year: "2022",
    services: ["Webapp in React e Firebase", "App nativa in SwiftUI per iOS e Flutter per Android"],
    website: "https://we-bold.com/",
    description: "Piattaforma digitale per la formazione degli iscritti e candidatura a posizioni lavorative nel campo educativo e delle attività ludiche per bambini.",
    fullDescription: [
      "WeBold, un'azienda che propone percorsi di formazione e crescita personale, si è rivolta a noi per creare una piattaforma digitale per la formazione degli iscritti.",
      "La piattaforma consente anche di candidarsi per posizioni lavorative all'interno dei loro progetti in campo educativo e delle attività ludiche per bambini dai 3 ai 10 anni.",
      "La loro esperienza era limitata a piattaforme di terzi (business in cloud) che non si adattavano alle loro esigenze, per questo ci hanno chiesto di realizzare una piattaforma innovativa e fruibile da tutti i device.",
      "Abbiamo realizzato una webapp in React con Firebase e app native in SwiftUI per iOS e Flutter per Android, con funzionalità di formazione, gestione candidature e comunicazione interna.",
    ],
    tech: ["React", "Firebase", "SwiftUI", "Flutter", "iOS", "Android"],
    status: "DEPLOYED",
  },
  {
    id: "PRJ_003",
    slug: "app-migrant-regione-marche",
    title: "APP_MIGRANT_REGIONE_MARCHE",
    client: "Regione Marche / Luna srl",
    year: "2022",
    services: ["Flutter iOS & Android", "Web app development"],
    website: "https://www.regione.marche.it/Regione-Utile/Lavoro-e-Formazione-Professionale/Progetto-Migrant-net",
    description: "App dedicata ai migranti nelle Marche per smistare richieste e metterli in contatto con la Regione per lavoro e servizi, realizzata in tre lingue.",
    fullDescription: [
      "La startup di servizi IT Luna srl ci ha affidato il progetto di realizzazione di un'app per la Regione Marche.",
      "L'obiettivo era realizzare un'app dedicata ai migranti che vanno a vivere nelle Marche, in tre lingue (italiano, inglese e francese).",
      "L'app permette di smistare le richieste e mettere in contatto il migrante con la Regione, per trovare lavoro, parlare con un ufficio di collocamento o andare a un colloquio, evitando la fila allo sportello.",
      "L'utente dal suo profilo può controllare le news, scoprire dove fare le richieste e a quali sportelli rivolgersi. Il design era già stato realizzato da Luna e approvato dalla Regione, mentre noi ci siamo occupati della fase di sviluppo.",
    ],
    tech: ["Flutter", "iOS", "Android", "Web App"],
    status: "DEPLOYED",
  },
  {
    id: "PRJ_004",
    slug: "buonappe",
    title: "BUONAPPE",
    client: "Non Solo Pizza (progetto interno)",
    year: "2021",
    services: ["App Design e icon logo", "Sviluppo app in Flutter per iOS e Android"],
    website: "https://www.buonappe.com/",
    description: "App per gestire take away e delivery in totale autonomia, senza dipendere dai grandi player come JustEat o Deliveroo. Nata durante il COVID-19.",
    fullDescription: [
      "Durante il periodo del COVID-19 abbiamo realizzato BUONAPPE, un nostro progetto interno pensato per dare una mano ai ristoratori durante il lockdown.",
      "L'obiettivo era gestire l'attività di take away e delivery in totale autonomia e senza dipendere dai grandi player del settore come JustEat o Deliveroo.",
      "BUONAPPE fornisce strumenti di marketing diretto in-app, come notifiche push dirette ai clienti, e statistiche precise su consumi e preferenze.",
      "L'app è composta da diversi moduli attivabili dal cliente: gestione delivery, take away, prenotazioni tavoli, sale, e moduli di branding come rebranding, naming e logo design.",
    ],
    tech: ["Flutter", "iOS", "Android", "Firebase"],
    status: "DEPLOYED",
  },
  {
    id: "PRJ_005",
    slug: "fto-remotefly",
    title: "FTO_REMOTEFLY",
    client: "FTOremotefly srl",
    year: "2021",
    services: ["Web Design", "Web Development"],
    website: "https://www.ftoremotefly.com/",
    description: "Sito web nuovo e più performante per azienda specializzata in droni, produzioni multimediali, rilievi tecnici e corsi. Eliminati servizi superflui e rinnovato il brand.",
    fullDescription: [
      "FTO Remotefly, azienda che tratta droni e realizza produzioni multimediali, rilievi tecnici e corsi, è venuta da noi per un piccolo problema sul sito.",
      "Ci siamo resi conto che la gestione dell'hosting e del database era troppo costosa per le effettive necessità. Inoltre, il sito non rispecchiava la personalità del brand.",
      "Insieme abbiamo deciso di eliminare i servizi superflui, realizzare un nuovo sito e rinnovare il brand.",
      "Il risultato è un sito più performante, meno costoso e che rispecchia finalmente l'identità di FTO Remotefly.",
    ],
    tech: ["Web Design", "Web Development"],
    status: "DEPLOYED",
  },
  {
    id: "PRJ_006",
    slug: "furor-di-vino",
    title: "FUROR_DI_VINO",
    client: "Valleogra distribuzioni",
    year: "2021",
    services: ["Branding Design & Web Design", "Sviluppo custom Shopify"],
    website: "https://furordivino.com/",
    description: "Branding completo e e-commerce custom su Shopify per azienda specializzata nella vendita online di vini, distillati e liquori.",
    fullDescription: [
      "Valleogra distribuzioni, specializzata nella vendita online di vini, distillati e liquori, si è sempre affidata ad Amazon e aveva bisogno di un branding e un canale di vendita proprietario.",
      "Per questo progetto abbiamo collaborato con DAAM studio per il branding e TasteADV per la strategia di marketing.",
      "La prima fase ci ha visto impegnati nelle interviste al cliente, fondamentali per determinare le caratteristiche distintive dell'azienda.",
      "Il risultato finale: un brand completamente nuovo — Furordivino — con e-commerce custom su Shopify, pensato per valorizzare i prodotti e l'identità dell'azienda.",
    ],
    tech: ["Shopify", "Web Design", "Branding"],
    status: "DEPLOYED",
  },
];
