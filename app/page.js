'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from '@/app/actions/auth';
import { useTransition } from 'react';

export default function Home() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-400">
      <Button
        className="bg-black text-white hover:bg-gray-800"
        onClick={handleLogout}
        disabled={isPending}
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}