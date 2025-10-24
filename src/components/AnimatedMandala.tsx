import mandalaSymbol from "@/assets/mandala-ascii.png";

export const AnimatedMandala = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10">
      <img 
        src={mandalaSymbol} 
        alt="Mandala Symbol" 
        className="w-[400px] h-[400px] opacity-30 animate-fade-in"
        style={{
          filter: "drop-shadow(0 0 30px rgba(255, 140, 50, 0.4))"
        }}
      />
    </div>
  );
};
