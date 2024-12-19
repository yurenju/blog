import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "./components/Navbar";
import { siteConfig } from "@/lib/siteConfig";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="zh-Hant-TW">
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased text-base leading-relaxed  dark:text-slate-200 dark:bg-gray-900 bg-stone-200`}
      >
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
