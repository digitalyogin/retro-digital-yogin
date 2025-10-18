import { Smartphone, Globe, Code2 } from "lucide-react";

const mobileServices = [
  "App Design / UI/ UX",
  "Sviluppo nativo Swift / SwiftUI / Kotlin",
  "Sviluppo ibrido con Flutter e React Native",
  "Backend Django, Express, SQL, MongoDB, Firebase, Flask, Go",
  "Solidity e Moralis per sviluppo Dapp"
];

const webServices = [
  "Web Design / UI/ UX",
  "Sviluppo frontend con React, Angular, Vue",
  "Sviluppo css framework con Tailwind, MUI, Semantic UI",
  "Webapp per gestionali di piccole e grandi aziende"
];

export const Services = () => {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-glow">
            {'<'} COSA_FACCIAMO {'>'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground border border-primary/30 inline-block px-6 py-3 bg-card/50">
            Ti accompagniamo in tutto quello che serve al progetto
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mobile Development */}
          <div className="border-2 border-primary p-6 border-glow bg-card hover:bg-muted/30 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="w-8 h-8 text-accent" />
              <h3 className="text-2xl md:text-3xl font-bold text-glow">
                SVILUPPO_MOBILE
              </h3>
            </div>
            
            <p className="text-base md:text-lg mb-6 text-muted-foreground">
              Siamo specializzati nello sviluppo di applicazioni mobile, sia <span className="text-primary">ibride</span> che <span className="text-primary">native</span>, per i sistemi operativi <span className="text-secondary">iOS</span> e <span className="text-secondary">Android</span>.
            </p>
            
            <p className="text-base md:text-lg mb-6 text-muted-foreground">
              Offriamo soluzioni web come <span className="text-accent">WebApp</span>, gestionali e servizi in cloud, insieme a tecnologie come la <span className="text-accent">Blockchain</span> e il <span className="text-accent">Machine Learning</span>.
            </p>
            
            <div className="space-y-2">
              {mobileServices.map((service, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm md:text-base">
                  <span className="text-primary flex-shrink-0">{'>'}</span>
                  <span className="group-hover:text-primary transition-colors">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Web Development */}
          <div className="border-2 border-secondary p-6 border-glow bg-card hover:bg-muted/30 transition-all group">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-accent" />
              <h3 className="text-2xl md:text-3xl font-bold text-glow">
                SVILUPPO_WEB
              </h3>
            </div>
            
            <p className="text-base md:text-lg mb-6 text-muted-foreground">
              Siamo specializzati nello sviluppo di siti <span className="text-primary">web</span> ed <span className="text-primary">ecommerce</span> personalizzati, utilizzando sia piattaforme CMS che codice personalizzato.
            </p>
            
            <p className="text-base md:text-lg mb-6 text-muted-foreground">
              Preferiamo evitare WordPress a favore della semplicità di <span className="text-secondary">Squarespace</span> e dell'innovazione costante di <span className="text-secondary">Shopify</span>.
            </p>
            
            <p className="text-base md:text-lg mb-6 text-muted-foreground">
              Siamo esperti nell'utilizzo del framework <span className="text-accent">React</span>, per offrirti soluzioni web altamente performanti.
            </p>
            
            <div className="space-y-2">
              {webServices.map((service, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm md:text-base">
                  <span className="text-secondary flex-shrink-0">{'>'}</span>
                  <span className="group-hover:text-secondary transition-colors">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
