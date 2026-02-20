import { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Euro, Building2, Users, Laptop, Rocket, Heart, Star, Bell, User, LogOut, Filter, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

interface IncentiveCard {
  id: string;
  title: string;
  description: string;
  target: string[];
  amount: string;
  deadline: string;
  link: string;
  icon: React.ReactNode;
  category: "digitalizzazione" | "impresa" | "donna" | "giovani";
}

const incentives: IncentiveCard[] = [
  {
    id: "bonus-digitalizzazione",
    title: "Bonus Digitalizzazione PMI",
    description: "Credito d'imposta per investimenti in beni strumentali tecnologicamente avanzati, software e servizi digitali. Supporta la trasformazione digitale delle PMI italiane.",
    target: ["PMI", "Microimprese", "Artigiani"],
    amount: "Fino al 40% delle spese ammissibili",
    deadline: "31 Dicembre 2025",
    link: "https://www.mise.gov.it/",
    icon: <Laptop className="w-6 h-6" />,
    category: "digitalizzazione"
  },
  {
    id: "credito-imposta-40",
    title: "Credito d'Imposta 4.0",
    description: "Incentivo per l'acquisto di beni strumentali materiali e immateriali funzionali alla trasformazione tecnologica e digitale secondo il modello Industria 4.0.",
    target: ["Tutte le imprese", "Professionisti"],
    amount: "Dal 6% al 20% a seconda del bene",
    deadline: "In vigore - verificare aggiornamenti",
    link: "https://www.mise.gov.it/",
    icon: <Building2 className="w-6 h-6" />,
    category: "digitalizzazione"
  },
  {
    id: "fondo-impresa-donna",
    title: "Fondo Impresa Donna",
    description: "Incentivi a fondo perduto e finanziamenti agevolati per sostenere la nascita e il rafforzamento dell'imprenditoria femminile in Italia.",
    target: ["Imprese femminili", "Startup al femminile", "Libere professioniste"],
    amount: "Contributi a fondo perduto fino all'80%",
    deadline: "A sportello - fino ad esaurimento fondi",
    link: "https://www.invitalia.it/cosa-facciamo/creiamo-nuove-aziende/fondo-impresa-donna",
    icon: <Heart className="w-6 h-6" />,
    category: "donna"
  },
  {
    id: "nito",
    title: "NITO - Nuove Imprese a Tasso Zero",
    description: "Finanziamenti a tasso zero per giovani under 35 e donne di qualsiasi età che vogliono avviare una micro o piccola impresa.",
    target: ["Donne", "Giovani under 35", "Nuove imprese"],
    amount: "Fino a 1,5 milioni di euro a tasso zero",
    deadline: "A sportello",
    link: "https://www.invitalia.it/cosa-facciamo/creiamo-nuove-aziende/nuove-imprese-a-tasso-zero",
    icon: <Rocket className="w-6 h-6" />,
    category: "giovani"
  },
  {
    id: "resto-al-sud",
    title: "Resto al Sud",
    description: "Incentivi per chi vuole avviare attività imprenditoriali nelle regioni del Sud Italia. Include contributo a fondo perduto e finanziamento bancario garantito.",
    target: ["Residenti al Sud", "Età 18-55 anni"],
    amount: "Fino a 200.000€ (35% a fondo perduto)",
    deadline: "A sportello",
    link: "https://www.invitalia.it/cosa-facciamo/creiamo-nuove-aziende/resto-al-sud",
    icon: <Euro className="w-6 h-6" />,
    category: "impresa"
  },
  {
    id: "smart-start",
    title: "Smart&Start Italia",
    description: "Finanziamento agevolato per startup innovative su tutto il territorio nazionale, con condizioni ancora più vantaggiose per il Sud e per team femminili.",
    target: ["Startup innovative", "Team under 35", "Imprese femminili"],
    amount: "Fino a 1,5 milioni, tasso zero",
    deadline: "A sportello",
    link: "https://www.invitalia.it/cosa-facciamo/creiamo-nuove-aziende/smartstart-italia",
    icon: <Rocket className="w-6 h-6" />,
    category: "giovani"
  },
  {
    id: "voucher-digitalizzazione",
    title: "Voucher Digitalizzazione",
    description: "Contributi per l'acquisto di software, hardware e servizi specialistici per la digitalizzazione dei processi aziendali e l'ammodernamento tecnologico.",
    target: ["PMI", "Micro imprese"],
    amount: "Variabile per regione (5.000€ - 50.000€)",
    deadline: "Bandi regionali periodici",
    link: "https://www.mise.gov.it/",
    icon: <Laptop className="w-6 h-6" />,
    category: "digitalizzazione"
  },
  {
    id: "on-oltre",
    title: "ON - Oltre Nuove Imprese a Tasso Zero",
    description: "Incentivi dedicati a giovani e donne per investimenti fino a 3 milioni di euro, con mix di contributo a fondo perduto e finanziamento agevolato.",
    target: ["Imprese femminili", "Giovani imprenditori"],
    amount: "Mix fondo perduto (fino 90%) + prestito",
    deadline: "A sportello",
    link: "https://www.invitalia.it/",
    icon: <Users className="w-6 h-6" />,
    category: "donna"
  }
];

const LAST_UPDATED = "12 Febbraio 2026";

const categoryColors = {
  digitalizzazione: "border-blue-500/50 bg-blue-500/10",
  impresa: "border-primary/50 bg-primary/10",
  donna: "border-pink-500/50 bg-pink-500/10",
  giovani: "border-green-500/50 bg-green-500/10"
};

const categoryLabels = {
  digitalizzazione: "Digitalizzazione",
  impresa: "Nuova Impresa",
  donna: "Imprenditoria Femminile",
  giovani: "Giovani & Startup"
};

type CategoryFilter = "all" | "digitalizzazione" | "impresa" | "donna" | "giovani" | "favorites";

const Incentivi = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const filteredIncentives = incentives.filter(incentive => {
    if (activeFilter === "all") return true;
    if (activeFilter === "favorites") return isFavorite(incentive.id);
    return incentive.category === activeFilter;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-terminal">TORNA_HOME</span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/notifiche"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="hidden md:inline font-terminal text-sm">NOTIFICHE</span>
                  </Link>
                  <span className="text-muted-foreground text-sm hidden md:inline">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-4 py-2 border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-terminal text-sm"
                >
                  <User className="w-4 h-4" />
                  ACCEDI
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 border-b border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-terminal text-primary mb-4">
            INCENTIVI_STATALI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Scopri tutti i bandi e gli incentivi per la <span className="text-primary">digitalizzazione</span>, 
            l'<span className="text-primary">imprenditoria femminile</span> e le <span className="text-primary">nuove imprese</span>.
          </p>
          <p className="text-sm text-muted-foreground mt-3 font-terminal">
            ULTIMO_AGGIORNAMENTO: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="border-b border-yellow-500/30">
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <AlertDescription className="text-muted-foreground text-sm ml-2">
              Questo portale è un servizio informativo indipendente e <strong className="text-foreground">NON è affiliato, associato o sponsorizzato</strong> da alcun ente statale, ministeriale o erogatore di fondi. Le informazioni riportate hanno scopo puramente divulgativo. Verifica sempre i dettagli aggiornati sui siti ufficiali degli enti competenti.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-primary/20 bg-card/30 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-terminal">FILTRA:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 border rounded-sm text-sm font-terminal transition-colors ${
                activeFilter === "all"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-primary/30 text-muted-foreground hover:border-primary/50"
              }`}
            >
              Tutti ({incentives.length})
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => {
              const count = incentives.filter(i => i.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key as CategoryFilter)}
                  className={`px-4 py-2 border rounded-sm text-sm font-terminal transition-colors ${
                    activeFilter === key
                      ? `${categoryColors[key as keyof typeof categoryColors]} text-foreground`
                      : "border-primary/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
            {user && (
              <button
                onClick={() => setActiveFilter("favorites")}
                className={`px-4 py-2 border rounded-sm text-sm font-terminal transition-colors flex items-center gap-2 ${
                  activeFilter === "favorites"
                    ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-500"
                    : "border-primary/30 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Star className="w-4 h-4" />
                Preferiti
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Incentives Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {filteredIncentives.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {activeFilter === "favorites" 
                  ? "Non hai ancora salvato nessun incentivo." 
                  : "Nessun incentivo trovato per questa categoria."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredIncentives.map((incentive) => (
                <div 
                  key={incentive.id}
                  className={`border-2 rounded-sm p-6 transition-all hover:scale-[1.02] hover:shadow-lg ${categoryColors[incentive.category]} relative`}
                >
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(incentive.id, incentive.title)}
                    className={`absolute top-4 right-4 p-2 rounded-sm transition-colors ${
                      isFavorite(incentive.id)
                        ? "text-yellow-500 bg-yellow-500/20"
                        : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
                    }`}
                    title={isFavorite(incentive.id) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                  >
                    <Star className={`w-5 h-5 ${isFavorite(incentive.id) ? "fill-current" : ""}`} />
                  </button>

                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 pr-10">
                    <div className="p-2 border border-current rounded-sm text-primary">
                      {incentive.icon}
                    </div>
                    <span className="text-xs font-terminal px-2 py-1 bg-background/50 rounded-sm">
                      {categoryLabels[incentive.category]}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-terminal text-primary mb-3">
                    {incentive.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {incentive.description}
                  </p>

                  {/* Target */}
                  <div className="mb-4">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Per chi:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {incentive.target.map((t, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4 p-3 bg-background/30 border border-primary/20 rounded-sm">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">Importo:</span>
                    <span className="text-primary font-semibold">{incentive.amount}</span>
                  </div>

                  {/* Deadline */}
                  <div className="mb-5 text-sm">
                    <span className="text-muted-foreground">Scadenza: </span>
                    <span className="text-foreground">{incentive.deadline}</span>
                  </div>

                  {/* CTA */}
                  <a
                    href={incentive.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 border border-primary bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-terminal text-sm"
                  >
                    SCOPRI_DI_PIÙ
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 border-t border-primary/20 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-terminal text-primary mb-4">
            HAI_BISOGNO_DI_AIUTO?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Il Digital Oracle può analizzare la tua situazione e consigliarti gli incentivi più adatti al tuo progetto imprenditoriale.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-terminal"
          >
            <ArrowLeft className="w-5 h-5" />
            USA_DIGITAL_ORACLE
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Le informazioni sugli incentivi sono indicative. Verifica sempre sui siti ufficiali.</p>
          <p className="mt-2">© 2024 <span className="text-primary">DIGITAL_YOGIN</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Incentivi;
