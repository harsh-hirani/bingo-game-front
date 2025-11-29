"use client"

import { RoundView } from "@/components/game/round-view"
import { useParams } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { GameNav } from "@/components/navigation/game-nav"
export default function UserRoundPage() {
  const params = useParams()
  const gameId = params?.id
  const roundId = params?.roundId

  return (
    <>
      <MainNav userType="user" />
      <GameNav gameId={gameId} userType="user" />
      <RoundView userType="user" gameId={gameId} roundId={roundId} />
    </>)
}