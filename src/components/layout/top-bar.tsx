"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Trends", href: "/trends" },
]

export function TopBar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-14 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-4">
            <div className="space-y-4 py-4">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href={item.href}>{item.title}</Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1" />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Help
          </Button>
        </nav>
      </div>
    </div>
  )
} 