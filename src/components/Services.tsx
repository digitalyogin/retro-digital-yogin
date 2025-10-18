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
  const services = [
    {
      id: "01",
      title: "SVILUPPO_WEB",
      items: [
        "Siti web responsive e moderni",
        "E-commerce e piattaforme custom",
        "Web applications complesse",
        "Ottimizzazione SEO e performance"
      ]
    },
    {
      id: "02", 
      title: "APP_MOBILI",
      items: [
        "Applicazioni iOS e Android native",
        "App ibride cross-platform",
        "Progressive Web Apps (PWA)",
        "Integrazione API e backend"
      ]
    },
    {
      id: "03",
      title: "DESIGN_UI/UX",
      items: [
        "Design di interfacce utente moderne",
        "Prototipazione e wireframing",
        "User experience optimization",
        "Brand identity digitale"
      ]
    },
    {
      id: "04",
      title: "CONSULENZA_TECH",
      items: [
        "Architettura software e cloud",
        "Code review e ottimizzazione",
        "Technology stack selection",
        "Digital transformation strategy"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 relative z-10 border-t-2 border-primary">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 border-b-2 border-primary pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl md:text-6xl font-bold text-primary text-glow">
              SERVIZI_DISPONIBILI
            </h2>
            <span className="text-muted-foreground text-sm">CATALOGUE_v1.0</span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="border-2 border-primary bg-card p-6 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-primary text-sm mb-1">SERVICE_{service.id}</div>
                  <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                </div>
                <div className="text-4xl text-primary/30 font-bold">{service.id}</div>
              </div>
              
              <div className="space-y-2">
                {service.items.map((item, idx) => (
                  <div key={idx} className="flex items-start text-muted-foreground">
                    <span className="text-primary mr-2">{'>'}</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-primary/30">
                <span className="text-xs text-muted-foreground">STATUS: AVAILABLE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
