"use client";

import { AppProvider } from "@/context/AppContext";
import { DisplaySettingsProvider } from "@/context/DisplaySettingsContext";
import TopBar from "@/components/navigation/TopBar";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import RightPanel from "@/components/navigation/RightPanel";
import BottomBar from "@/components/navigation/BottomBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <DisplaySettingsProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 flex overflow-hidden">
            <LeftSidebar />
            <div className="flex-1 overflow-auto">{children}</div>
            <RightPanel />
          </div>
          <BottomBar />
        </div>
      </DisplaySettingsProvider>
    </AppProvider>
  );
}
