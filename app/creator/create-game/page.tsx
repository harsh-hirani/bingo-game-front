import { GameCreationForm } from "@/components/game/game-creation-form"

export default function CreateGamePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <GameCreationForm />
      </div>
    </div>
  )
}
