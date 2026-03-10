"use client";

import { memo } from "react";

// SwipeNavigation disabled per specification v1.1.0
// Navigation is now exclusively tap-based through bottom navigation bar

function SwipeNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  // All swipe gestures disabled - tap-only navigation

  return (
    <div className="flex-1 overflow-auto" style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

export default memo(SwipeNavigation);
