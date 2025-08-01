/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [    
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
        primary: {
          DEFAULT: '#FFBBC1',
          light: '#FFF2F4'
        },
        secondary: {
          DEFAULT: '#FFD364',
          light: '#FFF7E2',
          dark: '#998372'
        },
        background: {
          primary: '#FFFFFF'
        }
      },
    },
  },
  plugins: [],
}