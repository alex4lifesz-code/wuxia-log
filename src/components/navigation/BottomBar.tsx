"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useState, memo } from "react";
import { useRouter, usePathname } from "next/navigation";

function BottomBar() {
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
        <div 
          {...swipeHandlers}
          className="relative bg-gradient-to-b from-ink-dark to-ink-deep border-t border-jade-glow/10 flex justify-around items-center px-2 py-3 safe-area-bottom shadow-2xl"
          style={{
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.3), 0 -2px 8px rgba(52, 211, 153, 0.1)',
            backdropFilter: 'blur(12px)',
            willChange: 'transform',
          }}
        >
          {/* 3D curved edge effect */}
          <div 
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-jade-glow/20 to-transparent"
            style={{ transform: 'translateY(-100%)' }}
          />
          {primaryItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.85 }}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  duration: 0.25,
                }}
                onClick={() => router.push(item.path)}
                className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-jade-light bg-jade-deep/30 shadow-lg shadow-jade-glow/20"
                    : "text-mist-mid hover:text-mist-light hover:bg-ink-mid/50"
                }`}
                style={{
                  willChange: 'transform',
                  transform: isActive ? 'translateZ(0)' : undefined,
                }}
              >
                <motion.span 
                  className="text-xl"
                  animate={{ rotate: isActive ? [0, -10, 10, -5, 5, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.span>
                <span className={`text-[10px] font-semibold tracking-wide ${
                  isActive ? "text-jade-glow" : ""
                }`}>
                  {item.label.split(" ")[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomBarIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-jade-glow/50 via-jade-glow to-jade-glow/50 rounded-full"
                    style={{
                      boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Hamburger menu button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            animate={{
              scale: menuOpen ? 1.15 : 1,
              y: menuOpen ? -2 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.25,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300 ${
              menuOpen
                ? "text-jade-light bg-jade-deep/30 shadow-lg shadow-jade-glow/20"
                : "text-mist-mid hover:text-mist-light hover:bg-ink-mid/50"
            }`}
            style={{
              willChange: 'transform',
              transform: menuOpen ? 'translateZ(0)' : undefined,
            }}
          >
            <motion.span 
              className="text-xl"
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.span>
            <span className={`text-[10px] font-semibold tracking-wide ${
              menuOpen ? "text-jade-glow" : ""
            }`}>
              More
            </span>
            {menuOpen && (
              <motion.div
                layoutId="bottomBarIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-jade-glow/50 via-jade-glow to-jade-glow/50 rounded-full"
                style={{
                  boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)',
                }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}

export default memo(BottomBar);
