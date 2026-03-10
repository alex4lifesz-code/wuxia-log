"use client";

import { DIFFICULTY_LEVELS, getDifficultyXP } from "./constants";

export interface RealmInfo {
  name: string;
  description: string;
  requiredXP: number;
  unlocked: boolean;
  progress: number; // 0-100
}

// XP required for each realm (cumulative)
const REALM_XP_REQUIREMENTS = [
  0,     // Mortal
  100,   // Foundation Establishment  
  300,   // Core Formation
  600,   // Nascent Soul
  1200,  // Soul Splitting
  2000,  // Tribulation Transcendence
  3500,  // Immortal
];

export function calculateRealmProgress(experience: number): RealmInfo[] {
  return DIFFICULTY_LEVELS.map((level, index) => {
    const requiredXP = REALM_XP_REQUIREMENTS[index];
    const nextXP = REALM_XP_REQUIREMENTS[index + 1] || Infinity;
    
    const unlocked = experience >= requiredXP;
    
    // Calculate progress within current realm (0-100)
    let progress = 0;
    if (unlocked) {
      if (index === DIFFICULTY_LEVELS.length - 1) {
        // Final realm - show 100% if reached
        progress = 100;
      } else {
        const realmXP = nextXP - requiredXP;
        const currentXP = Math.min(experience - requiredXP, realmXP);
        progress = Math.round((currentXP / realmXP) * 100);
      }
    }

    const descriptions = [
      "The beginning. You are but a mortal, untouched by cultivation.",
      "You have laid the groundwork. Your foundation grows stronger each day.", 
      "Golden cores form within. Your power condenses into something tangible.",
      "A nascent soul emerges. You transcend mortal limitations.",
      "Your soul splits and multiplies. Power beyond comprehension.",
      "Lightning descends. Survive the heavenly tribulation to ascend.",
      "You have transcended. Eternal strength flows through your veins.",
    ];

    return {
      name: level,
      description: descriptions[index],
      requiredXP,
      unlocked,
      progress: Math.max(0, Math.min(100, progress)),
    };
  });
}

export function getCurrentRealm(experience: number): RealmInfo {
  const realms = calculateRealmProgress(experience);
  
  // Find the highest unlocked realm
  for (let i = realms.length - 1; i >= 0; i--) {
    if (realms[i].unlocked) {
      return realms[i];
    }
  }
  
  return realms[0]; // Fallback to Mortal
}

export function getExperiencePercentage(experience: number): number {
  const currentRealm = getCurrentRealm(experience);
  return currentRealm.progress;
}

export function getXPToNextRealm(experience: number): { current: number; required: number } {
  const realms = calculateRealmProgress(experience);
  const currentRealmIndex = realms.findIndex(r => r.unlocked && experience < (REALM_XP_REQUIREMENTS[realms.indexOf(r) + 1] || Infinity));
  
  if (currentRealmIndex === -1 || currentRealmIndex === realms.length - 1) {
    // At max realm
    return { current: experience, required: experience };
  }
  
  const nextXP = REALM_XP_REQUIREMENTS[currentRealmIndex + 1];
  return { current: experience, required: nextXP };
}

// Award experience for completing exercises
export async function awardExerciseXP(exerciseData: { difficulty: string }, userId: string): Promise<number> {
  const xp = getDifficultyXP(exerciseData.difficulty);
  
  try {
    const response = await fetch("/api/users/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, xp, source: "exercise", difficulty: exerciseData.difficulty }),
    });
    
    if (!response.ok) throw new Error("Failed to award XP");
    
    const data = await response.json();
    return data.newExperience;
  } catch (error) {
    console.error("Error awarding XP:", error);
    return 0;
  }
}

// Award experience for check-ins  
export async function awardCheckInXP(userId: string): Promise<number> {
  const xp = 15; // Fixed XP for check-ins
  
  try {
    const response = await fetch("/api/users/experience", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, xp, source: "checkin" }),
    });
    
    if (!response.ok) throw new Error("Failed to award check-in XP");
    
    const data = await response.json();
    return data.newExperience;
  } catch (error) {
    console.error("Error awarding check-in XP:", error);
    return 0;
  }
}