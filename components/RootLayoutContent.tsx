import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

export function RootLayoutContent({
  children,
  locale = "zh",
  htmlLang,
}: {
  children: React.ReactNode;
  locale?: Locale;
  htmlLang?: string;
}) {
  return (
    <html suppressHydrationWarning lang={htmlLang}>
      <body className="antialiased">
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-3xl">
            <Navbar locale={locale} category={null} />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
