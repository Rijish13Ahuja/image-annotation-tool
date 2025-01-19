module.exports = {
  darkMode: 'class', // Enable dark mode with the "class" strategy
  content: ["./public/**/*.html", "./src/**/*.{ts,tsx,html,css}"], // Ensure all relevant file types are included
  theme: {
    extend: {
      colors: {
        primary: '#1E90FF',  // Blue
        secondary: '#FF7F50', // Coral
        accent: '#32CD32',   // Green
        darkBg: '#1A202C',   // Charcoal for dark mode
        lightBg: '#F5F7FA',  // Light background

        // Predefined themes
        defaultBg: '#f9f9f9',       // Default background
        medicalBg: '#e6f7ff',       // Medical theme background
        educationalBg: '#fffbe6',   // Educational theme background
        geographicBg: '#e6ffe6',    // Geographic theme background
      },
      gradientColorStops: {
        light: ['#F5F7FA', '#C3CFE2'],
        dark: ['#2A2A72', '#009FFD'],
      },
      boxShadow: {
        neumorphic: '10px 10px 20px #D1D5DB, -10px -10px 20px #FFFFFF',
      },
    },
  },
  plugins: [],
};
