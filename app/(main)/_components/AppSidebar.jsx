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
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/userDetails";

export default function AppSidebar() {
  const path = usePathname();
  const { user, loading, getUsername, getEmail } = useAuth();

  console.log("Current Path:", path);

  return (
    <Sidebar>
      {/* Header Section */}
      <SidebarHeader>
        <div className="flex items-center space-x-3 p-2 mt-3">
          <img
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
            className="w-[60px] h-[60px]"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Prepify
            </h1>
            <p className="text-sm text-gray-500 font-sans">
              Perfecting Your Pitch
            </p>
          </div>
        </div>
        <Link href="/interview">
          <Button className="w-full mt-4 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Create New Interview
          </Button>
        </Link>
      </SidebarHeader>

      {/* Sidebar Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index} className="p-1">
                <SidebarMenuButton
                  asChild
                  className={`p-5 ${path == option.path && "bg-[#DDDFFF]"}`}
                >
                  <Link href={option.path} className="flex items-center gap-2">
                    <option.icon
                      className={`h-5 w-5 ${
                        path == option.path && "text-primary"
                      }`}
                    />
                    <span
                      className={`text-[16px] font-medium ${
                        path == option.path && "text-primary"
                      }`}
                    >
                      {option.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 border-t">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#DDDFFF] text-lg font-bold text-primary hover:cursor-pointer">
                {getUsername().charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 hover:cursor-pointer">
                <p className="text-md font-medium text-gray-900 dark:text-white truncate">
                  {getUsername()}
                </p>
                <p className="text-xs text-gray-500 truncate">{getEmail()}</p>
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
