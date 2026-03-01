import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: "#0cce6b",
                    "green-hover": "#0ab95f",
                    "green-dim": "rgba(12,206,107,0.08)",
                    "green-glow": "rgba(12,206,107,0.15)",
                    dark: "#0a0a0a",
                    text: "#0a0a0a",
                    bg: "#ffffff",
                    surface: "#f7f7f8",
                    "surface-light": "#f0f0f2",
                    "surface-border": "#e5e7eb",
                    muted: "#5f6368",
                    blue: "#1565C0",
                    "blue-light": "#3CC68A",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                brand: "8px",
            },
            boxShadow: {
                glow: "0 0 20px rgba(12,206,107,0.1)",
                "glow-lg": "0 0 40px rgba(12,206,107,0.15)",
                card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
                "btn-hover": "0 8px 20px rgba(12,206,107,0.3)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-brand":
                    "linear-gradient(135deg, #0cce6b 0%, #0ab95f 50%, #09a853 100%)",
                "gradient-surface":
                    "linear-gradient(180deg, #ffffff 0%, #f7f7f8 100%)",
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "slide-up": "slideUp 0.6s ease-out forwards",
                "pulse-glow": "pulseGlow 2s ease-in-out infinite",
                float: "float 6s ease-in-out infinite",
                "float-slow": "float 10s ease-in-out infinite",
                "float-complex": "floatComplex 8s ease-in-out infinite",
                "float-data": "floatData 4s ease-in-out infinite",
                "float-chat": "floatChat 5s ease-in-out infinite",
                "pulse-notify": "pulseNotify 3s ease-in-out infinite",
                "slide-cards": "slideCards 6s ease-in-out infinite",
                "sparkle": "sparkle 4s ease-in-out infinite",
                "soundwave": "soundwave 2s ease-in-out infinite",
                "code-brackets": "codeBrackets 5s ease-in-out infinite",
                "document-flip": "documentFlip 6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                pulseGlow: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(12,206,107,0.1)" },
                    "50%": { boxShadow: "0 0 40px rgba(12,206,107,0.2)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                floatComplex: {
                    "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                    "25%": { transform: "translateY(-8px) rotate(-1deg)" },
                    "75%": { transform: "translateY(8px) rotate(1deg)" },
                },
                floatData: {
                    "0%, 100%": { transform: "translateY(0) scale(1)" },
                    "50%": { transform: "translateY(-12px) scale(1.02)" },
                },
                floatChat: {
                    "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
                    "50%": { transform: "translateY(-15px) rotate(2deg)" },
                },
                pulseNotify: {
                    "0%, 100%": { transform: "scale(1)", filter: "drop-shadow(0 0 10px rgba(12,206,107,0.2))" },
                    "50%": { transform: "scale(1.05)", filter: "drop-shadow(0 0 25px rgba(12,206,107,0.6))" },
                },
                slideCards: {
                    "0%, 100%": { transform: "translateX(0) translateY(0)" },
                    "50%": { transform: "translateX(10px) translateY(-5px)" },
                },
                sparkle: {
                    "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
                    "25%": { transform: "scale(1.05) rotate(3deg)", opacity: "0.9" },
                    "75%": { transform: "scale(0.95) rotate(-3deg)", opacity: "0.9" },
                },
                soundwave: {
                    "0%, 100%": { transform: "scaleY(1)" },
                    "50%": { transform: "scaleY(1.1) scaleX(1.02)" },
                },
                codeBrackets: {
                    "0%, 100%": { transform: "translateX(0) scale(1)" },
                    "50%": { transform: "translateX(5px) scale(1.03)" },
                },
                documentFlip: {
                    "0%, 100%": { transform: "perspective(1000px) rotateY(0deg)" },
                    "50%": { transform: "perspective(1000px) rotateY(10deg) translateY(-5px)" },
                }
            },
        },
    },
    plugins: [],
};

export default config;
