// Empty PostCSS config to prevent picking up the root config (which loads
// Tailwind for the Next.js side). Astro's CSS is vanilla and doesn't need
// Tailwind; without this file, Tailwind would run with the root content
// paths resolved against astro/, find nothing, and warn on every dev start.
export default {
  plugins: {},
};
