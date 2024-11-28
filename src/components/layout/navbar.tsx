"use client";

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={24}
            height={24}
          />
          <h1 className="text-xl font-bold">Agri Dashboard</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>

        </nav>
      </div>
    </div>
  )
} 