import { AnimatedRichText } from "@/components/animation/AnimatedRichText";

const ChiSiamo = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <AnimatedRichText
          title="CHI SIAMO"
          subtitle="Digital Yogin unisce cultura artigianale e ingegneria software per costruire esperienze digitali affidabili, evolutive e misurabili."
          blocks={[
            {
              heading: "Missione",
              paragraphs: [
                "Progettiamo piattaforme digitali che migliorano processi reali: meno complessita operativa, piu chiarezza per team e clienti.",
                "Lavoriamo con una metodologia pragmatica orientata a risultati verificabili, testabili e sostenibili nel tempo.",
              ],
            },
            {
              heading: "Metodo",
              paragraphs: [
                "Partiamo dall'analisi tecnica e funzionale, definiamo KPI concreti e sviluppiamo incrementi piccoli ma frequenti.",
                "Ogni rilascio deve mantenere stabilita in preview, produzione e integrazioni future come app iOS native.",
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ChiSiamo;
