"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Layout,Pen ,LucideHome} from "lucide-react"

export function GameNav({ gameId, userType = "creator" }) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Game",
      href: `/${userType}/game/${gameId}`,
      icon: LucideHome,
    },
    {
      title: "Lobby",
      href: `/${userType}/game/${gameId}/lobby`,
      icon: Layout,
    },
       
    {
      title: "Edit",
      href: `/creator/game/${gameId}/edit`,
      icon: Pen,
    },
  ]

  // Only show players tab for creators
  const filteredItems = userType === "creator" ? navItems : navItems.filter(item => item.title === "Lobby")

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-1">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:text-primary border-b-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                )}
              >
                <Icon size={16} />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}