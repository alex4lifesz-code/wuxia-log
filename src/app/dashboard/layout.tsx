"use client";

import { AppProvider } from "@/context/AppContext";
import { DisplaySettingsProvider } from "@/context/DisplaySettingsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TopBar from "@/components/navigation/TopBar";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import RightPanel from "@/components/navigation/RightPanel";
import BottomBar from "@/components/navigation/BottomBar";
import FloatingMobileSidebar from "@/components/navigation/FloatingMobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-void-black">
        <p className="text-mist-mid text-sm animate-pulse">Restoring session…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

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
          <FloatingMobileSidebar />
          <BottomBar />
        </div>
      </DisplaySettingsProvider>
    </AppProvider>
  );
}
