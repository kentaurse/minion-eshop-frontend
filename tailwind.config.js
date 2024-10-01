module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      xxl: "1770px",
    },

    extend: {
      colors: {
        primaryColor: "#0070f3",
        minionLightBlue: "#C1F5FF",
        minionBlue: "#09BBDC",
        minionBlackBlue: "#036B7E",
        minionRed: "#ec4899",
        minionYellow: "#FDC651",
        minionBlack: "#242424",
      },
      fontFamily: {
        impact: ["Satoshi", "sans-serif"],
        times: ["Satoshi", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
