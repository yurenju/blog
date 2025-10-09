import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
});

export function RootLayoutContent({
  children,
  locale,
  htmlLang,
}: {
  children: React.ReactNode;
  locale?: Locale;
  htmlLang?: string;
}) {
  return (
    <html suppressHydrationWarning lang={htmlLang}>
      <body
        className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased text-base leading-relaxed tracking-wide md:tracking-wide md:leading-8 `}
      >
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-3xl">
            <Navbar locale={locale} />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
