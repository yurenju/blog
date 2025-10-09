"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  return (
    <nav className="top-0 left-0 right-0 h-16 border-b-2 border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">首頁</Link>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link href="/about">關於</Link>
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="ghost" asChild>
            <Link href="/subscription">訂閱</Link>
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="ghost" asChild>
            <Link href="/posts">全部文章</Link>
          </Button>
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
