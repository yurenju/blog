import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";
import { getTranslation } from "@/lib/i18n/translations";
import Navbar from "@/components/Navbar";
import type { Locale } from "@/lib/i18n/locales";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);

  return (
    <>
      <Navbar locale={locale} category={null} />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <section className="flex flex-col items-center max-w-sm mx-auto text-center space-y-4">
        <Image
          src={siteConfig.image}
          alt={siteConfig.title}
          width={100}
          height={100}
          className="rounded-full"
          priority
        />
        <h1 className="font-serif text-3xl font-bold">
          {siteConfig.title}
        </h1>
        <p className="text-lg leading-relaxed">
          {t.site.description}
        </p>
      </section>

      <nav className="mt-8">
        <ul className="flex items-center justify-center gap-2">
          <li>
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/life`}>{t.categories.life}</Link>
            </Button>
          </li>
          <span className="text-muted-foreground">•</span>
          <li>
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/tech`}>{t.categories.tech}</Link>
            </Button>
          </li>
        </ul>
      </nav>
      </div>
    </>
  );
}
