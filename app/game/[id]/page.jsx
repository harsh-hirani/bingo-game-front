"use client"

import { useParams } from "next/navigation"
import { PlayerGameInfo } from "@/components/game/player-game-info"
import { MainNav } from "@/components/navigation/main-nav"

export default function PlayerGameInfoPage() {
  const params = useParams()
  const gameId = params?.id

  return (
    <>
      <MainNav userType="player" />
      <PlayerGameInfo gameId={gameId} />
    </>
  )
}


