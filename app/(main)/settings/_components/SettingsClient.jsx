"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, LogOut, Trash2 } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export default function SettingsClient() {
  const [theme, setTheme] = useState("light");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-6">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-text mt-1 max-w-2xl">
          Manage how your account behaves, looks, and stays secure.
        </p>
      </div>

      {/* SETTINGS BOX */}
      <div className="w-full rounded-2xl border border-border bg-card shadow-sm">
        
        {/* APPEARANCE */}
        <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              Appearance
            </h3>
            <p className="text-sm text-muted-text max-w-md">
              Choose how Prepify looks for you.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent transition-all duration-200 text-sm font-medium"
          >
            {theme === "dark" ? (
              <>
                <Sun size={18} />
                Light mode
              </>
            ) : (
              <>
                <Moon size={18} />
                Dark mode
              </>
            )}
          </button>
        </div>

        <div className="h-px bg-border" />

        {/* LOGOUT */}
        <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              Logout
            </h3>
            <p className="text-sm text-muted-text max-w-md">
              Sign out from this device safely.
            </p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-secondary hover:bg-accent transition-all duration-200 text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>

        <div className="h-px bg-border" />

        {/* DELETE ACCOUNT */}
        <div className="p-8 bg-destructive/5 rounded-b-2xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-lg font-semibold text-destructive">
                Delete account
              </h3>
              <p className="text-sm text-muted-text">
                Permanently remove your account and all associated interviews,
                feedback, and data. This action cannot be undone.
              </p>
            </div>

            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive text-white hover:opacity-90 transition-all duration-200 text-sm font-medium"
            >
              <Trash2 size={18} />
              Delete account
            </button>
          </div>

          {/* CONFIRMATION */}
          {confirmDelete && (
            <div className="mt-6 p-5 rounded-xl border border-destructive/40 bg-destructive/10">
              <p className="text-sm mb-4 font-medium">
                Are you absolutely sure?
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  className="px-5 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
