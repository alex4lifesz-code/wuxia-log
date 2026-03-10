"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import { GlowModal } from "@/components/ui/GlowCard";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useDisplaySettings, TechniqueDisplayMode, RecentSessionsCompactMode, DateFormatOption, ActiveCardStyle } from "@/context/DisplaySettingsContext";
import PresetSlots from "@/components/ui/PresetSlots";
import * as XLSX from "xlsx";

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
  const { logout, user } = useAuth();
  const {
    navItems,
    toggleNavPin,
    isMobile,
    themeStyle,
    setThemeStyle,
    viewportMode,
    setViewportMode,
  } = useAppContext();
  const { settings, updateSettings, resetSettings } = useDisplaySettings();

  // Data management state
  const xlsxInputRef = useRef<HTMLInputElement>(null);
  const techniqueFileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [removeStatus, setRemoveStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Technique data management state
  const [showTechniqueImportModal, setShowTechniqueImportModal] = useState(false);
  const [techniqueImportText, setTechniqueImportText] = useState("");
  const [techniqueImportError, setTechniqueImportError] = useState("");
  const [techniqueImportStatus, setTechniqueImportStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [techniqueExportStatus, setTechniqueExportStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [removeTechniqueStatus, setRemoveTechniqueStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [showRemoveTechniqueConfirm, setShowRemoveTechniqueConfirm] = useState(false);

  // Training sessions export state
  const [sessionExportStatus, setSessionExportStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  // Check-in data management state
  const checkinXlsxInputRef = useRef<HTMLInputElement>(null);
  const [checkinImportStatus, setCheckinImportStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [checkinExportStatus, setCheckinExportStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [removeCheckinStatus, setRemoveCheckinStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [showRemoveCheckinConfirm, setShowRemoveCheckinConfirm] = useState(false);

  const handleXlsxImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setImportStatus({ type: "loading", message: "Parsing spreadsheet..." });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (rows.length === 0) {
        setImportStatus({ type: "error", message: "Spreadsheet is empty" });
        return;
      }

      // Map header names (case-insensitive)
      const sessions = rows.map((row) => {
        const get = (keys: string[]) => {
          for (const k of keys) {
            for (const rk of Object.keys(row)) {
              if (rk.toLowerCase().trim() === k.toLowerCase()) return row[rk];
            }
          }
          return "";
        };
        return {
          date: get(["date", "Date"]),
          exercise: get(["exercise", "Exercise", "name", "Name"]),
          w1: get(["w1", "W1", "weight1", "Weight1"]),
          r1: get(["r1", "R1", "reps1", "Reps1"]),
          w2: get(["w2", "W2", "weight2", "Weight2"]),
          r2: get(["r2", "R2", "reps2", "Reps2"]),
          w3: get(["w3", "W3", "weight3", "Weight3"]),
          r3: get(["r3", "R3", "reps3", "Reps3"]),
          notes: get(["notes", "Notes", "note", "Note"]),
        };
      });

      setImportStatus({ type: "loading", message: `Importing ${sessions.length} sessions...` });

      const res = await fetch("/api/workouts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, sessions }),
      });

      const result = await res.json();

      if (res.ok) {
        const msg = `Imported ${result.imported} session(s)${result.skipped ? `, ${result.skipped} skipped` : ""}`;
        setImportStatus({ type: "success", message: msg });
      } else {
        setImportStatus({ type: "error", message: result.error || "Import failed" });
      }
    } catch (err: any) {
      setImportStatus({ type: "error", message: err.message || "Failed to parse file" });
    } finally {
      // Reset file input so re-selecting the same file triggers onChange
      if (xlsxInputRef.current) xlsxInputRef.current.value = "";
    }
  };

  const handleRemoveAll = async () => {
    if (!user) return;
    setShowRemoveConfirm(false);
    setRemoveStatus({ type: "loading", message: "Removing all sessions..." });

    try {
      const res = await fetch("/api/workouts/import", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await res.json();

      if (res.ok) {
        setRemoveStatus({ type: "success", message: result.message || "All sessions removed" });
      } else {
        setRemoveStatus({ type: "error", message: result.error || "Failed to remove sessions" });
      }
    } catch (err: any) {
      setRemoveStatus({ type: "error", message: err.message || "An error occurred" });
    }
  };

  // ── Technique Import ──
  const handleTechniqueImport = async () => {
    setTechniqueImportError("");
    setTechniqueImportStatus({ type: "loading", message: "Importing..." });
    try {
      const data = JSON.parse(techniqueImportText);
      const exercises = Array.isArray(data) ? data : [data];

      const res = await fetch("/api/exercises/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises }),
      });

      if (res.ok) {
        const result = await res.json();
        const msg = `Imported ${result.imported} technique(s)${result.errors?.length ? `, ${result.errors.length} warning(s)` : ""}`;
        setTechniqueImportStatus({ type: "success", message: msg });
        setShowTechniqueImportModal(false);
        setTechniqueImportText("");
      } else {
        const err = await res.json();
        setTechniqueImportError(err.error || "Import failed");
        setTechniqueImportStatus({ type: "error", message: err.error || "Import failed" });
      }
    } catch {
      setTechniqueImportError("Invalid JSON format. Please check your scroll.");
      setTechniqueImportStatus({ type: "error", message: "Invalid JSON format" });
    }
  };

  const handleTechniqueFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTechniqueImportText(ev.target?.result as string);
    };
    reader.readAsText(file);
    if (techniqueFileInputRef.current) techniqueFileInputRef.current.value = "";
  };

  // ── Technique Export ──
  const handleTechniqueExport = async () => {
    setTechniqueExportStatus({ type: "loading", message: "Fetching techniques..." });
    try {
      const res = await fetch("/api/exercises");
      const data = await res.json();
      const exercises = data.exercises || [];

      if (exercises.length === 0) {
        setTechniqueExportStatus({ type: "error", message: "No techniques to export" });
        return;
      }

      const exportData = exercises.map((ex: any) => ({
        name: ex.name,
        ...(ex.originalName ? { originalName: ex.originalName } : {}),
        difficulty: ex.difficulty,
        type: ex.type,
        ...(ex.story ? { story: ex.story } : {}),
        ...(ex.targetGroup ? { targetGroup: ex.targetGroup } : {}),
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `techniques-library-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setTechniqueExportStatus({ type: "success", message: `Exported ${exercises.length} technique(s)` });
    } catch (err: any) {
      setTechniqueExportStatus({ type: "error", message: err.message || "Export failed" });
    }
  };

  // ── Remove All Techniques ──
  const handleRemoveAllTechniques = async () => {
    setShowRemoveTechniqueConfirm(false);
    setRemoveTechniqueStatus({ type: "loading", message: "Removing all techniques..." });
    try {
      const res = await fetch("/api/exercises", { method: "DELETE" });
      const result = await res.json();
      if (res.ok) {
        setRemoveTechniqueStatus({ type: "success", message: result.message || "All techniques removed" });
      } else {
        setRemoveTechniqueStatus({ type: "error", message: result.error || "Failed to remove techniques" });
      }
    } catch (err: any) {
      setRemoveTechniqueStatus({ type: "error", message: err.message || "An error occurred" });
    }
  };

  // ── Export Training Sessions ──
  const handleExportSessions = async () => {
    if (!user) return;
    setSessionExportStatus({ type: "loading", message: "Fetching sessions..." });
    try {
      const res = await fetch(`/api/workouts?userId=${user.id}`);
      const data = await res.json();
      const workouts = data.workouts || [];

      if (workouts.length === 0) {
        setSessionExportStatus({ type: "error", message: "No sessions to export" });
        return;
      }

      // Build flat rows for XLSX
      const rows = workouts.flatMap((w: any) =>
        (w.simplifiedExercises || []).map((se: any) => ({
          Date: w.date ? new Date(w.date).toISOString().split("T")[0] : "",
          Exercise: se.exercise?.name || "Unknown",
          W1: se.weight1 ?? "",
          R1: se.reps1 ?? "",
          W2: se.weight2 ?? "",
          R2: se.reps2 ?? "",
          W3: se.weight3 ?? "",
          R3: se.reps3 ?? "",
          Notes: se.notes || "",
        }))
      );

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Training Sessions");
      XLSX.writeFile(wb, `training-sessions-${new Date().toISOString().split("T")[0]}.xlsx`);
      setSessionExportStatus({ type: "success", message: `Exported ${rows.length} record(s)` });
    } catch (err: any) {
      setSessionExportStatus({ type: "error", message: err.message || "Export failed" });
    }
  };

  // ── Check-In XLSX Import ──
  const handleCheckinXlsxImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCheckinImportStatus({ type: "loading", message: "Parsing spreadsheet..." });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (rows.length === 0) {
        setCheckinImportStatus({ type: "error", message: "Spreadsheet is empty" });
        return;
      }

      // Fetch all users to map names to IDs
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const allUsers: { id: string; name: string; username: string }[] = usersData.users || [];

      // Build a lowercase name -> user map
      const nameToUser = new Map<string, { id: string; name: string }>();
      for (const u of allUsers) {
        nameToUser.set(u.name.toLowerCase(), u);
        nameToUser.set(u.username.toLowerCase(), u);
      }

      setCheckinImportStatus({ type: "loading", message: `Importing ${rows.length} check-in records...` });

      // Detect user columns and weight columns from headers
      const headers = Object.keys(rows[0]);
      // Known non-user headers (case-insensitive)
      const reservedHeaders = new Set(["date", "day", "comments", "comment"]);
      // Weight column pattern: "X.Weight" or "X.Wt" or specific like "A.Weight"
      const weightColRegex = /^(.+?)\.\s*w(?:eight|t)$/i;

      // Identify user columns (checkbox columns) and weight columns
      const userColumns: { header: string; userId: string }[] = [];
      const weightColumns: { header: string; userId: string; nameKey: string }[] = [];

      for (const h of headers) {
        const hLower = h.toLowerCase().trim();
        if (reservedHeaders.has(hLower)) continue;

        const weightMatch = h.match(weightColRegex);
        if (weightMatch) {
          // This is a weight column — try to match the prefix to a user
          const prefix = weightMatch[1].trim().toLowerCase();
          // Try exact match, then first-letter match
          let matchedUser = nameToUser.get(prefix);
          if (!matchedUser) {
            for (const u of allUsers) {
              if (u.name.toLowerCase().startsWith(prefix) || u.name.charAt(0).toLowerCase() === prefix) {
                matchedUser = u;
                break;
              }
            }
          }
          if (matchedUser) {
            weightColumns.push({ header: h, userId: matchedUser.id, nameKey: prefix });
          }
        } else {
          // Try to match as a user name column (checkbox)
          let matchedUser = nameToUser.get(hLower);
          if (!matchedUser) {
            for (const u of allUsers) {
              if (u.name.toLowerCase().startsWith(hLower) || u.name.toLowerCase() === hLower) {
                matchedUser = u;
                break;
              }
            }
          }
          if (matchedUser) {
            userColumns.push({ header: h, userId: matchedUser.id });
          }
        }
      }

      // Helper to get column value case-insensitively
      const getCol = (row: Record<string, any>, keys: string[]) => {
        for (const k of keys) {
          for (const rk of Object.keys(row)) {
            if (rk.toLowerCase().trim() === k.toLowerCase()) return row[rk];
          }
        }
        return "";
      };

      let imported = 0;
      let skipped = 0;

      for (const row of rows) {
        let dateRaw = getCol(row, ["date", "Date"]);
        if (!dateRaw) { skipped++; continue; }

        // Convert Excel serial date numbers to string
        if (typeof dateRaw === "number") {
          const excelEpoch = new Date(1899, 11, 30);
          const d = new Date(excelEpoch.getTime() + dateRaw * 86400000);
          dateRaw = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        } else {
          dateRaw = String(dateRaw).trim();
          // Try to parse various date formats
          if (dateRaw.includes("/")) {
            const parts = dateRaw.split("/");
            if (parts.length === 3) {
              const [m, d, y] = parts;
              dateRaw = `${y.length === 2 ? "20" + y : y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            }
          }
        }

        const comments = String(getCol(row, ["comments", "Comments", "comment", "Comment"]) || "");

        const entries: Record<string, { present: boolean; weight: string; comment: string }> = {};

        for (const uc of userColumns) {
          const val = row[uc.header];
          const present = val === true || val === 1 || val === "1" || val === "TRUE" || val === "true" || val === "Yes" || val === "yes" || val === "Y" || val === "y" || val === "✓" || val === "x" || val === "X";
          entries[uc.userId] = { present, weight: "", comment: comments };
        }

        for (const wc of weightColumns) {
          const val = row[wc.header];
          if (entries[wc.userId]) {
            entries[wc.userId].weight = val ? String(val) : "";
          } else {
            entries[wc.userId] = { present: false, weight: val ? String(val) : "", comment: comments };
          }
        }

        if (Object.keys(entries).length === 0) { skipped++; continue; }

        try {
          await fetch("/api/checkins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: dateRaw, entries }),
          });
          imported++;
        } catch {
          skipped++;
        }
      }

      const msg = `Imported ${imported} check-in record(s)${skipped ? `, ${skipped} skipped` : ""}`;
      setCheckinImportStatus({ type: "success", message: msg });
    } catch (err: any) {
      setCheckinImportStatus({ type: "error", message: err.message || "Failed to parse file" });
    } finally {
      if (checkinXlsxInputRef.current) checkinXlsxInputRef.current.value = "";
    }
  };

  // ── Check-In XLSX Export ──
  const handleCheckinExport = async () => {
    setCheckinExportStatus({ type: "loading", message: "Fetching check-in data..." });
    try {
      const [checkinsRes, usersRes] = await Promise.all([
        fetch("/api/checkins"),
        fetch("/api/users"),
      ]);
      const checkinsData = await checkinsRes.json();
      const usersData = await usersRes.json();
      const allUsers: { id: string; name: string }[] = usersData.users || [];
      const checkins = checkinsData.checkins || [];

      if (checkins.length === 0) {
        setCheckinExportStatus({ type: "error", message: "No check-in data to export" });
        return;
      }

      // Group by date
      const grouped: Record<string, Record<string, { present: boolean; weight?: number; comment?: string }>> = {};
      for (const ci of checkins) {
        const date = ci.date.split("T")[0];
        if (!grouped[date]) grouped[date] = {};
        grouped[date][ci.userId] = {
          present: ci.present,
          weight: ci.weight,
          comment: ci.comment,
        };
      }

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

      const exportRows = sortedDates.map(date => {
        const d = new Date(date + 'T00:00:00');
        const row: Record<string, any> = {
          Date: date,
          Day: dayNames[d.getDay()],
        };
        for (const u of allUsers) {
          const entry = grouped[date]?.[u.id];
          row[u.name] = entry?.present ? 1 : 0;
        }
        for (const u of allUsers) {
          const entry = grouped[date]?.[u.id];
          row[`${u.name.charAt(0)}.Weight`] = entry?.weight ?? "";
        }
        // Use first user's comment as shared comment
        const firstComment = allUsers.map(u => grouped[date]?.[u.id]?.comment).find(c => c) || "";
        row["Comments"] = firstComment;
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Check-In Records");
      XLSX.writeFile(wb, `checkin-records-${new Date().toISOString().split("T")[0]}.xlsx`);
      setCheckinExportStatus({ type: "success", message: `Exported ${exportRows.length} record(s)` });
    } catch (err: any) {
      setCheckinExportStatus({ type: "error", message: err.message || "Export failed" });
    }
  };

  // ── Remove All Check-Ins ──
  const handleRemoveAllCheckins = async () => {
    setShowRemoveCheckinConfirm(false);
    setRemoveCheckinStatus({ type: "loading", message: "Removing all check-in records..." });
    try {
      const res = await fetch("/api/checkins", { method: "DELETE" });
      const result = await res.json();
      if (res.ok) {
        setRemoveCheckinStatus({ type: "success", message: result.message || "All check-in records removed" });
      } else {
        setRemoveCheckinStatus({ type: "error", message: result.error || "Failed to remove check-in records" });
      }
    } catch (err: any) {
      setRemoveCheckinStatus({ type: "error", message: err.message || "An error occurred" });
    }
  };

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

        {/* ══════════════════════════════════════════════════════════
            SECTION 5: DATA MANAGEMENT — Import, Export, Purge
           ══════════════════════════════════════════════════════════ */}
        <GlowCard glow="crimson" hoverable={false}>
          <h3 className="text-sm text-crimson-glow uppercase tracking-wider mb-4">
            Data Management
          </h3>

          {/* ── Training Sessions Section ── */}
          <p className="text-xs text-mist-light font-medium mb-2">Training Sessions</p>
          <p className="text-xs text-mist-dark mb-3">
            Import historical training data from XLSX spreadsheets, export existing records, or purge all sessions.
            Expected columns: <span className="text-mist-light font-mono">Date, Exercise, W1, R1, W2, R2, W3, R3, Notes</span>
          </p>
          <div className="space-y-3">
            {/* Import XLSX */}
            <div className="flex items-center gap-3">
              <GlowButton
                variant="gold"
                size="sm"
                onClick={() => xlsxInputRef.current?.click()}
                disabled={importStatus.type === "loading"}
              >
                {importStatus.type === "loading" ? "Importing..." : "📥 Import XLSX"}
              </GlowButton>
              <input
                ref={xlsxInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleXlsxImport}
                className="hidden"
              />
              {importStatus.type !== "idle" && (
                <p className={`text-xs ${
                  importStatus.type === "success" ? "text-jade-glow" :
                  importStatus.type === "error" ? "text-crimson-light" :
                  "text-mist-light"
                }`}>
                  {importStatus.message}
                </p>
              )}
            </div>

            {/* Export Sessions */}
            <div className="flex items-center gap-3">
              <GlowButton
                variant="ghost"
                size="sm"
                onClick={handleExportSessions}
                disabled={sessionExportStatus.type === "loading"}
              >
                {sessionExportStatus.type === "loading" ? "Exporting..." : "📤 Export Sessions"}
              </GlowButton>
              {sessionExportStatus.type !== "idle" && (
                <p className={`text-xs ${
                  sessionExportStatus.type === "success" ? "text-jade-glow" :
                  sessionExportStatus.type === "error" ? "text-crimson-light" :
                  "text-mist-light"
                }`}>
                  {sessionExportStatus.message}
                </p>
              )}
            </div>

            {/* Remove All Sessions */}
            <div className="flex items-center gap-3 pt-2 border-t border-ink-light/30">
              <GlowButton
                variant="crimson"
                size="sm"
                onClick={() => setShowRemoveConfirm(true)}
                disabled={removeStatus.type === "loading"}
              >
                {removeStatus.type === "loading" ? "Removing..." : "🗑 Remove All Sessions"}
              </GlowButton>
              {removeStatus.type !== "idle" && (
                <p className={`text-xs ${
                  removeStatus.type === "success" ? "text-jade-glow" :
                  removeStatus.type === "error" ? "text-crimson-light" :
                  "text-mist-light"
                }`}>
                  {removeStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Sect Register (Check-In Records) Section ── */}
          <div className="mt-6 pt-4 border-t border-ink-light/50">
            <p className="text-xs text-mist-light font-medium mb-2">Sect Register (Check-In Records)</p>
            <p className="text-xs text-mist-dark mb-3">
              Import and export check-in attendance data. Expected XLSX columns:{" "}
              <span className="text-mist-light font-mono">Date, Day, [UserName], [UserName], X.Weight, Y.Weight, Comments</span>.
              User columns contain checkbox values (1/0). Names are matched to registered cultivators.
            </p>
            <div className="space-y-3">
              {/* Import Check-In XLSX */}
              <div className="flex items-center gap-3">
                <GlowButton
                  variant="gold"
                  size="sm"
                  onClick={() => checkinXlsxInputRef.current?.click()}
                  disabled={checkinImportStatus.type === "loading"}
                >
                  {checkinImportStatus.type === "loading" ? "Importing..." : "📥 Import Check-In XLSX"}
                </GlowButton>
                <input
                  ref={checkinXlsxInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleCheckinXlsxImport}
                  className="hidden"
                />
                {checkinImportStatus.type !== "idle" && (
                  <p className={`text-xs ${
                    checkinImportStatus.type === "success" ? "text-jade-glow" :
                    checkinImportStatus.type === "error" ? "text-crimson-light" :
                    "text-mist-light"
                  }`}>
                    {checkinImportStatus.message}
                  </p>
                )}
              </div>

              {/* Export Check-In Records */}
              <div className="flex items-center gap-3">
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={handleCheckinExport}
                  disabled={checkinExportStatus.type === "loading"}
                >
                  {checkinExportStatus.type === "loading" ? "Exporting..." : "📤 Export Check-In Records"}
                </GlowButton>
                {checkinExportStatus.type !== "idle" && (
                  <p className={`text-xs ${
                    checkinExportStatus.type === "success" ? "text-jade-glow" :
                    checkinExportStatus.type === "error" ? "text-crimson-light" :
                    "text-mist-light"
                  }`}>
                    {checkinExportStatus.message}
                  </p>
                )}
              </div>

              {/* Remove All Check-In Records */}
              <div className="flex items-center gap-3 pt-2 border-t border-ink-light/30">
                <GlowButton
                  variant="crimson"
                  size="sm"
                  onClick={() => setShowRemoveCheckinConfirm(true)}
                  disabled={removeCheckinStatus.type === "loading"}
                >
                  {removeCheckinStatus.type === "loading" ? "Removing..." : "🗑 Remove All Check-Ins"}
                </GlowButton>
                {removeCheckinStatus.type !== "idle" && (
                  <p className={`text-xs ${
                    removeCheckinStatus.type === "success" ? "text-jade-glow" :
                    removeCheckinStatus.type === "error" ? "text-crimson-light" :
                    "text-mist-light"
                  }`}>
                    {removeCheckinStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Technique Scroll Section ── */}
          <div className="mt-6 pt-4 border-t border-ink-light/50">
            <p className="text-xs text-mist-light font-medium mb-2">Technique Scroll</p>
            <p className="text-xs text-mist-dark mb-3">
              Import techniques from a JSON file, export your technique library, or purge all techniques.
            </p>
            <div className="space-y-3">
              {/* Import Techniques */}
              <div className="flex items-center gap-3">
                <GlowButton
                  variant="gold"
                  size="sm"
                  onClick={() => setShowTechniqueImportModal(true)}
                  disabled={techniqueImportStatus.type === "loading"}
                >
                  {techniqueImportStatus.type === "loading" ? "Importing..." : "📥 Import Techniques"}
                </GlowButton>
                {techniqueImportStatus.type !== "idle" && (
                  <p className={`text-xs ${
                    techniqueImportStatus.type === "success" ? "text-jade-glow" :
                    techniqueImportStatus.type === "error" ? "text-crimson-light" :
                    "text-mist-light"
                  }`}>
                    {techniqueImportStatus.message}
                  </p>
                )}
              </div>

              {/* Export Techniques */}
              <div className="flex items-center gap-3">
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={handleTechniqueExport}
                  disabled={techniqueExportStatus.type === "loading"}
                >
                  {techniqueExportStatus.type === "loading" ? "Exporting..." : "📤 Export Techniques"}
                </GlowButton>
                {techniqueExportStatus.type !== "idle" && (
                  <p className={`text-xs ${
                    techniqueExportStatus.type === "success" ? "text-jade-glow" :
                    techniqueExportStatus.type === "error" ? "text-crimson-light" :
                    "text-mist-light"
                  }`}>
                    {techniqueExportStatus.message}
                  </p>
                )}
              </div>

              {/* Remove All Techniques */}
              <div className="flex items-center gap-3 pt-2 border-t border-ink-light/30">
                <GlowButton
                  variant="crimson"
                  size="sm"
                  onClick={() => setShowRemoveTechniqueConfirm(true)}
                  disabled={removeTechniqueStatus.type === "loading"}
                >
                  {removeTechniqueStatus.type === "loading" ? "Removing..." : "🗑 Remove All Techniques"}
                </GlowButton>
                {removeTechniqueStatus.type !== "idle" && (
                  <p className={`text-xs ${
                    removeTechniqueStatus.type === "success" ? "text-jade-glow" :
                    removeTechniqueStatus.type === "error" ? "text-crimson-light" :
                    "text-mist-light"
                  }`}>
                    {removeTechniqueStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Remove All Sessions Confirmation Modal */}
      <GlowModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        title="Confirm Purge"
      >
        <div className="space-y-4">
          <p className="text-sm text-mist-light">
            This will permanently delete <span className="text-crimson-light font-semibold">all</span> of your recorded training sessions. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <GlowButton
              variant="crimson"
              glow
              className="flex-1"
              onClick={handleRemoveAll}
            >
              Confirm Remove All
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="flex-1"
              onClick={() => setShowRemoveConfirm(false)}
            >
              Cancel
            </GlowButton>
          </div>
        </div>
      </GlowModal>

      {/* Remove All Check-Ins Confirmation Modal */}
      <GlowModal
        isOpen={showRemoveCheckinConfirm}
        onClose={() => setShowRemoveCheckinConfirm(false)}
        title="Confirm Check-In Purge"
      >
        <div className="space-y-4">
          <p className="text-sm text-mist-light">
            This will permanently delete <span className="text-crimson-light font-semibold">all</span> check-in records from the Sect Register. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <GlowButton
              variant="crimson"
              glow
              className="flex-1"
              onClick={handleRemoveAllCheckins}
            >
              Confirm Remove All
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="flex-1"
              onClick={() => setShowRemoveCheckinConfirm(false)}
            >
              Cancel
            </GlowButton>
          </div>
        </div>
      </GlowModal>

      {/* Import Technique Scroll Modal */}
      <GlowModal
        isOpen={showTechniqueImportModal}
        onClose={() => {
          setShowTechniqueImportModal(false);
          setTechniqueImportError("");
        }}
        title="Import Technique Scroll"
      >
        <div className="space-y-3">
          <p className="text-xs text-mist-mid">
            Upload a JSON file or paste JSON data. Expected format:
          </p>
          <pre className="text-[10px] text-mist-dark bg-ink-dark p-3 rounded-lg overflow-x-auto">
            {`[{
  "name": "Technique Name",
  "difficulty": "Core Formation",
  "type": "Upper Heaven",
  "originalName": "Optional original name",
  "story": "Optional description...",
  "targetGroup": "Optional target group"
}]`}
          </pre>
          <p className="text-[10px] text-mist-dark">
            <span className="text-mist-light">Required:</span> name, difficulty, type.{" "}
            <span className="text-mist-light">Optional:</span> originalName, story, targetGroup.
          </p>

          <div className="flex gap-2">
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => techniqueFileInputRef.current?.click()}
            >
              📁 Choose File
            </GlowButton>
            <input
              ref={techniqueFileInputRef}
              type="file"
              accept=".json"
              onChange={handleTechniqueFileUpload}
              className="hidden"
            />
          </div>

          <textarea
            placeholder="Paste JSON here..."
            value={techniqueImportText}
            onChange={(e) => setTechniqueImportText(e.target.value)}
            rows={8}
            className="w-full bg-ink-dark border border-ink-light rounded-lg px-3 py-2 text-xs text-cloud-white font-mono placeholder:text-mist-dark outline-none transition-all duration-300 resize-none focus:border-gold focus:shadow-[0_0_12px_rgba(232,200,74,0.3)]"
          />

          {techniqueImportError && (
            <p className="text-xs text-crimson-light">{techniqueImportError}</p>
          )}

          <GlowButton variant="gold" glow className="w-full" onClick={handleTechniqueImport}>
            📥 Import Scroll
          </GlowButton>
        </div>
      </GlowModal>

      {/* Remove All Techniques Confirmation Modal */}
      <GlowModal
        isOpen={showRemoveTechniqueConfirm}
        onClose={() => setShowRemoveTechniqueConfirm(false)}
        title="Confirm Technique Purge"
      >
        <div className="space-y-4">
          <p className="text-sm text-mist-light">
            This will permanently delete <span className="text-crimson-light font-semibold">all</span> techniques from your Technique Scroll library. Associated workout data referencing these techniques will also be removed. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <GlowButton
              variant="crimson"
              glow
              className="flex-1"
              onClick={handleRemoveAllTechniques}
            >
              Confirm Remove All
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="flex-1"
              onClick={() => setShowRemoveTechniqueConfirm(false)}
            >
              Cancel
            </GlowButton>
          </div>
        </div>
      </GlowModal>
    </PageLayout>
  );
}
