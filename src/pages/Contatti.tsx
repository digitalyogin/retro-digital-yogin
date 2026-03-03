import { useState } from "react";
import { ShuffleText } from "@/components/animation/ShuffleText";
import { useToast } from "@/hooks/use-toast";

const Contatti = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "MESSAGGIO_INVIATO",
      description: "Ti ricontatteremo entro 24 ore lavorative.",
    });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <ShuffleText
          as="h1"
          text="CONTATTI"
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
        />
        <ShuffleText
          as="p"
          text="Raccontaci obiettivi, vincoli e timeline: prepareremo una proposta tecnica concreta e sostenibile."
          className="text-lg text-muted-foreground"
        />

        <div className="border border-border bg-card p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full border border-primary/30 bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full border border-primary/30 bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Messaggio</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                required
                className="w-full border border-primary/30 bg-background px-3 py-2 text-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              className="border border-primary bg-primary/20 text-primary px-6 py-2 hover:bg-primary/30 transition-colors"
            >
              Invia
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contatti;
