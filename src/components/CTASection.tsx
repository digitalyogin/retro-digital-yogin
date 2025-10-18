import { useState } from 'react';
import { ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CTASection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "MESSAGGIO_INVIATO",
      description: "Ti contatteremo al più presto!",
      className: "border-primary bg-card text-foreground",
    });

    setFormData({ name: '', email: '', message: '' });
    setIsFormOpen(false);
  };

  return (
    <section className="py-20 px-4 border-t-2 border-primary relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA */}
        <div className="text-center space-y-8 mb-12">
          <div className="relative inline-block">
            <h2 className="text-5xl md:text-7xl font-bold text-primary text-glow animate-pulse">
              INIZIA_PROGETTO
            </h2>
            {/* Electromagnetic field effect */}
            <div className="absolute -inset-4 border-2 border-primary/30 animate-ping pointer-events-none" />
            <div className="absolute -inset-8 border border-primary/20 animate-pulse pointer-events-none" />
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trasforma la tua visione in realtà digitale. Contattaci per iniziare il tuo prossimo progetto.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="group border-2 border-primary bg-primary text-primary-foreground px-8 py-4 font-mono hover:bg-primary/90 transition-all relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                CONTATTACI
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>

            <a
              href="#progetti"
              className="border-2 border-primary text-primary px-8 py-4 font-mono hover:bg-primary/10 transition-colors"
            >
              VISUALIZZA_PORTFOLIO
            </a>
          </div>
        </div>

        {/* Contact Form */}
        {isFormOpen && (
          <div className="border-2 border-primary bg-card p-6 animate-scale-in">
            <div className="border-b border-primary pb-4 mb-6">
              <h3 className="text-2xl font-bold text-primary font-mono">INIZIALIZZA_CONTATTO</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Compila il form sottostante per iniziare una nuova sessione di comunicazione
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-primary mb-2">
                  {'>'} NOME_COMPLETO
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-primary bg-background text-foreground px-4 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Inserisci il tuo nome..."
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-primary mb-2">
                  {'>'} EMAIL_ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-primary bg-background text-foreground px-4 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="tuo.email@esempio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-primary mb-2">
                  {'>'} MESSAGGIO_DETTAGLI
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full border-2 border-primary bg-background text-foreground px-4 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Descrivi il tuo progetto..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 border-2 border-primary bg-primary text-primary-foreground px-6 py-3 font-mono hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  INVIA_MESSAGGIO
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="border-2 border-muted text-muted-foreground px-6 py-3 font-mono hover:bg-muted/10 transition-colors"
                >
                  ANNULLA
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'PROGETTI', value: '50+' },
            { label: 'CLIENTI', value: '30+' },
            { label: 'ANNI_EXP', value: '5+' },
            { label: 'TECNOLOGIE', value: '20+' },
          ].map((stat, index) => (
            <div
              key={index}
              className="border border-primary bg-card/50 p-4 text-center hover:border-2 transition-all"
            >
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
