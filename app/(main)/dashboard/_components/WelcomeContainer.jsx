"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (user) {
        setUsername(user.user_metadata?.username || "User");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {username}! 🎉</h1>
    </div>
  );
}
