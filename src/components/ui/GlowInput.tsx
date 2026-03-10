"use client";

import { InputHTMLAttributes } from "react";

interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  glowColor?: "jade" | "crimson" | "gold" | "blue";
}

const focusGlow = {
  jade: "focus:border-jade-glow focus:shadow-[0_0_12px_rgba(58,143,143,0.3)]",
  crimson: "focus:border-crimson-glow focus:shadow-[0_0_12px_rgba(196,48,48,0.3)]",
  gold: "focus:border-gold focus:shadow-[0_0_12px_rgba(232,200,74,0.3)]",
  blue: "focus:border-mountain-blue-glow focus:shadow-[0_0_12px_rgba(74,143,184,0.3)]",
};

export default function GlowInput({
  label,
  glowColor = "jade",
  className = "",
  ...props
}: GlowInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs text-mist-light tracking-wider uppercase">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-ink-dark border border-ink-light rounded-lg px-3 py-2 text-sm text-cloud-white
          placeholder:text-mist-dark outline-none transition-all duration-300
          ${focusGlow[glowColor]}
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

interface GlowTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  glowColor?: "jade" | "crimson" | "gold" | "blue";
}

export function GlowTextarea({
  label,
  glowColor = "jade",
  className = "",
  ...props
}: GlowTextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs text-mist-light tracking-wider uppercase">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full bg-ink-dark border border-ink-light rounded-lg px-3 py-2 text-sm text-cloud-white
          placeholder:text-mist-dark outline-none transition-all duration-300 resize-none
          ${focusGlow[glowColor]}
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

interface GlowSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  glowColor?: "jade" | "crimson" | "gold" | "blue";
  options: { value: string; label: string }[];
}

export function GlowSelect({
  label,
  glowColor = "jade",
  options,
  className = "",
  ...props
}: GlowSelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs text-mist-light tracking-wider uppercase">
          {label}
        </label>
      )}
      <select
        className={`
          w-full bg-ink-dark border border-ink-light rounded-lg px-3 py-2 text-sm text-cloud-white
          outline-none transition-all duration-300 cursor-pointer
          ${focusGlow[glowColor]}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
