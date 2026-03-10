"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "jade" | "crimson" | "gold" | "blue" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const variantStyles = {
  jade: "bg-jade-deep border-jade/50 text-jade-light hover:bg-jade/30 hover:border-jade-glow/60",
  crimson: "bg-crimson-deep border-crimson/50 text-crimson-light hover:bg-crimson/30 hover:border-crimson-glow/60",
  gold: "bg-gold-dim/20 border-gold-dim/50 text-gold hover:bg-gold-dim/40 hover:border-gold/60",
  blue: "bg-mountain-blue/20 border-mountain-blue/50 text-mountain-blue-glow hover:bg-mountain-blue/40 hover:border-mountain-blue-glow/60",
  ghost: "bg-transparent border-ink-light text-mist-light hover:bg-ink-mid hover:text-cloud-white hover:border-mist-dark",
};

const glowStyles = {
  jade: "glow-jade",
  crimson: "glow-crimson",
  gold: "glow-gold",
  blue: "glow-blue",
  ghost: "",
};

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function GlowButton({
  children,
  variant = "jade",
  size = "md",
  glow = false,
  className = "",
  ...props
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        border rounded-lg font-medium transition-all duration-300 cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${glow ? glowStyles[variant] : ""}
        ${className}
      `}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
