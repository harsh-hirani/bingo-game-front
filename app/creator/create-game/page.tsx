import { GameCreationForm } from "@/components/game/game-creation-form"
import { MainNav } from "@/components/navigation/main-nav"

export default function CreateGamePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="creator" userName="John Creator" />
      <GameCreationForm />
    </div>
  )
}
