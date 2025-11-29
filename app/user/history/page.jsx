"use client"

import { PlayerHistory } from "@/components/game/player-history"
import { MainNav } from "@/components/navigation/main-nav"

export default function PlayerHistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="user" />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Game History</h1>
          <p className="text-muted-foreground">View all the games you've played</p>
        </div>

        <PlayerHistory />
      </div>
    </div>
  )
}