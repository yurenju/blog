import Link from "next/link";
import Image from "next/image";
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
            <Link href="/shorts" className="function-link">
              照片
            </Link>
          </li>
          <span className="dark:text-gray-300 text-gray-500">•</span>
          <li>
            <Link href="/life" className="function-link">
              生活
            </Link>
          </li>
          <span className="dark:text-gray-300 text-gray-500">•</span>
          <li>
            <Link href="/tech" className="function-link">
              技術
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
