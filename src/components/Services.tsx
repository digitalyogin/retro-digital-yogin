import { useRef } from "react";
import { Smartphone, Globe, Code2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: HTMLDivElement) => {
    const rect = ref.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * 15;
    const rotateY = ((e.clientX - centerX) / rect.width) * 15;
    ref.style.setProperty('--rotate-x', `${-rotateX}deg`);
    ref.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = (ref: HTMLDivElement) => {
    ref.style.setProperty('--rotate-x', '0deg');
    ref.style.setProperty('--rotate-y', '0deg');
  };

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
    <section ref={sectionRef} className="py-20 px-4 relative z-10 border-t-2 border-primary">
      <div className={`max-w-6xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
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
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="border-2 border-primary bg-card p-6 card-3d holo-border hover:border-accent transition-all cursor-pointer group"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s ease-out'
              }}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-primary text-sm mb-1">SERVICE_{service.id}</div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                </div>
                <div className="text-4xl text-primary/30 group-hover:text-primary/60 font-bold transition-colors">{service.id}</div>
              </div>

              {/* Scanning line effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-holo-scan" />
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
