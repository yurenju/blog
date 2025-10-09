import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";

export default function Home() {
  return (
    <div className="container mx-auto text-xl tracking-wide">
      <section className="flex flex-col items-center gap-4 mt-20 mb-4 max-w-sm mx-auto">
        <Image
          src={siteConfig.image}
          alt={siteConfig.title}
          width={100}
          height={100}
          className="rounded-full"
          priority
        />
        <h1 className="mt-4 text-4xl font-bold homepage-title">
          {siteConfig.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mb-4 homepage-description leading-9 font-medium md:font-normal">
          {siteConfig.description}
        </p>
      </section>

      <div>
        <ul className="flex items-center justify-center gap-2 text-md">
          <li>
            <Button variant="ghost" asChild>
              <Link href="/shorts">照片</Link>
            </Button>
          </li>
          <span className="text-muted-foreground">•</span>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/life">生活</Link>
            </Button>
          </li>
          <span className="text-muted-foreground">•</span>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/tech">技術</Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
