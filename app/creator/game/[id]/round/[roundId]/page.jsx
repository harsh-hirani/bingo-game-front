"use client"

import { useParams } from "next/navigation"
import { CreatorRoundView } from "@/components/game/creator-round-view"
import { MainNav } from "@/components/navigation/main-nav"
import { GameNav } from "@/components/navigation/game-nav"

export default function CreatorRoundPage() {
  const params = useParams()
  const gameId = params?.id
  const roundId = params?.roundId

  return (
    <>
      <MainNav userType="creator" />
      <GameNav gameId={gameId} userType="creator" />
      <CreatorRoundView gameId={gameId} roundId={roundId} />
    </>
  )
}