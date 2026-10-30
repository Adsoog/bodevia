export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#F6F5F0',
        bone: '#FFFFFF',
        gridwarm: '#E2E0D8',
        rackyellow: '#F59E0B',
        rackdark: '#334155',
        partheavy: '#2563EB',
        partfast: '#FF5A5F',
        partfragile: '#10B981',
        partspecial: '#8B5CF6',
        forklift: '#F97316',
        ink: '#1E293B'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        clay: '0 20px 45px -12px rgba(30, 41, 59, 0.12), 0 4px 12px -2px rgba(30, 41, 59, 0.05), inset 0 2px 0 0 rgba(255, 255, 255, 0.9)',
        pill: '0 8px 20px -4px rgba(249, 115, 22, 0.35), inset 0 2px 0 0 rgba(255, 255, 255, 0.35)'
      }
    }
  },
  plugins: []
};
