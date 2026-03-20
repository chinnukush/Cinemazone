/** @type {import('tailwindcss').Config} */

import defaultTheme from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/theme";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "480px",
      bsmmd: "750px",
      bsmmdTwo: "500px",
      md: "700px",
      lg: "1024px",
      blgxllg: "920px",
      blgxl: "1224px",
      xl: "1440px",
      xxl: "1600px",
    },

    extend: {
      fontFamily: {
        Anton: ["Anton", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        /* Text Colors */
        primaryTextColor: "#ffffff",
        secondaryTextColor: "#d1d5db",

        /* Cinematic Accent Color (Cinema Gold) */
        primaryBtn: "#FFD700",
        primaryBtnHower: "#e6c200",

        /* Background Colors */
        bgColor: "#0b0b0b",
        bgColorSecondary: "#1a1a1a",

        /* Card / Button Background */
        btnColor: "#FFD700",

        /* Highlight Color */
        otherColor: "#FFD700",
      },

      aspectRatio: {
        "9/13": "9/13",
      },

      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        md: "0.9rem",
        xl: "1.25rem",
        "2xl": "1.4rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
        "6xl": "4rem",
        "7xl": "6rem",
        "8xl": "8rem",
        "9xl": "11rem",
      },
    },
  },

  darkMode: "class",

  plugins: [nextui()],
};
