import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { ThemeProvider } from "next-themes";
import {
  Noto_Sans,
  Noto_Sans_TC,
  Noto_Sans_JP,
  Noto_Serif,
  Noto_Serif_TC,
  Noto_Serif_JP,
  Noto_Sans_Mono
} from 'next/font/google';

// Body font (Sans Serif) - for main content
const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600'],  // Regular, Medium, SemiBold
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '600'],
  display: 'swap',
});

// Heading and byline font (Serif) - for titles and author signatures
const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '600', '700'],  // Regular, SemiBold, Bold
  display: 'swap',
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  weight: ['400', '600', '700'],
  display: 'swap',
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  variable: '--font-noto-serif-jp',
  weight: ['400', '600', '700'],
  display: 'swap',
});

// Code font (Monospace)
const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-noto-sans-mono',
  weight: ['400', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`
        ${notoSans.variable}
        ${notoSansTC.variable}
        ${notoSansJP.variable}
        ${notoSerif.variable}
        ${notoSerifTC.variable}
        ${notoSerifJP.variable}
        ${notoSansMono.variable}
        font-sans
        antialiased
      `}>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
