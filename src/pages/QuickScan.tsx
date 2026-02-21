import { OracleWidget } from "@/components/OracleWidget";

const QuickScan = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
      {/* ASCII Title */}
      <div className="text-center mb-8">
        <pre className="text-primary text-glow font-terminal text-xs sm:text-sm md:text-base leading-tight select-none">
{`
 ██████╗ ██████╗  █████╗  ██████╗██╗     ███████╗
██╔═══██╗██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝
██║   ██║██████╔╝███████║██║     ██║     █████╗  
██║   ██║██╔══██╗██╔══██║██║     ██║     ██╔══╝  
╚██████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
`}
        </pre>
        <p className="text-muted-foreground font-terminal text-sm mt-2">
          DIGITAL_YOGIN :: URL_ANALYZER v3.0
        </p>
      </div>

      {/* Oracle Widget - full width */}
      <div className="w-full max-w-4xl">
        <OracleWidget />
      </div>
    </div>
  );
};

export default QuickScan;
