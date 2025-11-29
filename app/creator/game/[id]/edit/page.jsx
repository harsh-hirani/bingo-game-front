"use client"

import { useParams } from "next/navigation"
import { GameEditForm } from "@/components/game/game-edit-form"
import { MainNav } from "@/components/navigation/main-nav"

export default function EditGamePage() {
  const params = useParams()
  const gameId = params?.id

  return (
    <>
      <MainNav userType="creator" />
      <GameEditForm gameId={gameId} />
    </>
  )
}