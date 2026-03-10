/**
 * Difficulty styling utilities
 * Provides color coding and glow effects for techniques based on difficulty level
 */

export interface DifficultyStyle {
  textColor: string;
  glowColor: string;
  glowShadow: string;
}

const DIFFICULTY_STYLES: Record<string, DifficultyStyle> = {
  "Mortal": {
    textColor: "text-green-400",
    glowColor: "#4ade80",
    glowShadow: "0 0 12px rgba(74, 222, 128, 0.4), inset 0 0 12px rgba(74, 222, 128, 0.1)",
  },
  "Foundation Establishment": {
    textColor: "text-amber-400",
    glowColor: "#fbbf24",
    glowShadow: "0 0 12px rgba(251, 191, 36, 0.4), inset 0 0 12px rgba(251, 191, 36, 0.1)",
  },
  "Core Formation": {
    textColor: "text-red-400",
    glowColor: "#f87171",
    glowShadow: "0 0 12px rgba(248, 113, 113, 0.4), inset 0 0 12px rgba(248, 113, 113, 0.1)",
  },
  "Nascent Soul": {
    textColor: "text-violet-400",
    glowColor: "#a78bfa",
    glowShadow: "0 0 12px rgba(167, 139, 250, 0.4), inset 0 0 12px rgba(167, 139, 250, 0.1)",
  },
  "Soul Splitting": {
    textColor: "text-pink-400",
    glowColor: "#f472b6",
    glowShadow: "0 0 12px rgba(244, 114, 182, 0.4), inset 0 0 12px rgba(244, 114, 182, 0.1)",
  },
  "Tribulation Transcendence": {
    textColor: "text-yellow-300",
    glowColor: "#fbbf24",
    glowShadow: "0 0 12px rgba(251, 191, 36, 0.5), inset 0 0 12px rgba(251, 191, 36, 0.15)",
  },
  "Immortal": {
    textColor: "text-pink-300",
    glowColor: "#f9a8d4",
    glowShadow: "0 0 12px rgba(249, 168, 212, 0.4), inset 0 0 12px rgba(249, 168, 212, 0.1)",
  },
};

/**
 * Get difficulty styling (color and glow effect)
 */
export function getDifficultyStyle(difficulty: string): DifficultyStyle {
  return (
    DIFFICULTY_STYLES[difficulty] || {
      textColor: "text-mist-light",
      glowColor: "#9ca3af",
      glowShadow: "0 0 8px rgba(156, 163, 175, 0.2), inset 0 0 8px rgba(156, 163, 175, 0.05)",
    }
  );
}

/**
 * Get the text color class for a difficulty level
 */
export function getDifficultyColorClass(difficulty: string): string {
  return getDifficultyStyle(difficulty).textColor;
}

/**
 * Get the box-shadow value for glow effect
 */
export function getDifficultyShadow(difficulty: string): React.CSSProperties["boxShadow"] {
  return getDifficultyStyle(difficulty).glowShadow;
}

/**
 * Get inline style object for difficulty border glow
 */
export function getDifficultyGlowStyle(difficulty: string): React.CSSProperties {
  const style = getDifficultyStyle(difficulty);
  return {
    boxShadow: style.glowShadow,
    borderColor: style.glowColor,
  };
}

/**
 * Get inline style object for difficulty border glow, scaled by intensity (0-100)
 */
export function getDifficultyGlowStyleScaled(difficulty: string, intensity: number): React.CSSProperties {
  if (intensity <= 0) return {};
  const style = getDifficultyStyle(difficulty);
  if (intensity >= 100) return { boxShadow: style.glowShadow, borderColor: style.glowColor };
  const factor = intensity / 100;
  const scaledShadow = style.glowShadow.replace(
    /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g,
    (_m: string, r: string, g: string, b: string, a: string) => `rgba(${r}, ${g}, ${b}, ${(parseFloat(a) * factor).toFixed(3)})`
  );
  return { boxShadow: scaledShadow, borderColor: style.glowColor };
}

/**
 * Get abbreviated difficulty level (for compact display)
 */
export function getAbbreviatedDifficulty(difficulty: string): string {
  const abbr: Record<string, string> = {
    "Mortal": "M",
    "Foundation Establishment": "FE",
    "Core Formation": "CF",
    "Nascent Soul": "NS",
    "Soul Splitting": "SS",
    "Tribulation Transcendence": "TT",
    "Immortal": "I",
  };
  return abbr[difficulty] || "?";
}
