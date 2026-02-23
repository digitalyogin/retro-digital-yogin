import { Projects } from "@/components/Projects";

const ProgettiOnline = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="w-full max-w-4xl border border-border bg-card p-8">
        <h1 className="text-2xl font-terminal text-primary text-glow mb-4">[03] PROGETTI_ONLINE</h1>
        <div className="space-y-4 text-muted-foreground font-terminal text-sm">
          <p>{">"} Portfolio dei nostri progetti realizzati.</p>
        </div>
      </div>
      <div className="w-full max-w-6xl mt-8">
        <Projects />
      </div>
    </div>
  );
};

export default ProgettiOnline;
