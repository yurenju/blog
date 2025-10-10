import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const prefix = locale === 'zh' ? '' : `/${locale}`;

  return (
    <div className="container mx-auto">
      <section className="flex flex-col items-center max-w-sm mx-auto">
        <Image
          src={siteConfig.image}
          alt={siteConfig.title}
          width={100}
          height={100}
          className="rounded-full"
          priority
        />
        <h1>
          {siteConfig.title}
        </h1>
        <p>
          {t.site.description}
        </p>
      </section>

      <div>
        <ul className="flex items-center justify-center">
          <li>
            <Button variant="ghost" asChild>
              <Link href={`${prefix}/shorts`}>{t.categories.shorts}</Link>
            </Button>
          </li>
          <span className="text-muted-foreground">•</span>
          <li>
            <Button variant="ghost" asChild>
              <Link href={`${prefix}/life`}>{t.categories.life}</Link>
            </Button>
          </li>
          <span className="text-muted-foreground">•</span>
          <li>
            <Button variant="ghost" asChild>
              <Link href={`${prefix}/tech`}>{t.categories.tech}</Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
