"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import GlowCard from "@/components/ui/GlowCard";
import { getDifficultyColor, getDifficultyGlow } from "@/lib/constants";
import { calculateRealmProgress, getCurrentRealm, getXPToNextRealm, type RealmInfo } from "@/lib/experience";
import { useAuth } from "@/context/AuthContext";

function ProgressSidebar({ currentRealm, xpInfo }: { 
  currentRealm: RealmInfo; 
  xpInfo: { current: number; required: number; }; 
}) {
  const progressPercentage = ((xpInfo.current - (currentRealm.requiredXP || 0)) / Math.max(1, (xpInfo.required - (currentRealm.requiredXP || 0)))) * 100;
  return (
    <div className="space-y-3">
      <div className="ink-border rounded-lg p-3 bg-ink-dark">
        <h3 className="text-xs text-jade-glow mb-2">Current Realm</h3>
        <p className={`text-lg ${getDifficultyColor(currentRealm.name)}`}>
          {currentRealm.name}
        </p>
        <div className="mt-2 w-full bg-ink-mid rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-jade-glow to-gold rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-mist-dark mt-1">
          <span>{xpInfo.current - (currentRealm.requiredXP || 0)} XP</span>
          <span>{xpInfo.required - (currentRealm.requiredXP || 0)} XP</span>
        </div>
      </div>

      <div className="ink-border rounded-lg p-3 bg-ink-dark">
        <h3 className="text-xs text-jade-glow mb-2">Cultivation Statistics</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-mist-mid">Total Experience</span>
            <span className="text-cloud-white">{xpInfo.current.toLocaleString()} XP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mist-mid">To Next Realm</span>
            <span className="text-gold">{Math.max(0, xpInfo.required - xpInfo.current).toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [userExperience, setUserExperience] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load user experience
  useEffect(() => {
    async function loadUserData() {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/users/experience?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserExperience(data.user.experience || 0);
        }
      } catch (error) {
        console.error("Failed to load user experience:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user?.id]);

  const realms = calculateRealmProgress(userExperience);
  const currentRealm = getCurrentRealm(userExperience);
  const xpInfo = getXPToNextRealm(userExperience);

  if (loading) {
    return (
      <PageLayout
        title="Cultivation Path"
        subtitle="Track your ascension through the martial realms"
        sidebar={<ProgressSidebar currentRealm={currentRealm} xpInfo={xpInfo} />}
        sidebarLabel="Progress"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-mist-mid">Loading cultivation progress...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Cultivation Path"
      subtitle="Track your ascension through the martial realms"
      sidebar={<ProgressSidebar currentRealm={currentRealm} xpInfo={xpInfo} />}
      sidebarLabel="Progress"
    >
      <div className="space-y-4">
        {realms.map((realm, i) => (
          <motion.div
            key={realm.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlowCard
              glow={realm.unlocked ? (i >= 5 ? "crimson" : i >= 3 ? "gold" : "jade") : "none"}
              hoverable={realm.unlocked}
              className={`${realm.unlocked ? getDifficultyGlow(realm.name) : "opacity-50"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-2xl ${realm.unlocked ? "" : "grayscale opacity-50"}`}>
                  {["🏃", "🧘", "💎", "👻", "⚡", "🌩️", "✨"][i]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${realm.unlocked ? getDifficultyColor(realm.name) : "text-mist-dark"}`}>
                      {realm.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {realm.unlocked && realm.progress > 0 && (
                        <span className="text-xs text-mist-dark">{realm.progress}%</span>
                      )}
                      <span className="text-xs text-gold">{realm.requiredXP.toLocaleString()} XP</span>
                    </div>
                  </div>
                  <p className="text-xs text-mist-mid mt-1 leading-relaxed">{realm.description}</p>
                  {realm.unlocked && realm.progress > 0 && (
                    <div className="mt-2 w-full bg-ink-mid rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${realm.progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                        className={`h-1.5 rounded-full ${
                          i >= 5 ? "bg-crimson-glow" : 
                          i >= 3 ? "bg-gold-glow" : 
                          "bg-jade-glow"
                        }`}
                      />
                    </div>
                  )}
                  {!realm.unlocked && (
                    <p className="text-[10px] text-mist-dark mt-1 italic">
                      🔒 Locked — Requires {realm.requiredXP.toLocaleString()} XP to unlock
                    </p>
                  )}
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
