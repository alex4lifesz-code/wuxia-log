"use client";

import { useState } from "react";
import { useDisplaySettings, PRESET_SLOT_COUNT } from "@/context/DisplaySettingsContext";

/* ──────────────────────────── Types ──────────────────────────── */

type PresetVariant = "compact" | "sidebar" | "full";

interface PresetSlotsProps {
  /** Visual variant: compact (popup), sidebar (right panel), full (settings page) */
  variant?: PresetVariant;
}

/* ──────────────────────────── Icons ──────────────────────────── */

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}

function LoadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

/* ──────────────────────────── Compact Variant (Popup) ──────────────────────────── */

function CompactPresetSlots() {
  const { presets, activePresetIndex, savePreset, loadPreset, clearPreset } = useDisplaySettings();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">💾</span>
        <h4 className="text-[11px] font-semibold text-jade-glow uppercase tracking-wider">Presets</h4>
        <div className="flex-1 h-px bg-ink-light/30" />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: PRESET_SLOT_COUNT }).map((_, i) => {
          const preset = presets[i];
          const isActive = activePresetIndex === i;
          const isEmpty = !preset;
          const isConfirmingDelete = confirmDelete === i;

          return (
            <div key={i} className="flex-1 group relative">
              {/* Slot button */}
              <button
                onClick={() => {
                  if (isConfirmingDelete) return;
                  if (isEmpty) {
                    savePreset(i, `Preset ${i + 1}`);
                  } else {
                    loadPreset(i);
                  }
                }}
                className={`w-full px-1.5 py-2 rounded-md border text-center transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "border-jade-glow/70 bg-jade-deep/30 text-jade-glow shadow-[0_0_8px_rgba(58,143,143,0.3)]"
                    : isEmpty
                    ? "border-ink-light/40 bg-ink-dark/30 text-mist-dark hover:border-mist-mid/40 hover:text-mist-light"
                    : "border-ink-light bg-ink-dark text-mist-light hover:border-jade/40 hover:text-jade-glow"
                }`}
                title={isEmpty ? `Save current to Slot ${i + 1}` : `Load "${preset.name}"`}
              >
                {/* Active glow indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-jade-glow/5 animate-pulse pointer-events-none" />
                )}
                <div className="text-[10px] font-semibold relative z-10">
                  {isEmpty ? (
                    <span className="opacity-50">—</span>
                  ) : (
                    <span className="truncate block">{i + 1}</span>
                  )}
                </div>
                <div className="text-[8px] mt-0.5 relative z-10 truncate">
                  {isEmpty ? "Empty" : preset.name}
                </div>
              </button>

              {/* Action buttons on hover (only for occupied slots) */}
              {!isEmpty && (
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePreset(i, preset.name);
                    }}
                    className="w-4 h-4 rounded-full bg-jade-deep border border-jade-glow/40 flex items-center justify-center hover:bg-jade-deep/80"
                    title="Overwrite with current settings"
                  >
                    <SaveIcon className="w-2.5 h-2.5 text-jade-glow" />
                  </button>
                  {isConfirmingDelete ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearPreset(i);
                        setConfirmDelete(null);
                      }}
                      className="w-4 h-4 rounded-full bg-crimson/30 border border-crimson-light/60 flex items-center justify-center animate-pulse"
                      title="Confirm delete"
                    >
                      <span className="text-[7px] text-crimson-light font-bold">✓</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(i);
                        setTimeout(() => setConfirmDelete(null), 3000);
                      }}
                      className="w-4 h-4 rounded-full bg-ink-dark border border-crimson/30 flex items-center justify-center hover:bg-crimson/20"
                      title="Delete this preset"
                    >
                      <DeleteIcon className="w-2.5 h-2.5 text-crimson-light/60" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────── Sidebar Variant (Right Panel) ──────────────────────────── */

function SidebarPresetSlots() {
  const { presets, activePresetIndex, loadPreset, savePreset } = useDisplaySettings();

  return (
    <div className="ink-border rounded-lg p-3 bg-ink-dark">
      <h3 className="text-[10px] text-jade-glow uppercase tracking-wider mb-2 font-semibold">💾 Saved Presets</h3>
      <div className="space-y-1">
        {Array.from({ length: PRESET_SLOT_COUNT }).map((_, i) => {
          const preset = presets[i];
          const isActive = activePresetIndex === i;
          const isEmpty = !preset;

          return (
            <button
              key={i}
              onClick={() => {
                if (isEmpty) {
                  savePreset(i, `Preset ${i + 1}`);
                } else {
                  loadPreset(i);
                }
              }}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-left group ${
                isActive
                  ? "bg-jade-deep/25 border border-jade-glow/50 shadow-[0_0_6px_rgba(58,143,143,0.2)]"
                  : isEmpty
                  ? "hover:bg-ink-mid/20 border border-transparent"
                  : "hover:bg-ink-mid/30 border border-transparent hover:border-ink-light/40"
              }`}
              title={isEmpty ? `Save current settings to Slot ${i + 1}` : `Load "${preset.name}"`}
            >
              {/* Slot indicator */}
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${
                isActive
                  ? "bg-jade-glow/20 text-jade-glow border border-jade-glow/40"
                  : isEmpty
                  ? "bg-ink-light/20 text-mist-dark/50 border border-ink-light/20"
                  : "bg-ink-mid/40 text-mist-light border border-ink-light/30"
              }`}>
                {i + 1}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] truncate ${
                  isActive ? "text-jade-glow font-medium" : isEmpty ? "text-mist-dark/60 italic" : "text-mist-light"
                }`}>
                  {isEmpty ? "Empty Slot" : preset.name}
                </div>
              </div>

              {/* Status icon */}
              <div className="shrink-0">
                {isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-jade-glow animate-pulse" />
                ) : isEmpty ? (
                  <SaveIcon className="w-3 h-3 text-mist-dark/30 group-hover:text-mist-dark/60 transition-colors" />
                ) : (
                  <LoadIcon className="w-3 h-3 text-mist-dark/40 group-hover:text-jade-glow/60 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────── Full Variant (Settings Page) ──────────────────────────── */

function FullPresetSlots() {
  const { presets, activePresetIndex, savePreset, loadPreset, clearPreset, renamePreset } = useDisplaySettings();
  const [editingName, setEditingName] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleStartRename = (i: number) => {
    const preset = presets[i];
    if (!preset) return;
    setEditingName(i);
    setNameInput(preset.name);
  };

  const handleFinishRename = (i: number) => {
    if (nameInput.trim()) {
      renamePreset(i, nameInput.trim());
    }
    setEditingName(null);
    setNameInput("");
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: PRESET_SLOT_COUNT }).map((_, i) => {
        const preset = presets[i];
        const isActive = activePresetIndex === i;
        const isEmpty = !preset;
        const isConfirmingDelete = confirmDelete === i;

        return (
          <div
            key={i}
            className={`rounded-lg border p-3 transition-all duration-200 ${
              isActive
                ? "border-jade-glow/50 bg-jade-deep/15 shadow-[0_0_12px_rgba(58,143,143,0.15)]"
                : isEmpty
                ? "border-ink-light/30 bg-ink-dark/30"
                : "border-ink-light/50 bg-ink-dark/50 hover:border-ink-light/70"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Slot number badge */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                isActive
                  ? "bg-jade-glow/20 text-jade-glow border border-jade-glow/40 shadow-[0_0_8px_rgba(58,143,143,0.25)]"
                  : isEmpty
                  ? "bg-ink-light/10 text-mist-dark/40 border border-ink-light/20"
                  : "bg-ink-mid/30 text-mist-light border border-ink-light/30"
              }`}>
                {i + 1}
              </div>

              {/* Name & metadata */}
              <div className="flex-1 min-w-0">
                {editingName === i ? (
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={() => handleFinishRename(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishRename(i);
                      if (e.key === "Escape") setEditingName(null);
                    }}
                    className="bg-ink-dark border border-jade-glow/40 rounded px-2 py-0.5 text-xs text-cloud-white w-full focus:outline-none focus:border-jade-glow/70"
                    maxLength={30}
                  />
                ) : (
                  <>
                    <div className={`text-xs font-medium ${
                      isActive ? "text-jade-glow" : isEmpty ? "text-mist-dark/50 italic" : "text-mist-light"
                    }`}>
                      {isEmpty ? "Empty Slot" : preset.name}
                      {isActive && (
                        <span className="ml-2 text-[9px] text-jade-glow/70 font-normal uppercase tracking-wider">● Active</span>
                      )}
                    </div>
                    {!isEmpty && (
                      <div className="text-[9px] text-mist-dark mt-0.5">
                        Saved {new Date(preset.savedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-1.5 shrink-0">
                {isEmpty ? (
                  <button
                    onClick={() => savePreset(i, `Preset ${i + 1}`)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md border border-jade-glow/30 bg-jade-deep/20 text-jade-glow hover:bg-jade-deep/40 hover:border-jade-glow/50 transition-all text-[10px] font-medium"
                  >
                    <SaveIcon className="w-3 h-3" />
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => loadPreset(i)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all text-[10px] font-medium ${
                        isActive
                          ? "border-jade-glow/50 bg-jade-deep/30 text-jade-glow"
                          : "border-ink-light/40 text-mist-light hover:border-jade/40 hover:text-jade-glow"
                      }`}
                      title="Load this preset"
                    >
                      <LoadIcon className="w-3 h-3" />
                      Load
                    </button>
                    <button
                      onClick={() => savePreset(i, preset.name)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md border border-ink-light/40 text-mist-dark hover:text-mist-light hover:border-ink-light transition-all text-[10px] font-medium"
                      title="Overwrite with current settings"
                    >
                      <SaveIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleStartRename(i)}
                      className="px-2 py-1 rounded-md border border-ink-light/40 text-mist-dark hover:text-mist-light hover:border-ink-light transition-all text-[10px]"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    {isConfirmingDelete ? (
                      <button
                        onClick={() => {
                          clearPreset(i);
                          setConfirmDelete(null);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-md border border-crimson-light/60 bg-crimson/20 text-crimson-light transition-all text-[10px] font-medium animate-pulse"
                      >
                        Confirm
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmDelete(i);
                          setTimeout(() => setConfirmDelete(null), 3000);
                        }}
                        className="px-2 py-1 rounded-md border border-ink-light/30 text-mist-dark/50 hover:text-crimson-light hover:border-crimson/30 transition-all text-[10px]"
                        title="Delete preset"
                      >
                        <DeleteIcon className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────── Main Export ──────────────────────────── */

export default function PresetSlots({ variant = "compact" }: PresetSlotsProps) {
  switch (variant) {
    case "sidebar":
      return <SidebarPresetSlots />;
    case "full":
      return <FullPresetSlots />;
    case "compact":
    default:
      return <CompactPresetSlots />;
  }
}
