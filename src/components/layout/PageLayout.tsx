"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect, useCallback, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useDisplaySettings } from "@/context/DisplaySettingsContext";

const SIDEBAR_FAB_STORAGE_KEY = "cultivateos-sidebar-fab-pos";
const QV_FAB_STORAGE_KEY = "cultivateos-qv-fab-pos";

interface PageLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  title: string;
  subtitle?: string;
  /** Label for the sidebar in the mobile panel hub, e.g. "Techniques" */
  sidebarLabel?: string;
}

export default function PageLayout({
  children,
  sidebar,
  title,
  subtitle,
  sidebarLabel,
}: PageLayoutProps) {
  const { panelPosition, isMobile, isNativeApp } = useAppContext();
  const { settings, updateSettings } = useDisplaySettings();
  const effectivePosition = isMobile ? "top" : panelPosition;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileQuickViewOpen, setMobileQuickViewOpen] = useState(false);
  const sidebarPosition = settings.sidebarPosition || "left";
  const sidebarWidth = settings.sidebarWidth || 320;

  // Draggable FAB positions
  const [sidebarFabPos, setSidebarFabPos] = useState<{ x: number; y: number } | null>(null);
  const [qvFabPos, setQvFabPos] = useState<{ x: number; y: number } | null>(null);
  const sidebarFabRef = useRef<HTMLDivElement>(null);
  const qvFabRef = useRef<HTMLDivElement>(null);

  // Load persisted FAB positions
  useEffect(() => {
    try {
      const savedSidebar = localStorage.getItem(SIDEBAR_FAB_STORAGE_KEY);
      if (savedSidebar) setSidebarFabPos(JSON.parse(savedSidebar));
      const savedQv = localStorage.getItem(QV_FAB_STORAGE_KEY);
      if (savedQv) setQvFabPos(JSON.parse(savedQv));
    } catch { /* ignore */ }
  }, []);

  const handleSidebarFabDragEnd = useCallback((_: any, info: any) => {
    setSidebarFabPos(prev => {
      const newPos = { x: (prev?.x || 0) + info.offset.x, y: (prev?.y || 0) + info.offset.y };
      try { localStorage.setItem(SIDEBAR_FAB_STORAGE_KEY, JSON.stringify(newPos)); } catch {}
      return newPos;
    });
  }, []);

  const handleQvFabDragEnd = useCallback((_: any, info: any) => {
    setQvFabPos(prev => {
      const newPos = { x: (prev?.x || 0) + info.offset.x, y: (prev?.y || 0) + info.offset.y };
      try { localStorage.setItem(QV_FAB_STORAGE_KEY, JSON.stringify(newPos)); } catch {}
      return newPos;
    });
  }, []);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH_RATIO = 0.4;

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
    setIsResizing(true);
  }, [sidebarWidth]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const maxWidth = window.innerWidth * MAX_SIDEBAR_WIDTH_RATIO;
      const delta = sidebarPosition === "left"
        ? e.clientX - resizeRef.current.startX
        : resizeRef.current.startX - e.clientX;
      const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(maxWidth, resizeRef.current.startWidth + delta));
      updateSettings({ sidebarWidth: Math.round(newWidth) });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, sidebarPosition, updateSettings]);

  // Close mobile sidebar on escape
  useEffect(() => {
    if (!mobileSidebarOpen && !mobileQuickViewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileSidebarOpen(false);
        setMobileQuickViewOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileSidebarOpen, mobileQuickViewOpen]);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (mobileSidebarOpen || mobileQuickViewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileSidebarOpen, mobileQuickViewOpen]);

  // Close sidebars when switching away from mobile
  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
      setMobileQuickViewOpen(false);
    }
  }, [isMobile]);

  // Swipe from left edge to open sidebar on mobile (native APK only)
  useEffect(() => {
    if (!isMobile || !sidebar || !isNativeApp) return;
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (startX < 40 && dx > 60 && dy < 80 && !mobileSidebarOpen) {
        setMobileSidebarOpen(true);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, sidebar, mobileSidebarOpen, isNativeApp]);

  // Swipe from right edge to open Quick View on mobile (native APK only)
  useEffect(() => {
    if (!isMobile || !isNativeApp) return;
    let startX = 0;
    let startY = 0;
    const screenW = typeof window !== "undefined" ? window.innerWidth : 400;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = startX - t.clientX; // swipe left = positive
      const dy = Math.abs(t.clientY - startY);
      if (startX > screenW - 40 && dx > 60 && dy < 80 && !mobileQuickViewOpen) {
        setMobileQuickViewOpen(true);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, mobileQuickViewOpen, isNativeApp]);

  // Resize handle element
  const resizeHandle = sidebar && !isMobile && effectivePosition !== "top" ? (
    <div
      onMouseDown={handleResizeStart}
      className={`w-1 shrink-0 cursor-col-resize group relative transition-colors duration-200 ${
        isResizing ? "bg-jade-glow/40" : "bg-transparent hover:bg-jade-glow/20"
      }`}
      title="Drag to resize"
    >
      <div className={`absolute inset-y-0 ${sidebarPosition === "left" ? "-right-0.5 left-0" : "right-0 -left-0.5"} w-2`} />
      {/* Grip indicator */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-60 transition-opacity">
        <div className="w-0.5 h-0.5 rounded-full bg-mist-dark" />
        <div className="w-0.5 h-0.5 rounded-full bg-mist-dark" />
        <div className="w-0.5 h-0.5 rounded-full bg-mist-dark" />
      </div>
    </div>
  ) : null;

  // Desktop sidebar element
  const desktopSidebar = sidebar && !isMobile && effectivePosition !== "top" ? (
    <motion.div
      layout
      className="border-ink-light bg-ink-deep/50 shrink-0 overflow-hidden flex flex-col"
      style={{
        width: `${sidebarWidth}px`,
        minWidth: `${MIN_SIDEBAR_WIDTH}px`,
        borderRight: sidebarPosition === "left" ? "1px solid" : "none",
        borderLeft: sidebarPosition === "right" ? "1px solid" : "none",
        borderColor: "rgba(55,65,81,0.5)",
      }}
    >
      <div className="px-5 pt-4 pb-2.5 shrink-0 flex items-center justify-between">
        <h2 className="text-xs text-jade-glow uppercase tracking-widest font-semibold">{title}</h2>
        {/* Quick layout toggle — flip sidebar position */}
        <button
          onClick={() => updateSettings({ sidebarPosition: sidebarPosition === "left" ? "right" : "left" })}
          className="p-1 rounded-md border border-ink-light/50 text-mist-dark hover:text-jade-glow hover:border-jade-glow/40 hover:bg-jade-deep/20 transition-all duration-200"
          title={`Move panel to ${sidebarPosition === "left" ? "right" : "left"}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarPosition === "left" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h7v16h-7V4zM3 4h8v8H3V4z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h7v16H3V4zm10 0h8v8h-8V4z" />
            )}
          </svg>
        </button>
      </div>
      <div className="flex-1 min-h-0 px-1.5">
        {sidebar}
      </div>
      <div className="h-2 shrink-0" />
    </motion.div>
  ) : sidebar && !isMobile && effectivePosition === "top" ? (
    <motion.div
      layout
      className="w-full border-b border-ink-light bg-ink-deep/50 shrink-0 overflow-hidden flex flex-col max-h-[40vh]"
    >
      <div className="px-5 pt-4 pb-2.5 shrink-0 flex items-center justify-between">
        <h2 className="text-xs text-jade-glow uppercase tracking-widest font-semibold">{title}</h2>
      </div>
      <div className="flex-1 min-h-0 px-1.5">
        {sidebar}
      </div>
      <div className="h-2 shrink-0" />
    </motion.div>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${effectivePosition === "top" || isMobile ? "flex-col" : "flex-row"} h-full relative`}
      style={isResizing ? { userSelect: "none" } : undefined}
    >
      {/* Desktop sidebar — left position */}
      {sidebarPosition === "left" && desktopSidebar}
      {sidebarPosition === "left" && resizeHandle}

      {/* Main Content — full width on mobile */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? "p-4 pb-20" : "p-6"}`}>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {subtitle && (
            <p className="text-xs text-mist-dark mb-4 italic">{subtitle}</p>
          )}
          {children}
        </motion.div>
      </div>

      {/* Desktop sidebar — right position */}
      {sidebarPosition === "right" && resizeHandle}
      {sidebarPosition === "right" && desktopSidebar}

      {/* Mobile Quick View button — top-right corner (native APK only) */}
      {isMobile && isNativeApp && (
        <motion.div
          ref={qvFabRef}
          drag
          dragMomentum={false}
          dragElastic={0}
          onDragEnd={handleQvFabDragEnd}
          animate={qvFabPos || { x: 0, y: 0 }}
          className="fixed top-14 right-3 z-60 touch-none"
          style={{ cursor: "grab", zIndex: 60 }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (mobileSidebarOpen) setMobileSidebarOpen(false);
              setMobileQuickViewOpen(true);
            }}
            className="w-9 h-9 rounded-full bg-ink-dark/90 border border-gold/30 flex items-center justify-center shadow-md backdrop-blur-sm"
            title="Quick View"
            style={{ willChange: 'transform' }}
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Mobile sidebar FAB — draggable (native APK only) */}
      {isMobile && isNativeApp && sidebar && (
        <motion.div
          ref={sidebarFabRef}
          drag
          dragMomentum={false}
          dragElastic={0}
          onDragEnd={handleSidebarFabDragEnd}
          animate={sidebarFabPos || { x: 0, y: 0 }}
          className="fixed right-4 z-60 touch-none"
          style={{ 
            cursor: "grab",
            zIndex: 60,
            bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (mobileQuickViewOpen) setMobileQuickViewOpen(false);
              setMobileSidebarOpen(true);
            }}
            className="w-12 h-12 rounded-full bg-jade-deep border border-jade-glow/40 flex items-center justify-center shadow-lg shadow-jade-glow/20"
            title={sidebarLabel || title}
            style={{ willChange: 'transform' }}
          >
            <svg className="w-5 h-5 text-jade-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Mobile slide-in sidebar (page panel) — native APK only */}
      <AnimatePresence>
        {mobileSidebarOpen && isMobile && isNativeApp && sidebar && (
          <>
            <motion.div
              key="page-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              key="page-sidebar-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[340px] bg-ink-deep border-r border-jade-glow/20 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-ink-light shrink-0">
                <h2 className="text-sm text-jade-glow font-semibold uppercase tracking-wider">
                  {sidebarLabel || title}
                </h2>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-md text-mist-dark hover:text-cloud-white hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sidebar-scroll">
                {sidebar}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile slide-in Quick View panel */}
      <AnimatePresence>
        {mobileQuickViewOpen && isMobile && isNativeApp && (
          <>
            <motion.div
              key="quickview-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileQuickViewOpen(false)}
            />
            <motion.div
              key="quickview-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[320px] bg-ink-deep border-l border-gold/20 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-ink-light shrink-0">
                <h2 className="text-sm text-gold font-semibold uppercase tracking-wider">Quick View</h2>
                <button
                  onClick={() => setMobileQuickViewOpen(false)}
                  className="p-1.5 rounded-md text-mist-dark hover:text-cloud-white hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Today's Cultivation */}
                <div className="ink-border rounded-lg p-3 bg-ink-dark">
                  <h3 className="text-xs text-jade-glow mb-2">Today&apos;s Cultivation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-mist-light">Sessions</span>
                      <span className="text-cloud-white">0</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-mist-light">Exercises</span>
                      <span className="text-cloud-white">0</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-mist-light">Duration</span>
                      <span className="text-cloud-white">0 min</span>
                    </div>
                  </div>
                </div>
                {/* Cultivation Realm */}
                <div className="ink-border rounded-lg p-3 bg-ink-dark">
                  <h3 className="text-xs text-gold mb-2">Cultivation Realm</h3>
                  <div className="text-center py-2">
                    <span className="text-lg text-gold-glow animate-glow-pulse">Mortal</span>
                    <div className="mt-2 w-full bg-ink-mid rounded-full h-1.5">
                      <div className="bg-jade-glow h-1.5 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <p className="text-[10px] text-mist-dark mt-1">10% to Foundation Establishment</p>
                  </div>
                </div>
                {/* Recent Activity */}
                <div className="ink-border rounded-lg p-3 bg-ink-dark">
                  <h3 className="text-xs text-mountain-blue-glow mb-2">Recent Activity</h3>
                  <p className="text-xs text-mist-dark italic">No recent cultivation records</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
