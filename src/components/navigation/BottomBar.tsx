"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function BottomBar() {
  const { getSortedNavItems, isMobile, viewportMode, isNativeApp } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const items = getSortedNavItems();
  const [menuOpen, setMenuOpen] = useState(false);

  // Only show on mobile layout AND only in native APK
  const effectiveMobile = isMobile || viewportMode === "mobile";
  if (!isNativeApp || !effectiveMobile) return null;

  // Primary 3-item navigation: Dao Hall, Training Grounds, Technique Scroll
  const primaryItems = [
    items.find(i => i.path === "/dashboard"),
    items.find(i => i.path === "/dashboard/workout"),
    items.find(i => i.path === "/dashboard/exercises"),
  ].filter(Boolean) as typeof items;

  // All remaining items for the hamburger menu
  const moreItems = items.filter(i => !primaryItems.find(p => p.id === i.id));

  return (
    <>
      {/* Overlay for expanded hamburger menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void-black/60 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Expanded hamburger menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-ink-deep border-t border-jade-deep/50 rounded-t-xl mx-2 p-3 mb-0"
            >
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-[10px] uppercase tracking-wider text-mist-dark font-semibold">Navigation</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded text-mist-dark hover:text-cloud-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {moreItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
                    pathname === item.path
                      ? "text-jade-light bg-jade-deep/30"
                      : "text-mist-light hover:text-jade-light hover:bg-ink-mid"
                  }`}
                  onClick={() => {
                    router.push(item.path);
                    setMenuOpen(false);
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation bar — 3 primary items + hamburger */}
        <div className="bg-ink-deep border-t border-ink-light flex justify-around items-center px-2 py-2 safe-area-bottom">
          {primaryItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive
                    ? "text-jade-light"
                    : "text-mist-mid hover:text-mist-light"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px]">{item.label.split(" ")[0]}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomBarIndicator"
                    className="w-4 h-0.5 bg-jade-glow rounded-full"
                  />
                )}
              </motion.button>
            );
          })}

          {/* Hamburger menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              menuOpen
                ? "text-jade-light"
                : "text-mist-mid hover:text-mist-light"
            }`}
          >
            <span className="text-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
            <span className="text-[10px]">More</span>
            {menuOpen && (
              <motion.div
                layoutId="bottomBarIndicator"
                className="w-4 h-0.5 bg-jade-glow rounded-full"
              />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
