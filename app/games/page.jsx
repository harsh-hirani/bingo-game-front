"use client"

import { GamesBrowser } from "@/components/game/games-browser"
import { MainNav } from "@/components/navigation/main-nav"

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="user" />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Games</h1>
          <p className="text-muted-foreground">Find and join exciting Bingo games</p>
        </div>

        <GamesBrowser />
      </div>
    </div>
  )
}