"use client"

import { RoundView } from "@/components/game/round-view"
import { useParams } from "next/navigation"

export default function UserRoundPage() {
  const params = useParams()
  const gameId = params?.id
  const roundId = params?.roundId

  return <RoundView userType="user" gameId={gameId} roundId={roundId} />
}