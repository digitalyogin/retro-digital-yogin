import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { useToast } from "@/hooks/use-toast";

const Contatti = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [notice, setNotice] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = "Il modulo è in configurazione e al momento non trasmette i dati. Puoi conservare il testo e contattarci tramite i riferimenti aziendali.";
    setNotice(message);
    toast({ title: "INVIO NON DISPONIBILE", description: message, variant: "destructive" });
  };

  return (
    <div className="public-page">
      <PublicPageHero
        eyebrow="INIZIAMO DALL'ASCOLTO"
        title="Raccontaci dove vuoi"
        accent="arrivare."
        introduction="Obiettivi, contesto e vincoli sono il punto di partenza per costruire una proposta digitale concreta e sostenibile."
      />
      <section className="public-page-section public-contact-layout">
        <aside>
          <p className="dy-eyebrow">PRIMA DEL CODICE</p>
          <h2>Una conversazione chiara può evitare mesi di complessità.</h2>
          <p>Descrivi il progetto, il problema da risolvere e il risultato che vuoi raggiungere. Ti aiuteremo a mettere a fuoco il percorso.</p>
          <dl>
            <div><dt>Approccio</dt><dd>Strategia · Design · Sviluppo</dd></div>
            <div><dt>Relazione</dt><dd>Dal primo confronto all'evoluzione</dd></div>
          </dl>
        </aside>
        <div className="public-contact-form-wrap">
          <form onSubmit={onSubmit} className="public-contact-form">
            <div>
              <label htmlFor="contact-name">Nome</label>
              <input id="contact-name" name="name" type="text" autoComplete="name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
            </div>
            <div>
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
            </div>
            <div>
              <label htmlFor="contact-message">Messaggio</label>
              <textarea id="contact-message" name="message" rows={7} value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} required />
            </div>
            <button type="submit" className="dy-button dy-button-primary">Invia la richiesta <ArrowUpRight size={15} /></button>
            {notice && <p className="public-form-notice" role="status">{notice}</p>}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contatti;
