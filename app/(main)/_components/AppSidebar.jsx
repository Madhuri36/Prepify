"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/constants/Constants";
import { Plus, PanelLeft, PanelRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/userDetails";

export default function AppSidebar({ isCollapsed, toggleSidebar }) {
  const path = usePathname();
  const { loading, getUsername, getEmail } = useAuth();

  const iconSize = isCollapsed ? 20 : 16;
  const plusIconSize = isCollapsed ? 20 : 16;

  return (
    <Sidebar
      className={`relative flex flex-col h-screen border-r dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-22" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute top-6 right-[-0.75rem] z-20 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
      >
        {isCollapsed ? (
          <PanelRight size={iconSize} />
        ) : (
          <PanelLeft size={iconSize} />
        )}
      </Button>

      {/* Header */}
      <SidebarHeader>
        <div
          className={`flex items-center p-2 mt-3 ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <img
            src="/logo.png"
            alt="logo"
            width={isCollapsed ? 50 : 60}
            height={isCollapsed ? 50 : 60}
            className={`transition-all ${
              isCollapsed ? "w-[50px] h-[50px]" : "w-[60px] h-[60px]"
            }`}
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Prepify
              </h1>
              <p className="text-sm text-gray-500 font-sans">
                Perfecting Your Pitch
              </p>
            </div>
          )}
        </div>
        <Link href="/interview" className="block mt-4">
          <Button
            className={`w-full cursor-pointer flex items-center justify-center ${
              isCollapsed ? "p-2" : "px-4 py-2"
            }`}
          >
            <Plus
              className={`${
                !isCollapsed ? "mr-2" : ""
              }`}
              size={plusIconSize}
            />
            {!isCollapsed && "Create New Interview"}
          </Button>
        </Link>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => {
              const active = path === option.path;
              return (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-5 ${active ? "bg-[#DDDFFF] dark:bg-primary/20" : ""}`}
                  >
                    <Link href={option.path} className="flex items-center gap-2">
                      <option.icon
                        className={`${
                          active ? "text-primary dark:text-white" : ""
                        }`}
                        size={isCollapsed ? 20 : 16}
                      />
                      {!isCollapsed && (
                        <span
                          className={`text-[16px] font-medium ${
                            active ? "text-primary dark:text-white" : ""
                          }`}
                        >
                          {option.name}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div
          className={`p-3 border-t dark:border-gray-700 ${
            isCollapsed ? "justify-center flex" : ""
          }`}
        >
          {loading ? (
            <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#DDDFFF] text-lg font-bold text-primary hover:cursor-pointer">
                {getUsername()?.charAt(0).toUpperCase() || "U"}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 hover:cursor-pointer">
                  <p className="text-md font-medium text-gray-900 dark:text-white truncate">
                    {getUsername()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{getEmail()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
