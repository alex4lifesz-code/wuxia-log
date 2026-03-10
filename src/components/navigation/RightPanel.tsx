"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useDisplaySettings } from "@/context/DisplaySettingsContext";
import PresetSlots from "@/components/ui/PresetSlots";
import { memo } from "react";

function RightPanel() {
  const { collapsed, isMobile, isNativeApp } = useAppContext();
  const { settings, updateSettings } = useDisplaySettings();
  const visible = settings.rightPanelVisible;
  const gamificationVisible = settings.gamificationVisible ?? true;

  // Hide entire panel when gamification is disabled
  if (!gamificationVisible) return null;

  // On mobile native, the Quick View panel is handled by PageLayout slide-in
  if (isMobile && isNativeApp) return null;

  // On mobile browser, hide completely
  if (isMobile) return null;

  // Hide when nav collapsed on desktop (no room)
  if (collapsed && !isMobile) return null;

  return (
    <div className="relative flex shrink-0">
      {/* Collapse / Expand toggle tab */}
      <button
        onClick={() => updateSettings({ rightPanelVisible: !visible })}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-4 h-10 bg-ink-dark border border-ink-light rounded-l flex items-center justify-center hover:bg-ink-mid transition-colors group"
        title={visible ? "Hide Quick View" : "Show Quick View"}
      >
        <svg
          className={`w-3 h-3 text-mist-dark group-hover:text-jade-glow transition-transform ${visible ? "rotate-0" : "rotate-180"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {visible && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-ink-deep border-l border-ink-light flex flex-col py-4 overflow-hidden"
          >
            <div className="w-64 min-w-[16rem]">
              <div className="px-4 mb-4">
                <h2 className="text-xs text-mist-dark uppercase tracking-widest">Quick View</h2>
              </div>

              <div className="px-4 space-y-4 overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(100vh - 5rem)" }}>
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

                {/* Cultivation Level */}
                <div className="ink-border rounded-lg p-3 bg-ink-dark">
                  <h3 className="text-xs text-gold mb-2">Cultivation Realm</h3>
                  <div className="text-center py-2">
                    <span className="text-lg text-gold-glow animate-glow-pulse">Mortal</span>
                    <div className="mt-2 w-full bg-ink-mid rounded-full h-1.5">
                      <div
                        className="bg-jade-glow h-1.5 rounded-full"
                        style={{ width: "10%" }}
                      />
                    </div>
                    <p className="text-[10px] text-mist-dark mt-1">
                      10% to Foundation Establishment
                    </p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="ink-border rounded-lg p-3 bg-ink-dark">
                  <h3 className="text-xs text-mountain-blue-glow mb-2">Recent Activity</h3>
                  <p className="text-xs text-mist-dark italic">
                    No recent cultivation records
                  </p>
                </div>

                {/* Saved Presets */}
                <PresetSlots variant="sidebar" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(RightPanel);
