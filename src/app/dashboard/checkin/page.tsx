"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import PageLayout from "@/components/layout/PageLayout";
import GlowButton from "@/components/ui/GlowButton";
import GlowInput from "@/components/ui/GlowInput";
import { GlowModal } from "@/components/ui/GlowCard";
import { useAuth } from "@/context/AuthContext";
import { useDisplaySettings } from "@/context/DisplaySettingsContext";
import { awardCheckInXP } from "@/lib/experience";
import { formatDateWithPreference } from "@/lib/constants";

interface User {
  id: string;
  name: string;
  username: string;
}

interface CheckInRow {
  date: string;
  entries: Record<
    string,
    { present: boolean; weight: string; comment: string }
  >;
}

interface DayNote {
  date: string;
  note: string;
  pinned?: boolean;
  userName?: string;
}

interface CommunityNote {
  id: string;
  date: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  user: { id: string; name: string; username: string };
}

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
}

function CheckInSidebar({
  onAddToday,
  onAddCustom,
  users,
  dayNotes,
  onToggleNotes,
  showNotesPanel,
}: {
  onAddToday: () => void;
  onAddCustom: () => void;
  users: User[];
  dayNotes: DayNote[];
  onToggleNotes: () => void;
  showNotesPanel: boolean;
}) {
  return (
    <div className="space-y-3">
      <GlowButton variant="jade" size="sm" className="w-full" onClick={onAddToday}>
        📅 Add Today&apos;s Date
      </GlowButton>
      <GlowButton variant="gold" size="sm" className="w-full" onClick={onAddCustom}>
        📆 Add Custom Date
      </GlowButton>
      <GlowButton 
        variant={showNotesPanel ? "jade" : "ghost"} 
        size="sm" 
        className="w-full" 
        onClick={onToggleNotes}
      >
        📝 {showNotesPanel ? "Hide" : "Show"} Day Notes {dayNotes.length > 0 && `(${dayNotes.length})`}
      </GlowButton>
      <GlowButton variant="ghost" size="sm" className="w-full">
        📊 Export Records
      </GlowButton>

      <div className="pt-4 border-t border-ink-light">
        <h3 className="text-xs text-mist-dark uppercase mb-2">
          Registered Cultivators
        </h3>
        <div className="space-y-1">
          {users.length === 0 ? (
            <p className="text-xs text-mist-dark italic">No cultivators yet</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="text-xs text-mist-light flex items-center gap-2 py-1"
              >
                <span className="w-2 h-2 bg-jade-glow rounded-full" />
                {user.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckInPage() {
  const { user } = useAuth();
  const { settings } = useDisplaySettings();
  const dateFormat = settings.dateFormat || "dd-mmm-yyyy";
  const [users, setUsers] = useState<User[]>([]);
  const [rows, setRows] = useState<CheckInRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpFeedback, setXpFeedback] = useState<{ show: boolean; xp: number; userId: string }>({
    show: false,
    xp: 0,
    userId: "",
  });
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [dayNotes, setDayNotes] = useState<DayNote[]>([]);
  const [editingNote, setEditingNote] = useState<{ date: string; note: string } | null>(null);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>([]);
  const [dateRange, setDateRange] = useState<"all" | "7" | "14" | "30" | "90" | "custom">("all");
  const [customRangeStart, setCustomRangeStart] = useState("");
  const [customRangeEnd, setCustomRangeEnd] = useState("");

  // Weight prompt state
  const [showWeightPrompt, setShowWeightPrompt] = useState(false);
  const [weightPromptValue, setWeightPromptValue] = useState("");

  const fetchCommunityNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/checkins/notes");
      const data = await res.json();
      setCommunityNotes(data.notes || []);
    } catch (err) {
      console.error("Failed to fetch community notes:", err);
    }
  }, []);

  const handleAddCommunityNote = async (date: string, content: string) => {
    if (!user || !content.trim()) return;
    try {
      const res = await fetch("/api/checkins/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, userId: user.id, content }),
      });
      if (res.ok) {
        fetchCommunityNotes();
      }
    } catch (err) {
      console.error("Failed to add community note:", err);
    }
  };

  const handleDeleteCommunityNote = async (noteId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/checkins/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, userId: user.id }),
      });
      if (res.ok) {
        setCommunityNotes(prev => prev.filter(n => n.id !== noteId));
      }
    } catch (err) {
      console.error("Failed to delete community note:", err);
    }
  };

  const handleTogglePinNote = async (noteId: string, pinned: boolean) => {
    if (!user) return;
    try {
      const res = await fetch("/api/checkins/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, userId: user.id, pinned }),
      });
      if (res.ok) {
        setCommunityNotes(prev =>
          prev.map(n => n.id === noteId ? { ...n, pinned } : n)
            .sort((a, b) => {
              if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
        );
      }
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, checkinsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/checkins"),
      ]);
      const usersData = await usersRes.json();
      const checkinsData = await checkinsRes.json();
      setUsers(usersData.users || []);

      // Group check-ins by date
      const grouped: Record<string, CheckInRow["entries"]> = {};
      for (const ci of checkinsData.checkins || []) {
        const date = ci.date.split("T")[0];
        if (!grouped[date]) grouped[date] = {};
        grouped[date][ci.userId] = {
          present: ci.present,
          weight: ci.weight?.toString() || "",
          comment: ci.comment || "",
        };
      }

      const sortedRows = Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, entries]) => ({ date, entries }));

      setRows(sortedRows);
    } catch (err) {
      console.error("Failed to fetch check-in data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchCommunityNotes();
  }, [fetchData, fetchCommunityNotes]);

  // Show weight prompt on page load if user hasn't logged weight today and hasn't dismissed
  useEffect(() => {
    if (loading || !user || rows.length === 0) return;
    try {
      const dismissed = localStorage.getItem("weight-prompt-dismissed");
      const today = formatDateLocal(new Date());
      if (dismissed === today) return;
      const todayRow = rows.find(r => r.date === today);
      const userEntry = todayRow?.entries[user.id];
      if (!userEntry?.weight) {
        setShowWeightPrompt(true);
      }
    } catch { /* ignore */ }
  }, [loading, user, rows]);

  const handleWeightPromptSubmit = async () => {
    if (!user || !weightPromptValue) return;
    const today = formatDateLocal(new Date());
    // Update local row state
    setRows(prev => prev.map(row => {
      if (row.date !== today) return row;
      const entry = row.entries[user.id] || { present: false, weight: "", comment: "" };
      return { ...row, entries: { ...row.entries, [user.id]: { ...entry, weight: weightPromptValue } } };
    }));
    // Save to API
    const todayRow = rows.find(r => r.date === today);
    const entry = todayRow?.entries[user.id] || { present: false, weight: "", comment: "" };
    const updatedEntry = { ...entry, weight: weightPromptValue };
    try {
      await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, entries: { [user.id]: updatedEntry } }),
      });
    } catch (err) {
      console.error("Failed to save weight:", err);
    }
    setShowWeightPrompt(false);
    setWeightPromptValue("");
  };

  const handleWeightPromptSkip = () => {
    setShowWeightPrompt(false);
    setWeightPromptValue("");
  };

  const handleWeightPromptDismissToday = () => {
    const today = formatDateLocal(new Date());
    localStorage.setItem("weight-prompt-dismissed", today);
    setShowWeightPrompt(false);
    setWeightPromptValue("");
  };

  // Load day notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cultivation-day-notes");
      if (saved) setDayNotes(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveDayNote = (date: string, note: string) => {
    setDayNotes(prev => {
      const filtered = prev.filter(n => n.date !== date);
      const updated = note.trim() ? [...filtered, { date, note: note.trim(), userName: user?.name || 'Unknown', pinned: prev.find(n => n.date === date)?.pinned || false }] : filtered;
      updated.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      });
      localStorage.setItem("cultivation-day-notes", JSON.stringify(updated));
      return updated;
    });
    setEditingNote(null);
  };

  const toggleDayNotePin = (date: string) => {
    setDayNotes(prev => {
      const updated = prev.map(n => n.date === date ? { ...n, pinned: !n.pinned } : n);
      updated.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      });
      localStorage.setItem("cultivation-day-notes", JSON.stringify(updated));
      return updated;
    });
  };

  const getDayNote = (date: string): string => {
    return dayNotes.find(n => n.date === date)?.note || "";
  };

  // Auto-generate today's date on first load
  useEffect(() => {
    const today = formatDateLocal(new Date());
    const hasToday = rows.some((r) => r.date === today);
    if (!loading && !hasToday && rows.length === 0) {
      setRows([{ date: today, entries: {} }]);
    }
  }, [loading]);

  const addTodayRow = () => {
    const today = formatDateLocal(new Date());
    if (rows.some((r) => r.date === today)) return;
    setRows([{ date: today, entries: {} }, ...rows]);
  };

  const addCustomDateRow = () => {
    if (!customDate || rows.some((r) => r.date === customDate)) {
      return;
    }
    setRows([{ date: customDate, entries: {} }, ...rows].sort((a, b) => b.date.localeCompare(a.date)));
    setShowCustomDateModal(false);
    setCustomDate("");
  };

  const updateCell = (
    date: string,
    userId: string,
    field: "present" | "weight" | "comment",
    value: string | boolean
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.date !== date) return row;
        const entry = row.entries[userId] || {
          present: false,
          weight: "",
          comment: "",
        };
        return {
          ...row,
          entries: {
            ...row.entries,
            [userId]: { ...entry, [field]: value },
          },
        };
      })
    );
  };

  // Auto-save when checkbox is toggled
  const handleCheckInToggle = async (
    date: string,
    userId: string,
    present: boolean
  ) => {
    // Update local state first
    updateCell(date, userId, "present", present);
    
    // Auto-save the check-in status
    if (!user) return;
    
    try {
      const row = rows.find((r) => r.date === date);
      const entries = {
        [userId]: {
          present,
          weight: row?.entries[userId]?.weight || "",
          comment: row?.entries[userId]?.comment || "",
        },
      };
      
      await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, entries }),
      });

      // Award XP only when checking in (not when unchecking)
      if (present && userId === user.id) {
        await awardCheckInXP(user.id);
        setXpFeedback({ show: true, xp: 15, userId: user.id });
        setTimeout(() => {
          setXpFeedback({ show: false, xp: 0, userId: "" });
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to auto-save check-in:", err);
    }
  };

  const saveRow = async (date: string) => {
    const row = rows.find((r) => r.date === date);
    if (!row || !user) return;

    try {
      const saveRes = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, entries: row.entries }),
      });

      if (!saveRes.ok) throw new Error("Failed to save check-in");

      // Award XP for the check-in
      const newExperience = await awardCheckInXP(user.id);
      
      // Show XP feedback
      setXpFeedback({
        show: true,
        xp: 15,
        userId: user.id,
      });

      // Hide feedback after 3 seconds
      setTimeout(() => {
        setXpFeedback({ show: false, xp: 0, userId: "" });
      }, 3000);
    } catch (err) {
      console.error("Failed to save check-in:", err);
    }
  };

  // Filter rows by date range
  const filteredRows = rows.filter((row) => {
    if (dateRange === "all") return true;
    if (dateRange === "custom") {
      if (customRangeStart && row.date < customRangeStart) return false;
      if (customRangeEnd && row.date > customRangeEnd) return false;
      return true;
    }
    const days = parseInt(dateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(row.date + "T00:00:00") >= cutoff;
  });

  // Total check-in counts per user
  const totalCheckIns = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.id] = rows.filter((r) => r.entries[u.id]?.present).length;
    return acc;
  }, {});

  return (
    <PageLayout
      title="Sect Register"
      subtitle="Record attendance and physical metrics of all cultivators"
      sidebar={<CheckInSidebar onAddToday={addTodayRow} onAddCustom={() => setShowCustomDateModal(true)} users={users} dayNotes={dayNotes} onToggleNotes={() => setShowNotesPanel(!showNotesPanel)} showNotesPanel={showNotesPanel} />}
      sidebarLabel="Check-In"
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            ☯
          </motion.div>
        </div>
      ) : (
        <>
          {xpFeedback.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-gradient-to-r from-jade-dark to-jade-glow/30 border border-jade-glow rounded-lg text-center text-jade-glow font-semibold flex items-center justify-center gap-2"
            >
              <span className="text-lg">✨</span>
              <span>+{xpFeedback.xp} XP Gained!</span>
              <span className="text-lg">✨</span>
            </motion.div>
          )}
          {/* Cultivation Journal — personal day notes */}
          {dayNotes.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="mb-4"
              >
                <div className="bg-ink-dark/60 border border-ink-light rounded-lg p-4">
                  <h3 className="text-xs text-gold-glow uppercase tracking-wider mb-3 flex items-center gap-2">
                    📝 Cultivation Journal
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {dayNotes.map((dn) => (
                      <motion.div
                        key={dn.date}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-start gap-2 text-xs group"
                      >
                        {dn.pinned && (
                          <span className="text-gold-glow shrink-0" title="Pinned">📌</span>
                        )}
                        <button
                          onClick={() => setEditingNote({ date: dn.date, note: dn.note })}
                          className="text-jade-glow font-mono shrink-0 hover:underline text-[10px]"
                        >
                          {dn.date}
                        </button>
                        {dn.userName && (
                          <span className="text-gold shrink-0 font-medium">{dn.userName}:</span>
                        )}
                        <span className="text-mist-light flex-1">{dn.note}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => toggleDayNotePin(dn.date)}
                            className={`hover:text-gold-glow transition-colors ${dn.pinned ? 'text-gold-glow' : 'text-mist-dark'}`}
                            title={dn.pinned ? "Unpin" : "Pin note"}
                          >
                            📌
                          </button>
                          <button
                            onClick={() => saveDayNote(dn.date, "")}
                            className="text-mist-dark hover:text-crimson-light transition-colors"
                            title="Delete note"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
          )}
          {/* Community Notes — attributed notes from sect members */}
          {communityNotes.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mb-4"
            >
              <div className="bg-ink-dark/60 border border-ink-light rounded-lg p-4">
                <h3 className="text-xs text-mountain-blue-glow uppercase tracking-wider mb-3 flex items-center gap-2">
                  🏯 Sect Member Notes
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {communityNotes.map((cn) => (
                    <motion.div
                      key={cn.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-start gap-2 text-xs group"
                    >
                      {cn.pinned && (
                        <span className="text-gold-glow shrink-0" title="Pinned">📌</span>
                      )}
                      <span className="text-jade-glow font-mono shrink-0 text-[10px]">{cn.date}</span>
                      <span className="text-gold shrink-0 font-medium">{cn.user.name}:</span>
                      <span className="text-mist-light flex-1">{cn.content}</span>
                      {user && cn.user.id === user.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => handleTogglePinNote(cn.id, !cn.pinned)}
                            className={`hover:text-gold-glow transition-colors ${cn.pinned ? 'text-gold-glow' : 'text-mist-dark'}`}
                            title={cn.pinned ? "Unpin" : "Pin note"}
                          >
                            📌
                          </button>
                          <button
                            onClick={() => handleDeleteCommunityNote(cn.id)}
                            className="text-mist-dark hover:text-crimson-light transition-colors"
                            title="Delete note"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div className="flex justify-center">
            <div className="overflow-x-auto w-full">
              {/* Date Range Filter */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] text-mist-dark uppercase tracking-wider">Range:</span>
                {([
                  ["all", "All"],
                  ["7", "7d"],
                  ["14", "14d"],
                  ["30", "30d"],
                  ["90", "90d"],
                  ["custom", "Custom"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setDateRange(value)}
                    className={`px-2 py-0.5 text-[10px] rounded border transition-all ${
                      dateRange === value
                        ? "bg-jade-deep/30 border-jade-glow/50 text-jade-light"
                        : "border-ink-light/50 text-mist-dark hover:text-mist-light hover:border-ink-light"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {dateRange === "custom" && (
                  <div className="flex items-center gap-1 ml-1">
                    <input
                      type="date"
                      value={customRangeStart}
                      onChange={(e) => setCustomRangeStart(e.target.value)}
                      className="bg-ink-dark border border-ink-light rounded px-1.5 py-0.5 text-[10px] text-cloud-white outline-none focus:border-jade-glow transition-colors"
                    />
                    <span className="text-mist-dark text-[10px]">to</span>
                    <input
                      type="date"
                      value={customRangeEnd}
                      onChange={(e) => setCustomRangeEnd(e.target.value)}
                      className="bg-ink-dark border border-ink-light rounded px-1.5 py-0.5 text-[10px] text-cloud-white outline-none focus:border-jade-glow transition-colors"
                    />
                  </div>
                )}
                <span className="text-[10px] text-mist-dark ml-auto">
                  {filteredRows.length} of {rows.length} records
                </span>
              </div>

              {/* Total Check-In Counts */}
              {users.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3 p-2 bg-ink-dark/40 rounded-lg border border-ink-light/30">
                  <span className="text-[10px] text-mist-dark uppercase tracking-wider self-center">Totals:</span>
                  {users.map((u) => (
                    <div key={u.id} className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-mist-light">{u.name}:</span>
                      <span className="text-jade-glow font-semibold">{totalCheckIns[u.id] || 0}</span>
                    </div>
                  ))}
                </div>
              )}

              <table className="mx-auto text-xs min-w-full border-collapse table-auto">
                <thead>
                  <tr className="border-b-2 border-jade-glow/50 bg-ink-mid/40">
                    <th className="px-2 py-2 text-left text-[11px] text-jade-glow uppercase tracking-wider font-semibold sticky left-0 bg-ink-mid/40 z-10 align-middle">
                      Date
                    </th>
                    {users.map((u) => (
                      <th
                        key={`header-check-${u.id}`}
                        colSpan={1}
                        className="px-2 py-2 text-center text-[11px] text-mist-light font-semibold align-middle"
                      >
                        {u.name}
                      </th>
                    ))}
                    {users.map((u) => (
                      <th
                        key={`header-weight-${u.id}`}
                        className="px-2 py-2 text-center text-[11px] text-mist-dark font-semibold align-middle"
                      >
                        {u.name} Wt
                      </th>
                    ))}
                    <th className="px-2 py-2 text-left text-[11px] text-mist-dark font-semibold align-middle">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3 + users.length * 2}
                        className="py-12 text-center text-mist-dark italic"
                      >
                        {rows.length === 0 ? "No records yet. Check-in records will be created automatically." : "No records match the selected date range."}
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, rowIdx) => (
                      <motion.tr
                        key={row.date}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIdx * 0.05 }}
                        className="border-b border-ink-light/50 hover:bg-ink-dark/50 transition-colors"
                      >
                        <td className="px-2 py-1.5 text-cloud-white font-mono text-xs sticky left-0 bg-void-black align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingNote({ date: row.date, note: getDayNote(row.date) })}
                              className="hover:text-jade-glow transition-colors text-left group/date"
                              title="Click to add/edit day note"
                            >
                              <div className="flex flex-col leading-tight">
                                <span className="tracking-normal">{formatDateWithPreference(row.date, dateFormat)}</span>
                                <span className="text-[9px] text-mist-dark">{formatDateDisplay(row.date)}</span>
                              </div>
                            </button>
                            {getDayNote(row.date) && (
                              <span className="text-[10px] text-gold-glow" title={getDayNote(row.date)}>📝</span>
                            )}
                          </div>
                        </td>
                        {users.map((u) => (
                          <td
                            key={`check-${row.date}-${u.id}`}
                            className="px-2 py-1.5 text-center align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={row.entries[u.id]?.present || false}
                              onChange={(e) =>
                                handleCheckInToggle(
                                  row.date,
                                  u.id,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 accent-jade-glow cursor-pointer"
                            />
                          </td>
                        ))}
                        {users.map((u) => (
                          <td
                            key={`weight-${row.date}-${u.id}`}
                            className="px-2 py-1.5 align-middle"
                          >
                            <input
                              type="number"
                              step="0.1"
                              placeholder="—"
                              value={row.entries[u.id]?.weight || ""}
                              onChange={(e) => {
                                updateCell(
                                  row.date,
                                  u.id,
                                  "weight",
                                  e.target.value
                                );
                                // Award XP when weight is entered
                                if (e.target.value && u.id === user?.id) {
                                  (async () => {
                                    try {
                                      await awardCheckInXP(u.id);
                                      setXpFeedback({ show: true, xp: 10, userId: u.id });
                                      setTimeout(() => {
                                        setXpFeedback({ show: false, xp: 0, userId: "" });
                                      }, 2000);
                                    } catch (err) {
                                      console.error("Failed to award XP:", err);
                                    }
                                  })();
                                }
                              }}
                              className="w-20 bg-transparent border-b border-ink-light text-center text-xs text-cloud-white focus:border-jade-glow outline-none transition-colors px-1"
                            />
                          </td>
                        ))}
                        <td className="px-2 py-1.5 align-middle">
                          <input
                            type="text"
                            placeholder="Notes..."
                            value={
                              row.entries[users[0]?.id]?.comment || ""
                            }
                            onChange={(e) => {
                              if (users[0]) {
                                updateCell(
                                  row.date,
                                  users[0].id,
                                  "comment",
                                  e.target.value
                                );
                              }
                            }}
                            className="w-full min-w-[150px] bg-transparent border-b border-ink-light text-xs text-mist-light placeholder-mist-dark focus:border-jade-glow outline-none transition-colors px-1"
                          />
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Day Note Modal */}
      <GlowModal
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        title={`Day Note — ${editingNote ? formatDateWithPreference(editingNote.date, dateFormat) : ""}`}
      >
        <div className="space-y-4">
          {editingNote && (
            <>
              <p className="text-xs text-mist-dark">{formatDateDisplay(editingNote.date)}</p>
              <div>
                <label className="block text-xs text-mist-light uppercase tracking-wider mb-2">
                  Cultivation Notes
                </label>
                <textarea
                  value={editingNote.note}
                  onChange={(e) => setEditingNote({ ...editingNote, note: e.target.value })}
                  placeholder="Record training observations, energy levels, insights..."
                  rows={4}
                  className="w-full bg-ink-dark border border-jade-glow/30 rounded-lg px-3 py-2 text-cloud-white text-sm outline-none focus:border-jade-glow transition-colors resize-none placeholder:text-mist-dark"
                />
              </div>
              <div className="flex gap-2">
                <GlowButton
                  variant="jade"
                  glow
                  className="flex-1"
                  onClick={() => saveDayNote(editingNote.date, editingNote.note)}
                >
                  ✓ Save Note
                </GlowButton>
                {getDayNote(editingNote.date) && (
                  <GlowButton
                    variant="ghost"
                    className="text-crimson-light"
                    onClick={() => saveDayNote(editingNote.date, "")}
                  >
                    🗑 Delete
                  </GlowButton>
                )}
              </div>
            </>
          )}
        </div>
      </GlowModal>

      {/* Weight Prompt Modal */}
      <GlowModal
        isOpen={showWeightPrompt}
        onClose={() => { setShowWeightPrompt(false); setWeightPromptValue(""); }}
        title="⚖️ Log Your Weight"
      >
        <div className="space-y-4">
          <p className="text-xs text-mist-mid">
            You haven&apos;t logged your weight today. Tracking your weight helps monitor your cultivation progress.
          </p>
          <div>
            <label className="block text-[10px] text-jade-glow uppercase tracking-wider mb-1.5">Body Weight (lbs)</label>
            <input
              type="number"
              placeholder="Enter your weight..."
              value={weightPromptValue}
              onChange={(e) => setWeightPromptValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && weightPromptValue) handleWeightPromptSubmit();
              }}
              className="w-full bg-ink-deep border border-ink-light rounded-lg px-4 py-3 text-sm text-cloud-white placeholder-mist-dark outline-none focus:border-jade-glow transition-colors text-center"
              min="0"
              max="1000"
              step="0.1"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <GlowButton
              variant="jade"
              glow
              className="w-full"
              onClick={handleWeightPromptSubmit}
              size="sm"
              disabled={!weightPromptValue}
            >
              ⚖️ Save Weight
            </GlowButton>
            <GlowButton
              variant="blue"
              className="w-full"
              onClick={handleWeightPromptSkip}
              size="sm"
            >
              Skip for Now
            </GlowButton>
            <button
              onClick={handleWeightPromptDismissToday}
              className="text-[10px] text-mist-dark hover:text-mist-mid transition-colors py-1"
            >
              Don&apos;t remind me today
            </button>
          </div>
        </div>
      </GlowModal>

      {/* Custom Date Modal */}
      <GlowModal
        isOpen={showCustomDateModal}
        onClose={() => {
          setShowCustomDateModal(false);
          setCustomDate("");
        }}
        title="Select Check-In Date"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-mist-light uppercase tracking-wider mb-2">
              Date
            </label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-ink-dark border border-jade-glow/30 rounded-lg px-3 py-2 text-cloud-white outline-none focus:border-jade-glow transition-colors"
            />
          </div>
          <GlowButton
            variant="jade"
            glow
            className="w-full"
            onClick={addCustomDateRow}
          >
            ✓ Add Check-In Date
          </GlowButton>
        </div>
      </GlowModal>
    </PageLayout>
  );
}
