import { Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";

export const SideBarOptions=[
    {
        name: "Dashboard",
        icon:LayoutDashboard,
        path: "/dashboard"
    },
    // {
    //     name: "Scheduled Interviews",
    //     icon:Calendar,
    //     path: "/scheduled-interview"
    // },
    {
        name: "All Interviews",
        icon:List,
        path: "/all-interviews"
    },
    // {
    //     name: "Billing",
    //     icon:WalletCards,
    //     path: "/billing"
    // },
    {
        name: "Settings",
        icon:Settings,
        path: "/settings"
    },
]