import type { Config } from "tailwindcss";

export default {
	darkMode: ["selector", "class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		// Language configuration for tailwindcss-localized
		// Maps short language codes to HTML lang attribute values from htmlLangMap
		languages: {
			en: 'en',           // class: en:xxx, matches lang="en"
			zh: 'zh-Hant-TW',   // class: zh:xxx, matches lang="zh-Hant-TW"
			ja: 'ja',           // class: ja:xxx, matches lang="ja"
		},
		extend: {
			// Font family configuration for mixed typography strategy
			// Body text: Sans Serif, Headings: Serif, Code: Monospace
			// Note: CJK fonts should come first to ensure proper rendering of Chinese/Japanese characters
			fontFamily: {
				sans: [
					'var(--font-noto-sans)',      // English/Latin last
					'var(--font-noto-sans-tc)',   // Chinese first for better CJK coverage
					'var(--font-noto-sans-jp)',   // Japanese second
					'system-ui',
					'-apple-system',
					'sans-serif',
				],
				serif: [
					'var(--font-noto-serif)',     // English/Latin last
					'var(--font-noto-serif-tc)',  // Chinese first for better CJK coverage
					'var(--font-noto-serif-jp)',  // Japanese second
					'Georgia',
					'serif',
				],
				mono: [
					'var(--font-noto-sans-mono)',
					'Consolas',
					'Monaco',
					'monospace',
				],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			// Typography configuration for @tailwindcss/typography
			// Defines prose styles for English (DEFAULT), Chinese (zh), and Japanese (ja)
			typography: ({ theme }: { theme: (path: string) => string }) => ({
				DEFAULT: {
					css: {
						// Base typography settings for English
						fontSize: '1rem',
						lineHeight: '1.75',
						letterSpacing: '0.01em',
						maxWidth: '65ch',
						color: theme('colors.foreground'),

						// Headings - use serif font family
						h1: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '2.25rem',
							marginTop: '0',
							marginBottom: '0.8em',
							lineHeight: '1.2',
							fontWeight: '700',
							color: theme('colors.foreground'),
						},
						h2: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.875rem',
							marginTop: '2em',
							marginBottom: '1em',
							lineHeight: '1.3',
							fontWeight: '700',
							color: theme('colors.foreground'),
						},
						h3: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.5rem',
							marginTop: '1.6em',
							marginBottom: '0.8em',
							lineHeight: '1.4',
							fontWeight: '600',
							color: theme('colors.foreground'),
						},
						h4: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.25rem',
							marginTop: '1.5em',
							marginBottom: '0.6em',
							lineHeight: '1.4',
							fontWeight: '600',
							color: theme('colors.foreground'),
						},

						// Paragraphs
						p: {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},

						// Lists
						ul: {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},
						ol: {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},
						li: {
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},

						// Links
						a: {
							color: theme('colors.primary.DEFAULT'),
							textDecoration: 'underline',
							fontWeight: '500',
							'&:hover': {
								color: theme('colors.primary.DEFAULT'),
								opacity: '0.8',
							},
						},

						// Strong and bold text
						strong: {
							color: theme('colors.foreground'),
							fontWeight: '600',
						},
						b: {
							color: theme('colors.foreground'),
							fontWeight: '600',
						},

						// Blockquotes
						blockquote: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.3rem',
							fontStyle: 'normal',
							fontWeight: '700',
							borderLeftColor: theme('colors.muted.foreground'),
							borderLeftWidth: '5px',
							paddingLeft: '1.2em',
							marginTop: '1.6em',
							marginBottom: '1.6em',
							color: theme('colors.muted.foreground'),
						},

						// Code blocks and inline code
						code: {
							fontFamily: theme('fontFamily.mono'),
							fontSize: '0.875em',
							color: theme('colors.foreground'),
						},
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
						pre: {
							fontFamily: theme('fontFamily.mono'),
							fontSize: '0.875rem',
							lineHeight: '1.7',
							marginTop: '1.7em',
							marginBottom: '1.7em',
							borderRadius: '0.375rem',
							paddingTop: '1em',
							paddingRight: '1.5em',
							paddingBottom: '1em',
							paddingLeft: '1.5em',
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
						'pre code': {
							backgroundColor: 'transparent',
							fontSize: 'inherit',
						},

						// Horizontal rule
						hr: {
							borderColor: theme('colors.border'),
						},

						// Footnotes
						'.footnotes': {
							fontSize: '0.8em',           // Smaller font size
							color: theme('colors.muted.foreground'),  // Lower contrast
							marginTop: '3em',
							paddingTop: '1.5em',
							borderTopWidth: '1px',
							borderTopColor: theme('colors.border'),
						},
						'.footnotes p': {
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},
						'.footnotes ol': {
							marginTop: '1em',
						},
						'.footnotes li': {
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},
						'.footnotes a': {
							color: theme('colors.muted.foreground'),  // Same as footnotes text
							fontWeight: '400',             // Normal weight (not bold)
							textDecoration: 'underline',   // Keep underline for accessibility
							'&:hover': {
								color: theme('colors.foreground'),  // Slightly brighter on hover
								opacity: '1',
							},
						},
					},
				},

				// Traditional Chinese (繁體中文)
				zh: {
					css: {
						// Base typography settings for Traditional Chinese
						fontSize: '1.125rem',      // 18px - larger for Chinese characters
						lineHeight: '2',           // 200% - more vertical space for dense characters
						letterSpacing: '0.05em',   // Wider letter spacing
						maxWidth: '65ch',
						color: theme('colors.foreground'),

						// Headings - use serif font family
						h1: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '2.5rem',      // 40px
							marginTop: '0',
							marginBottom: '0.8em',
							lineHeight: '1.3',
							letterSpacing: '0.02em',
							fontWeight: '700',
							color: theme('colors.foreground'),
						},
						h2: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '2rem',        // 32px
							marginTop: '2em',
							marginBottom: '1em',
							lineHeight: '1.4',
							letterSpacing: '0.02em',
							fontWeight: '700',
							color: theme('colors.foreground'),
						},
						h3: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.625rem',    // 26px
							marginTop: '1.6em',
							marginBottom: '0.8em',
							lineHeight: '1.5',
							letterSpacing: '0.02em',
							fontWeight: '600',
							color: theme('colors.foreground'),
						},
						h4: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.375rem',    // 22px
							marginTop: '1.5em',
							marginBottom: '0.6em',
							lineHeight: '1.5',
							letterSpacing: '0.02em',
							fontWeight: '600',
							color: theme('colors.foreground'),
						},

						// Paragraphs - more spacing for Chinese
						p: {
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},

						// Lists
						ul: {
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
						ol: {
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
						li: {
							marginTop: '0.6em',
							marginBottom: '0.6em',
						},

						// Links - inherit from DEFAULT
						a: {
							color: theme('colors.primary.DEFAULT'),
							textDecoration: 'underline',
							fontWeight: '500',
							'&:hover': {
								color: theme('colors.primary.DEFAULT'),
								opacity: '0.8',
							},
						},

						// Blockquotes
						blockquote: {
							fontFamily: theme('fontFamily.serif'),
							fontStyle: 'normal',
							fontWeight: '700',
							borderLeftColor: theme('colors.muted.foreground'),
							borderLeftWidth: '5px',
							paddingLeft: '1.5em',
							marginTop: '2em',
							marginBottom: '2em',
							color: theme('colors.muted.foreground'),
						},

						// Code blocks and inline code
						code: {
							fontFamily: theme('fontFamily.mono'),
							fontSize: '0.9em',
							letterSpacing: '0',      // Reset letter spacing for code
							color: theme('colors.foreground'),
						},
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
						pre: {
							fontFamily: theme('fontFamily.mono'),
							fontSize: '0.875rem',
							lineHeight: '1.8',
							marginTop: '2em',
							marginBottom: '2em',
							borderRadius: '0.375rem',
							paddingTop: '1em',
							paddingRight: '1.5em',
							paddingBottom: '1em',
							paddingLeft: '1.5em',
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
						'pre code': {
							backgroundColor: 'transparent',
							fontSize: 'inherit',
						},
					},
				},

				// Japanese (日本語)
				ja: {
					css: {
						// Base typography settings for Japanese
						fontSize: '1rem',          // 16px - smaller than Chinese (about 11% reduction)
						lineHeight: '1.85',        // 185%
						letterSpacing: '0.02em',
						maxWidth: '65ch',
						color: theme('colors.foreground'),

						// Headings - use serif font family
						h1: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '2.25rem',     // 36px
							marginTop: '0',
							marginBottom: '0.8em',
							lineHeight: '1.3',
							letterSpacing: '0.01em',
							fontWeight: '700',
							color: theme('colors.foreground'),
						},
						h2: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.875rem',    // 30px
							marginTop: '2em',
							marginBottom: '1em',
							lineHeight: '1.4',
							letterSpacing: '0.01em',
							fontWeight: '700',
							color: theme('colors.foreground'),
						},
						h3: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.5rem',      // 24px
							marginTop: '1.6em',
							marginBottom: '0.8em',
							lineHeight: '1.5',
							letterSpacing: '0.01em',
							fontWeight: '600',
							color: theme('colors.foreground'),
						},
						h4: {
							fontFamily: theme('fontFamily.serif'),
							fontSize: '1.25rem',     // 20px
							marginTop: '1.5em',
							marginBottom: '0.6em',
							lineHeight: '1.5',
							letterSpacing: '0.01em',
							fontWeight: '600',
							color: theme('colors.foreground'),
						},

						// Paragraphs
						p: {
							marginTop: '1.4em',
							marginBottom: '1.4em',
						},

						// Lists
						ul: {
							marginTop: '1.4em',
							marginBottom: '1.4em',
						},
						ol: {
							marginTop: '1.4em',
							marginBottom: '1.4em',
						},
						li: {
							marginTop: '0.55em',
							marginBottom: '0.55em',
						},

						// Links - inherit from DEFAULT
						a: {
							color: theme('colors.primary.DEFAULT'),
							textDecoration: 'underline',
							fontWeight: '500',
							'&:hover': {
								color: theme('colors.primary.DEFAULT'),
								opacity: '0.8',
							},
						},

						// Blockquotes
						blockquote: {
							fontFamily: theme('fontFamily.serif'),
							fontStyle: 'normal',
							fontWeight: '700',
							borderLeftColor: theme('colors.muted.foreground'),
							borderLeftWidth: '5px',
							paddingLeft: '1.2em',
							marginTop: '1.8em',
							marginBottom: '1.8em',
							color: theme('colors.muted.foreground'),
						},

						// Code blocks and inline code
						code: {
							fontFamily: theme('fontFamily.mono'),
							fontSize: '0.9em',
							letterSpacing: '0',      // Reset letter spacing for code
							color: theme('colors.foreground'),
						},
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
						pre: {
							fontFamily: theme('fontFamily.mono'),
							fontSize: '0.875rem',
							lineHeight: '1.7',
							marginTop: '1.8em',
							marginBottom: '1.8em',
							borderRadius: '0.375rem',
							paddingTop: '1em',
							paddingRight: '1.5em',
							paddingBottom: '1em',
							paddingLeft: '1.5em',
							backgroundColor: theme('colors.muted.DEFAULT'),
						},
						'pre code': {
							backgroundColor: 'transparent',
							fontSize: 'inherit',
						},
					},
				},
			}),
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("tailwindcss-localized"),
	],
	variants: {
		fontSize: ['responsive', 'localized'],
		lineHeight: ['responsive', 'localized'],
		letterSpacing: ['responsive', 'localized'],
		fontFamily: ['responsive', 'localized'],
	},
} satisfies Config;
