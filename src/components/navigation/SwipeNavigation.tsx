"use client";

import { useSwipeable } from "react-swipeable";
import { useRouter, usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const pageOrder = [
  "/dashboard",
  "/dashboard/workout",
  "/dashboard/exercises",
  "/dashboard/checkin",
  "/dashboard/progress",
  "/dashboard/history",
  "/dashboard/community",
  "/dashboard/settings",
];

export default function SwipeNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setCollapsed, collapsed, isMobile, isNativeApp } = useAppContext();

  const currentIndex = pageOrder.indexOf(pathname);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Disable swipe navigation entirely in browser mode
      if (!isNativeApp) return;
      // On mobile, only navigate if swipe started away from edges (avoid conflicts with panel gestures)
      if (isMobile && eventData.initial[0] < 50) return;
      if (currentIndex < pageOrder.length - 1) {
        router.push(pageOrder[currentIndex + 1]);
      }
    },
    onSwipedRight: (eventData) => {
      if (!isNativeApp) return;
      // On mobile, reserve left-edge swipes for sidebar panel access
      if (isMobile && eventData.initial[0] < 50) return;
      if (currentIndex > 0) {
        router.push(pageOrder[currentIndex - 1]);
      }
    },
    onSwipedUp: () => {
      if (!isNativeApp) return;
      if (!isMobile) setCollapsed(true);
    },
    onSwipedDown: () => {
      if (!isNativeApp) return;
      if (!isMobile) setCollapsed(false);
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
  });

  return (
    <div {...handlers} className="flex-1 overflow-auto">
      {children}
    </div>
  );
}
