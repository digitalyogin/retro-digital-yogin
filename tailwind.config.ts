import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        terminal: ['VT323', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['EB Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "tilt-3d": {
          "0%, 100%": { transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)" },
          "25%": { transform: "perspective(1000px) rotateY(5deg) rotateX(2deg)" },
          "75%": { transform: "perspective(1000px) rotateY(-5deg) rotateX(-2deg)" },
        },
        "holo-scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "rgb-split": {
          "0%, 100%": { textShadow: "0 0 0 rgba(255,0,0,0)" },
          "33%": { textShadow: "2px 0 0 rgba(255,0,0,0.8), -2px 0 0 rgba(0,255,255,0.8)" },
          "66%": { textShadow: "-2px 0 0 rgba(255,0,0,0.8), 2px 0 0 rgba(0,255,255,0.8)" },
        },
        "em-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,255,170,0.7)" },
          "50%": { boxShadow: "0 0 20px 10px rgba(0,255,170,0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "sacred-pulse": {
          "0%, 100%": { 
            opacity: "0.3",
            transform: "scale(1) rotate(0deg)"
          },
          "50%": { 
            opacity: "0.5",
            transform: "scale(1.03) rotate(0.5deg)"
          }
        },
        "glow-purple": {
          "0%, 100%": { 
            opacity: "0.6",
            filter: "drop-shadow(0 0 10px hsla(250, 80%, 60%, 0.5))"
          },
          "50%": { 
            opacity: "1",
            filter: "drop-shadow(0 0 25px hsla(250, 80%, 60%, 0.9))"
          }
        },
        "glow-gold": {
          "0%, 100%": { 
            opacity: "0.6",
            filter: "drop-shadow(0 0 10px hsla(40, 95%, 60%, 0.5))"
          },
          "50%": { 
            opacity: "1",
            filter: "drop-shadow(0 0 25px hsla(40, 95%, 60%, 0.9))"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "tilt-3d": "tilt-3d 10s ease-in-out infinite",
        "holo-scan": "holo-scan 2s linear infinite",
        "rgb-split": "rgb-split 0.3s ease-in-out",
        "em-pulse": "em-pulse 2s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "sacred-pulse": "sacred-pulse 8s ease-in-out infinite",
        "glow-purple": "glow-purple 3s ease-in-out infinite",
        "glow-gold": "glow-gold 3s ease-in-out infinite 1.5s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
