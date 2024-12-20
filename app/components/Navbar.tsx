"use client";

import Link from "next/link";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  return (
    <nav className="top-0 left-0 right-0 h-16 border-b-2 border-gray-300 dark:border-gray-800 ">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="function-link">
            首頁
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/about" className="function-link">
            關於
          </Link>
          <span className="dark:text-gray-500 text-gray-500">•</span>
          <Link href="/subscription" className="function-link">
            訂閱
          </Link>
          <span className="dark:text-gray-500 text-gray-500">•</span>
          <Link href="/posts" className="function-link">
            全部文章
          </Link>
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
