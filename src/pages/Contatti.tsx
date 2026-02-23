import { useState } from "react";

const Contatti = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: in futuro collegare a backend
    setSent(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[04] CONTATTI</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">EMAIL:</p>
            <p>{">"} info@digitalyogin.it</p>
          </div>
          <div className="border border-border p-4 space-y-2">
            <p className="text-secondary">LOCATION:</p>
            <p>{">"} Padova, Italia</p>
          </div>

          {sent ? (
            <div className="border border-primary p-4">
              <p className="text-primary">{">"} MESSAGGIO_INVIATO. Ti ricontatteremo presto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-secondary text-xs block mb-1">NOME:</label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-background border border-border text-foreground font-terminal text-sm px-3 py-2 outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary text-xs block mb-1">EMAIL:</label>
                <input
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-background border border-border text-foreground font-terminal text-sm px-3 py-2 outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="text-secondary text-xs block mb-1">MESSAGGIO:</label>
                <textarea
                  maxLength={1000}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-background border border-border text-foreground font-terminal text-sm px-3 py-2 outline-none focus:border-primary resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 border border-primary text-primary font-terminal text-sm uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                [INVIA]
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contatti;
