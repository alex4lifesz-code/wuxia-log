"use client";

import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter, usePathname } from "next/navigation";

export default function FloatingMobileSidebar() {
  const { getSortedNavItems, isMobile, isNativeApp } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const items = getSortedNavItems();
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();

  // Handle swipe gesture to open sidebar — only in native APK
  useEffect(() => {
    if (!isMobile || !isNativeApp) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      // Only trigger if touch starts from left edge (within 30px)
      if (touch.clientX < 30 && !isOpen) {
        // Store start position for swipe detection
        (window as any).__sidebarSwipeStartX = touch.clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if ((window as any).__sidebarSwipeStartX !== undefined) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - (window as any).__sidebarSwipeStartX;
        // If swiped right more than 50px, open sidebar
        if (deltaX > 50) {
          setIsOpen(true);
          delete (window as any).__sidebarSwipeStartX;
        }
      }
    };

    const handleTouchEnd = () => {
      delete (window as any).__sidebarSwipeStartX;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isOpen, isNativeApp]);

  // Handle swipe to close
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      setIsOpen(false);
    }
  };

  // Only render in native APK mobile mode
  if (!isMobile || !isNativeApp) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Swipeable Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag="x"
            dragControls={dragControls}
            dragConstraints={{ left: -300, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed left-0 top-0 z-40 h-screen w-64 bg-ink-deep border-r border-jade-glow/20 flex flex-col py-4 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="px-4 mb-6 pb-4 border-b border-ink-light">
              <h2 className="text-sm text-jade-glow font-bold uppercase tracking-widest">
                ⚔️ Navigation
              </h2>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-2 space-y-1">
              {items.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      router.push(item.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-jade-deep/50 text-jade-light border border-jade/30 shadow-lg"
                        : "text-mist-light hover:text-cloud-white hover:bg-ink-mid border border-transparent"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.pinned && <span className="text-[10px] text-gold-dim">📌</span>}
                    {isActive && (
                      <motion.div className="w-2 h-2 bg-jade-glow rounded-full" />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer Quote */}
            <div className="px-4 pt-4 border-t border-ink-light">
              <p className="text-[10px] text-mist-dark text-center italic">
                &quot;The path of cultivation is long&quot;
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
