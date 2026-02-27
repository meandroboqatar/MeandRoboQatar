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
            },
        },
    },
    plugins: [],
};

export default config;
