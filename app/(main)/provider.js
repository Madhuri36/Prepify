"use client";

import React, { useState } from "react";
import AppSidebar from "./_components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prevState => !prevState);
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen z-10">
          <AppSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main content */}
        <main
          className={`h-screen overflow-y-auto transition-all duration-300 ease-in-out flex-1 ${
            isCollapsed ? "ml-20" : "ml-72"
          }`}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
