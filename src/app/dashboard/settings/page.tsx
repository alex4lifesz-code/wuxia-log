"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useDisplaySettings, TechniqueDisplayMode, RecentSessionsCompactMode, DateFormatOption, ActiveCardStyle } from "@/context/DisplaySettingsContext";
import PresetSlots from "@/components/ui/PresetSlots";

function SettingsSidebar({ onLogout }: { onLogout: () => void }) {
  const { themeStyle, viewportMode } = useAppContext();
  const { settings } = useDisplaySettings();

  const themeLabels: Record<string, string> = {
    "midnight-ink": "Midnight Ink",
    "mountain-mist": "Mountain Mist",
    "calligraphy": "Calligraphy",
    "sakura": "Sakura",
  };

  const modeLabels: Record<string, string> = {
    "name-only": "Name Only",
    "name-illumination": "Name + Glow",
    "name-illumination-realm": "+ Realm",
    "name-illumination-realm-path": "Full",
  };

  const styleLabels: Record<string, string> = {
    "default": "Default",
    "scroll-card": "Scroll Card",
  };

  const dateLabels: Record<string, string> = {
    "dd-mm-yyyy": "DD-MM-YYYY",
    "dd-mmm-yyyy": "DD-MMM-YYYY",
    "dd-mm-yy": "DD-MM-YY",
    "dd-mmm-yy": "DD-MMM-YY",
  };

  const SettingRow = ({ label, value, color = "text-jade-glow" }: { label: string; value: string; color?: string }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] text-mist-dark">{label}</span>
      <span className={`text-[10px] font-medium ${color}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Settings Overview */}
      <div className="ink-border rounded-lg p-3 bg-ink-dark">
        <h3 className="text-[10px] text-gold uppercase tracking-wider mb-2 font-semibold">🎨 Appearance</h3>
        <div className="divide-y divide-ink-light/20">
          <SettingRow label="Theme" value={themeLabels[themeStyle] || themeStyle} color="text-gold" />
        </div>
      </div>

      <div className="ink-border rounded-lg p-3 bg-ink-dark">
        <h3 className="text-[10px] text-jade-glow uppercase tracking-wider mb-2 font-semibold">📋 Display</h3>
        <div className="divide-y divide-ink-light/20">
          <SettingRow label="Active Cards" value={modeLabels[settings.activeCardMode] || settings.activeCardMode} />
          <SettingRow label="Card Style" value={styleLabels[settings.activeCardStyle] || settings.activeCardStyle} />
          <SettingRow label="Compact" value={settings.activeCardCompact ? "On" : "Off"} color={settings.activeCardCompact ? "text-jade-glow" : "text-mist-dark"} />
          <SettingRow label="Notes Visible" value={settings.activeCardNotesAlwaysVisible ? "Always" : "Toggle"} />
          <SettingRow label="Sessions" value={modeLabels[settings.recentSessionsMode] || settings.recentSessionsMode} />
          <SettingRow label="Sessions Compact" value={settings.recentSessionsCompact} />
          <SettingRow label="Sidebar" value={modeLabels[settings.sidebarMode] || settings.sidebarMode} />
          <SettingRow label="Sidebar Style" value={styleLabels[settings.sidebarStyle] || settings.sidebarStyle} />
          <SettingRow label="Card Glow" value={`${settings.glowIntensityActiveCards ?? 100}%`} color={(settings.glowIntensityActiveCards ?? 100) > 0 ? "text-jade-glow" : "text-mist-dark"} />
          <SettingRow label="Sessions Glow" value={`${settings.glowIntensityRecentSessions ?? 100}%`} color={(settings.glowIntensityRecentSessions ?? 100) > 0 ? "text-jade-glow" : "text-mist-dark"} />
          <SettingRow label="Sidebar Glow" value={`${settings.glowIntensitySidebar ?? 100}%`} color={(settings.glowIntensitySidebar ?? 100) > 0 ? "text-jade-glow" : "text-mist-dark"} />
          <SettingRow label="Card Lore" value={(settings.activeCardLoreVisible ?? true) ? "Visible" : "Hidden"} color={(settings.activeCardLoreVisible ?? true) ? "text-jade-glow" : "text-mist-dark"} />
          <SettingRow label="Sidebar Lore" value={(settings.sidebarLoreVisible ?? true) ? "Visible" : "Hidden"} color={(settings.sidebarLoreVisible ?? true) ? "text-jade-glow" : "text-mist-dark"} />
        </div>
      </div>

      <div className="ink-border rounded-lg p-3 bg-ink-dark">
        <h3 className="text-[10px] text-mountain-blue-glow uppercase tracking-wider mb-2 font-semibold">⚙️ Layout</h3>
        <div className="divide-y divide-ink-light/20">
          <SettingRow label="Viewport" value={viewportMode.charAt(0).toUpperCase() + viewportMode.slice(1)} color="text-mountain-blue-glow" />
          <SettingRow label="Panel Position" value={settings.sidebarPosition === "left" ? "Left" : "Right"} color="text-mountain-blue-glow" />
          <SettingRow label="Quick View" value={settings.rightPanelVisible ? "Visible" : "Hidden"} color={settings.rightPanelVisible ? "text-mountain-blue-glow" : "text-mist-dark"} />
          <SettingRow label="Date Format" value={dateLabels[settings.dateFormat] || settings.dateFormat} color="text-mountain-blue-glow" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ink-border rounded-lg p-3 bg-ink-dark">
        <h3 className="text-[10px] text-crimson-glow uppercase tracking-wider mb-2 font-semibold">⚡ Quick Actions</h3>
        <div className="space-y-1.5">
          <GlowButton
            variant="crimson"
            size="sm"
            className="w-full !text-[10px]"
            onClick={onLogout}
          >
            🚪 Logout
          </GlowButton>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const {
    navItems,
    toggleNavPin,
    themeStyle,
    setThemeStyle,
    viewportMode,
    setViewportMode,
  } = useAppContext();
  const { settings, updateSettings, resetSettings } = useDisplaySettings();

  return (
    <PageLayout
      title="Inner Chamber"
      subtitle="Configure your cultivation environment"
      sidebar={<SettingsSidebar onLogout={logout} />}
    >
      <div className="space-y-6 max-w-2xl">

        {/* ══════════════════════════════════════════════════════════
            SECTION 1: APPEARANCE — Theme & Visual Identity
           ══════════════════════════════════════════════════════════ */}
        <GlowCard glow="gold" hoverable={false}>
          <h3 className="text-sm text-gold uppercase tracking-wider mb-4">
            Appearance
          </h3>

          {/* Theme Selector Cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setThemeStyle("midnight-ink")}
              className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                themeStyle === "midnight-ink"
                  ? "border-jade/50 bg-jade-deep/20 glow-subtle"
                  : "border-ink-light bg-ink-dark/50 hover:border-mist-mid"
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#0d0f14]" />
                <div className="w-3 h-3 rounded-full bg-[#1a1e2e]" />
                <div className="w-3 h-3 rounded-full bg-[#3a8f8f]" />
                <div className="w-3 h-3 rounded-full bg-[#c43030]" />
              </div>
              <p className="text-xs font-medium text-cloud-white">Midnight Ink</p>
              <p className="text-[10px] text-mist-dark">Deep void &amp; jade</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setThemeStyle("mountain-mist")}
              className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                themeStyle === "mountain-mist"
                  ? "border-jade/50 bg-jade-deep/20 glow-subtle"
                  : "border-ink-light bg-ink-dark/50 hover:border-mist-mid"
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#f5f0eb]" />
                <div className="w-3 h-3 rounded-full bg-[#c8c0b8]" />
                <div className="w-3 h-3 rounded-full bg-[#2d7a7a]" />
                <div className="w-3 h-3 rounded-full bg-[#a04040]" />
              </div>
              <p className="text-xs font-medium text-cloud-white">Mountain Mist</p>
              <p className="text-[10px] text-mist-dark">Rice paper &amp; ink</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setThemeStyle("calligraphy")}
              className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                themeStyle === "calligraphy"
                  ? "border-jade/50 bg-jade-deep/20 glow-subtle"
                  : "border-ink-light bg-ink-dark/50 hover:border-mist-mid"
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
                <div className="w-3 h-3 rounded-full bg-[#303030]" />
                <div className="w-3 h-3 rounded-full bg-[#5a5a5a]" />
                <div className="w-3 h-3 rounded-full bg-[#808080]" />
              </div>
              <p className="text-xs font-medium text-cloud-white">Calligraphy</p>
              <p className="text-[10px] text-mist-dark">Black &amp; grey</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setThemeStyle("sakura")}
              className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                themeStyle === "sakura"
                  ? "border-jade/50 bg-jade-deep/20 glow-subtle"
                  : "border-ink-light bg-ink-dark/50 hover:border-mist-mid"
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#faf6f5]" />
                <div className="w-3 h-3 rounded-full bg-[#f5d0d2]" />
                <div className="w-3 h-3 rounded-full bg-[#f5e0d0]" />
                <div className="w-3 h-3 rounded-full bg-[#b8c8d8]" />
              </div>
              <p className="text-xs font-medium text-cloud-white">Sakura</p>
              <p className="text-[10px] text-mist-dark">Cherry blossom</p>
            </motion.button>
          </div>

          <div className="flex gap-2">
            {[
              "bg-jade-glow",
              "bg-crimson",
              "bg-gold",
              "bg-mountain-blue-glow",
              "bg-ink-deep",
              "bg-mist-light",
            ].map((color) => (
              <div
                key={color}
                className={`w-6 h-6 rounded-full ${color} border border-ink-light transition-colors duration-500`}
              />
            ))}
          </div>
        </GlowCard>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2: DISPLAY — Matching popup layout
           ══════════════════════════════════════════════════════════ */}
        <GlowCard glow="jade" hoverable={false}>
          <h3 className="text-sm text-jade-glow uppercase tracking-wider mb-4">
            Display Settings
          </h3>
          <p className="text-xs text-mist-dark mb-4">
            Configure technique display modes, compact layouts, and panel preferences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

            {/* ═══════════ Left Column ═══════════ */}
            <div className="space-y-5">

              {/* ── Technique Display Modes ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🎨</span>
                  <h4 className="text-[11px] font-semibold text-jade-glow uppercase tracking-wider">Technique Display</h4>
                  <div className="flex-1 h-px bg-ink-light/30" />
                </div>
                <div className="space-y-2.5 pl-1">
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Active Cards</span>
                    <select
                      value={settings.activeCardMode}
                      onChange={(e) => updateSettings({ activeCardMode: e.target.value as TechniqueDisplayMode })}
                      className="bg-ink-dark border border-ink-light rounded-md px-2 py-1 text-[11px] text-cloud-white cursor-pointer hover:border-jade/40 focus:border-jade-glow/60 focus:outline-none transition-colors appearance-none pr-6"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
                    >
                      <option value="name-only">Name Only</option>
                      <option value="name-illumination">Name + Illumination</option>
                      <option value="name-illumination-realm">Name + Illumination + Realm</option>
                      <option value="name-illumination-realm-path">Full Treatment</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Recent Sessions</span>
                    <select
                      value={settings.recentSessionsMode}
                      onChange={(e) => updateSettings({ recentSessionsMode: e.target.value as TechniqueDisplayMode })}
                      className="bg-ink-dark border border-ink-light rounded-md px-2 py-1 text-[11px] text-cloud-white cursor-pointer hover:border-jade/40 focus:border-jade-glow/60 focus:outline-none transition-colors appearance-none pr-6"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
                    >
                      <option value="name-only">Name Only</option>
                      <option value="name-illumination">Name + Illumination</option>
                      <option value="name-illumination-realm">Name + Illumination + Realm</option>
                      <option value="name-illumination-realm-path">Full Treatment</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Sidebar</span>
                    <select
                      value={settings.sidebarMode}
                      onChange={(e) => updateSettings({ sidebarMode: e.target.value as TechniqueDisplayMode })}
                      className="bg-ink-dark border border-ink-light rounded-md px-2 py-1 text-[11px] text-cloud-white cursor-pointer hover:border-jade/40 focus:border-jade-glow/60 focus:outline-none transition-colors appearance-none pr-6"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
                    >
                      <option value="name-only">Name Only</option>
                      <option value="name-illumination">Name + Illumination</option>
                      <option value="name-illumination-realm">Name + Illumination + Realm</option>
                      <option value="name-illumination-realm-path">Full Treatment</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Visual Style ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">✨</span>
                  <h4 className="text-[11px] font-semibold text-jade-glow uppercase tracking-wider">Visual Style</h4>
                  <div className="flex-1 h-px bg-ink-light/30" />
                </div>
                <div className="space-y-2.5 pl-1">
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Active Card Style</span>
                    <div className="flex rounded-md border border-ink-light overflow-hidden">
                      {([{ value: "default", label: "Default" }, { value: "scroll-card", label: "Scroll" }]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSettings({ activeCardStyle: opt.value as ActiveCardStyle })}
                          className={`px-2.5 py-1 text-[10px] font-medium transition-all ${
                            settings.activeCardStyle === opt.value
                              ? "bg-jade-deep/30 text-jade-glow border-jade-glow/30"
                              : "text-mist-dark hover:text-mist-light hover:bg-ink-mid/20"
                          } ${opt.value !== "default" ? "border-l border-ink-light" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Sidebar Style</span>
                    <div className="flex rounded-md border border-ink-light overflow-hidden">
                      {([{ value: "default", label: "Default" }, { value: "scroll-card", label: "Scroll" }]).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSettings({ sidebarStyle: opt.value as ActiveCardStyle })}
                          className={`px-2.5 py-1 text-[10px] font-medium transition-all ${
                            settings.sidebarStyle === opt.value
                              ? "bg-jade-deep/30 text-jade-glow border-jade-glow/30"
                              : "text-mist-dark hover:text-mist-light hover:bg-ink-mid/20"
                          } ${opt.value !== "default" ? "border-l border-ink-light" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Sessions Layout</span>
                    <div className="flex rounded-md border border-ink-light overflow-hidden">
                      {([{ value: "auto", label: "Auto" }, { value: "compact", label: "Compact" }, { value: "full", label: "Full" }]).map((opt, idx) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSettings({ recentSessionsCompact: opt.value as RecentSessionsCompactMode })}
                          className={`px-2.5 py-1 text-[10px] font-medium transition-all ${
                            settings.recentSessionsCompact === opt.value
                              ? "bg-jade-deep/30 text-jade-glow border-jade-glow/30"
                              : "text-mist-dark hover:text-mist-light hover:bg-ink-mid/20"
                          } ${idx > 0 ? "border-l border-ink-light" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Content & Details ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">📜</span>
                  <h4 className="text-[11px] font-semibold text-jade-glow uppercase tracking-wider">Content & Details</h4>
                  <div className="flex-1 h-px bg-ink-light/30" />
                </div>
                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Compact cards</span>
                    <button type="button" role="switch" aria-checked={settings.activeCardCompact} onClick={() => updateSettings({ activeCardCompact: !settings.activeCardCompact })} className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors ${settings.activeCardCompact ? "bg-jade-glow" : "bg-ink-light"}`}>
                      <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-cloud-white shadow transition-transform ${settings.activeCardCompact ? "translate-x-[14px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Always show notes</span>
                    <button type="button" role="switch" aria-checked={settings.activeCardNotesAlwaysVisible} onClick={() => updateSettings({ activeCardNotesAlwaysVisible: !settings.activeCardNotesAlwaysVisible })} className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors ${settings.activeCardNotesAlwaysVisible ? "bg-jade-glow" : "bg-ink-light"}`}>
                      <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-cloud-white shadow transition-transform ${settings.activeCardNotesAlwaysVisible ? "translate-x-[14px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Card lore text</span>
                    <button type="button" role="switch" aria-checked={settings.activeCardLoreVisible ?? true} onClick={() => updateSettings({ activeCardLoreVisible: !(settings.activeCardLoreVisible ?? true) })} className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors ${(settings.activeCardLoreVisible ?? true) ? "bg-jade-glow" : "bg-ink-light"}`}>
                      <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-cloud-white shadow transition-transform ${(settings.activeCardLoreVisible ?? true) ? "translate-x-[14px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Sidebar lore text</span>
                    <button type="button" role="switch" aria-checked={settings.sidebarLoreVisible ?? true} onClick={() => updateSettings({ sidebarLoreVisible: !(settings.sidebarLoreVisible ?? true) })} className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors ${(settings.sidebarLoreVisible ?? true) ? "bg-jade-glow" : "bg-ink-light"}`}>
                      <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-cloud-white shadow transition-transform ${(settings.sidebarLoreVisible ?? true) ? "translate-x-[14px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════ Right Column ═══════════ */}
            <div className="space-y-5">

              {/* ── Illumination ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">💡</span>
                  <h4 className="text-[11px] font-semibold text-jade-glow uppercase tracking-wider">Illumination</h4>
                  <div className="flex-1 h-px bg-ink-light/30" />
                </div>
                <div className="space-y-1 pl-1">
                  <div className="py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-mist-light">Active Cards</span>
                      <span className="text-[10px] text-jade-glow font-medium tabular-nums w-8 text-right">{settings.glowIntensityActiveCards ?? 100}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="5" value={settings.glowIntensityActiveCards ?? 100} onChange={(e) => updateSettings({ glowIntensityActiveCards: parseInt(e.target.value) })} className="w-full h-1 bg-ink-light rounded-full appearance-none cursor-pointer accent-jade-glow" />
                  </div>
                  <div className="py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-mist-light">Recent Sessions</span>
                      <span className="text-[10px] text-jade-glow font-medium tabular-nums w-8 text-right">{settings.glowIntensityRecentSessions ?? 100}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="5" value={settings.glowIntensityRecentSessions ?? 100} onChange={(e) => updateSettings({ glowIntensityRecentSessions: parseInt(e.target.value) })} className="w-full h-1 bg-ink-light rounded-full appearance-none cursor-pointer accent-jade-glow" />
                  </div>
                  <div className="py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-mist-light">Sidebar</span>
                      <span className="text-[10px] text-jade-glow font-medium tabular-nums w-8 text-right">{settings.glowIntensitySidebar ?? 100}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="5" value={settings.glowIntensitySidebar ?? 100} onChange={(e) => updateSettings({ glowIntensitySidebar: parseInt(e.target.value) })} className="w-full h-1 bg-ink-light rounded-full appearance-none cursor-pointer accent-jade-glow" />
                  </div>
                  <div className="flex justify-between text-[9px] text-mist-dark pt-0.5 px-0.5">
                    <span>None</span>
                    <span>Subtle</span>
                    <span>Full</span>
                  </div>
                </div>
              </div>

              {/* ── Layout ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">📐</span>
                  <h4 className="text-[11px] font-semibold text-jade-glow uppercase tracking-wider">Layout</h4>
                  <div className="flex-1 h-px bg-ink-light/30" />
                </div>
                <div className="space-y-2.5 pl-1">
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Panel Position</span>
                    <div className="flex rounded-md border border-ink-light overflow-hidden">
                      {([{ value: "left", label: "◧ Left" }, { value: "right", label: "◨ Right" }]).map((opt, idx) => (
                        <button
                          key={opt.value}
                          onClick={() => updateSettings({ sidebarPosition: opt.value as "left" | "right" })}
                          className={`px-2.5 py-1 text-[10px] font-medium transition-all ${
                            settings.sidebarPosition === opt.value
                              ? "bg-jade-deep/30 text-jade-glow border-jade-glow/30"
                              : "text-mist-dark hover:text-mist-light hover:bg-ink-mid/20"
                          } ${idx > 0 ? "border-l border-ink-light" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[11px] text-mist-light shrink-0">Quick View panel</span>
                    <button type="button" role="switch" aria-checked={settings.rightPanelVisible} onClick={() => updateSettings({ rightPanelVisible: !settings.rightPanelVisible })} className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors ${settings.rightPanelVisible ? "bg-jade-glow" : "bg-ink-light"}`}>
                      <span className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-cloud-white shadow transition-transform ${settings.rightPanelVisible ? "translate-x-[14px]" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="pt-4 mt-5 border-t border-ink-light/30">
            <button
              onClick={resetSettings}
              className="w-full text-xs text-mist-dark hover:text-mist-light py-2 rounded-lg border border-ink-light hover:border-mist-dark transition-colors"
            >
              Reset Display Settings to Defaults
            </button>
          </div>
        </GlowCard>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2.5: DISPLAY PRESETS — Save, Load, Manage
           ══════════════════════════════════════════════════════════ */}
        <GlowCard glow="jade" hoverable={false}>
          <h3 className="text-sm text-jade-glow uppercase tracking-wider mb-2">
            Display Presets
          </h3>
          <p className="text-xs text-mist-dark mb-4">
            Save your current display configuration to a preset slot for quick recall. Each slot stores the complete state of all display settings above.
          </p>
          <PresetSlots variant="full" />
        </GlowCard>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3: PREFERENCES — Date, Viewport
           ══════════════════════════════════════════════════════════ */}
        <GlowCard glow="blue" hoverable={false}>
          <h3 className="text-sm text-mountain-blue-glow uppercase tracking-wider mb-4">
            Preferences
          </h3>

          {/* Viewport Mode */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cloud-white">Viewport Mode</p>
                <p className="text-xs text-mist-dark">
                  Control responsive behavior or force a specific layout
                </p>
              </div>
              <div className="flex gap-2">
                <GlowButton
                  variant={viewportMode === "auto" ? "blue" : "ghost"}
                  size="sm"
                  className="text-[11px]"
                  onClick={() => setViewportMode("auto")}
                >
                  Auto
                </GlowButton>
                <GlowButton
                  variant={viewportMode === "desktop" ? "blue" : "ghost"}
                  size="sm"
                  className="text-[11px]"
                  onClick={() => setViewportMode("desktop")}
                >
                  Desktop
                </GlowButton>
                <GlowButton
                  variant={viewportMode === "mobile" ? "blue" : "ghost"}
                  size="sm"
                  className="text-[11px]"
                  onClick={() => setViewportMode("mobile")}
                >
                  Mobile
                </GlowButton>
              </div>
            </div>
          </div>

          {/* Date Format */}
          <div className="pt-3 border-t border-ink-light/30">
            <p className="text-xs text-mist-light font-medium mb-2">Date Format</p>
            <p className="text-xs text-mist-dark mb-3">
              Choose how dates are displayed across the platform
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { value: "dd-mm-yyyy" as DateFormatOption, label: "DD-MM-YYYY", example: "24-02-2026" },
                { value: "dd-mmm-yyyy" as DateFormatOption, label: "DD-MMM-YYYY", example: "24-Feb-2026" },
                { value: "dd-mm-yy" as DateFormatOption, label: "DD-MM-YY", example: "24-02-26" },
                { value: "dd-mmm-yy" as DateFormatOption, label: "DD-MMM-YY", example: "24-Feb-26" },
              ]).map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => updateSettings({ dateFormat: fmt.value })}
                  className={`px-2.5 py-2 rounded-md border text-left transition-all ${
                    settings.dateFormat === fmt.value
                      ? "bg-jade-deep/30 border-jade-glow/50 text-jade-glow"
                      : "border-ink-light text-mist-dark hover:text-mist-light hover:border-mist-dark"
                  }`}
                >
                  <div className="text-[11px] font-medium">{fmt.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{fmt.example}</div>
                </button>
              ))}
            </div>
          </div>
        </GlowCard>

        {/* ══════════════════════════════════════════════════════════
            SECTION 4: NAVIGATION
           ══════════════════════════════════════════════════════════ */}
        <GlowCard glow="blue" hoverable={false}>
          <h3 className="text-sm text-mountain-blue-glow uppercase tracking-wider mb-4">
            Navigation Items
          </h3>
          <p className="text-xs text-mist-dark mb-3">
            Toggle visibility and pin frequently used sections
          </p>
          <div className="space-y-2">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between p-2 rounded-lg bg-ink-dark border border-ink-light"
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span
                    className={`text-sm ${
                      item.visible ? "text-cloud-white" : "text-mist-dark line-through"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleNavPin(item.id)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      item.pinned
                        ? "text-gold bg-gold-dim/20"
                        : "text-mist-dark hover:text-mist-light"
                    }`}
                  >
                    📌
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </div>
    </PageLayout>
  );
}
