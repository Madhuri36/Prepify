"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Mic, BarChart3, Shield, Moon, Sun } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState("light");

  // Load theme on mount
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
    <main className="min-h-screen bg-background text-foreground">
      
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Prepify" width={40} height={40} />
          <span className="text-xl font-bold">Prepify</span>
        </div>

        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl border border-border flex items-center justify-center bg-card hover:bg-accent transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>

          <Button className="btn-primary" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Ace Interviews with <br />
            <span className="text-primary">AI-Powered Practice</span>
          </h1>

          <p className="text-lg text-muted-text max-w-xl">
            Practice real interview questions, get instant AI feedback,
            and track your progress — all in one place.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/auth/signup">🚀 Start Practicing</Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">View Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-primary/10 blur-3xl" />
          <Image
            src="/robo.png"
            alt="AI Interview Practice"
            width={600}
            height={500}
            className="rounded-3xl"
            priority
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">
            Why choose Prepify?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature icon={<Mic />} title="Real Practice" text="Mock interviews that feel real." />
            <Feature icon={<Sparkles />} title="AI Feedback" text="Instant, actionable insights." />
            <Feature icon={<BarChart3 />} title="Track Progress" text="Measure improvement over time." />
            <Feature icon={<Shield />} title="Secure & Private" text="Your data stays yours." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to crack your next interview?
        </h2>
        <p className="text-muted-text mb-8">
          Start practicing today and walk in with confidence.
        </p>

        <Button size="lg" className="btn-primary" asChild>
          <Link href="/auth/signup">Get Started for Free</Link>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-text">
        © {new Date().getFullYear()} Prepify. All rights reserved.
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-text">{text}</p>
    </div>
  );
}
