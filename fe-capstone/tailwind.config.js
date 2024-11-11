/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        // "gradient-conic":
        //   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'reg-bg': 'url(/assets/reg4.png)',
        'log-bg': 'url(/assets/log.png)'
      },
      backgroundSize: {
        '50%': '50%',
        '60%': '60%',
        '75%': '75%',
        
      },
      backgroundPosition: {
        'left-bottom': 'left bottom',
        'left-top': 'left top',
      },
      backgroundSizePosition: {
        '75-left-bottom': '75% left bottom',
      },
    },
  },
  plugins: [],
};


