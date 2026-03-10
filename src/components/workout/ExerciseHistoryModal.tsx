"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlowModal } from "@/components/ui/GlowCard";
import { useAuth } from "@/context/AuthContext";
import { useDisplaySettings } from "@/context/DisplaySettingsContext";
import { formatDateWithPreference } from "@/lib/constants";

interface ExerciseHistoryModalProps {
  exerciseId: string;
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExerciseHistoryModal({ exerciseId, exerciseName, isOpen, onClose }: ExerciseHistoryModalProps) {
  const { user } = useAuth();
  const { settings } = useDisplaySettings();
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id && exerciseId) {
      setLoading(true);
      fetch(`/api/exercises/history?exerciseId=${encodeURIComponent(exerciseId)}&userId=${encodeURIComponent(user.id)}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setHistoryData(data.history || []))
        .catch(() => setHistoryData([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, exerciseId, user?.id]);

  return (
    <GlowModal isOpen={isOpen} onClose={onClose} title={`Training History — ${exerciseName}`}>
      {loading ? (
        <div className="text-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-jade-glow border-t-transparent rounded-full mx-auto"
          />
          <p className="text-xs text-mist-dark mt-2">Loading history...</p>
        </div>
      ) : historyData.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-3 opacity-50">📜</div>
          <p className="text-xs text-mist-dark">No training sessions recorded for this technique yet.</p>
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto sidebar-scroll">
          <table className="w-full text-[11px] min-w-[400px]">
            <thead className="sticky top-0 bg-ink-deep">
              <tr className="border-b border-ink-light/40 text-mist-dark">
                <th className="text-left py-1.5 px-1.5 font-semibold">Date</th>
                <th className="text-center py-1.5 px-1 font-semibold">W1</th>
                <th className="text-center py-1.5 px-1 font-semibold">R1</th>
                <th className="text-center py-1.5 px-1 font-semibold">W2</th>
                <th className="text-center py-1.5 px-1 font-semibold">R2</th>
                <th className="text-center py-1.5 px-1 font-semibold">W3</th>
                <th className="text-center py-1.5 px-1 font-semibold">R3</th>
                <th className="text-left py-1.5 px-1.5 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry: any) => (
                <tr key={entry.id} className="border-b border-ink-light/20 hover:bg-ink-mid/10">
                  <td className="py-1.5 px-1.5 text-mist-light whitespace-nowrap">
                    {formatDateWithPreference(new Date(entry.date), settings.dateFormat || "dd-mmm-yyyy")}
                  </td>
                  <td className="py-1.5 px-1 text-center text-cloud-white">{entry.weight1 != null ? entry.weight1 : "—"}</td>
                  <td className="py-1.5 px-1 text-center text-cloud-white">{entry.reps1 != null ? entry.reps1 : "—"}</td>
                  <td className="py-1.5 px-1 text-center text-cloud-white">{entry.weight2 != null ? entry.weight2 : "—"}</td>
                  <td className="py-1.5 px-1 text-center text-cloud-white">{entry.reps2 != null ? entry.reps2 : "—"}</td>
                  <td className="py-1.5 px-1 text-center text-cloud-white">{entry.weight3 != null ? entry.weight3 : "—"}</td>
                  <td className="py-1.5 px-1 text-center text-cloud-white">{entry.reps3 != null ? entry.reps3 : "—"}</td>
                  <td className="py-1.5 px-1.5 text-mist-dark truncate max-w-[100px]" title={entry.notes || ""}>{entry.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlowModal>
  );
}
