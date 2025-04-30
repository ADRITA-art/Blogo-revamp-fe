/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#333',
            a: {
              color: '#3B82F6',
              '&:hover': {
                color: '#2563EB',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        'h1, h2, h3, h4, h5, h6': {
          fontFamily: theme('fontFamily.serif'),
        },
        'h1': { lineHeight: '1.2' },
        'h2': { lineHeight: '1.25' },
        'p, ul, ol': { lineHeight: '1.5' },
      });
    },
    function({ addComponents }) {
      addComponents({
        '.prose': {
          '> p': {
            marginTop: '1.25em',
            marginBottom: '1.25em',
          },
          '> h1, > h2, > h3, > h4': {
            marginTop: '1.5em',
            marginBottom: '0.5em',
          },
          '> ul, > ol': {
            marginTop: '1.25em',
            marginBottom: '1.25em',
            paddingLeft: '1.625em',
          },
          '> blockquote': {
            borderLeftWidth: '0.25rem',
            borderLeftColor: '#e5e7eb',
            paddingLeft: '1rem',
            fontStyle: 'italic',
            color: '#6b7280',
          },
          '> img': {
            marginTop: '2em',
            marginBottom: '2em',
          },
          'ul > li': {
            position: 'relative',
            paddingLeft: '1.375em',
          },
          'ul > li::before': {
            content: '""',
            position: 'absolute',
            backgroundColor: '#d1d5db',
            borderRadius: '50%',
            width: '0.375em',
            height: '0.375em',
            top: 'calc(0.875em - 0.1875em)',
            left: '0.25em',
          },
          'a': {
            color: '#3b82f6',
            textDecoration: 'underline',
            fontWeight: '500',
          },
        },
        '.prose-lg': {
          fontSize: '1.125rem',
          '> p': {
            marginTop: '1.5em',
            marginBottom: '1.5em',
          },
        },
      });
    },
  ],
};