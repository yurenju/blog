"use client";

import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  return (
    <nav className="top-0 left-0 right-0 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4"></div>
        <div className="flex items-center gap-4">
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
