"use client"

import { useState } from "react"
import { BingoTicket } from "./bingo-ticket"
import { CalledNumbersDisplay } from "./called-numbers-display"
import { PrizePatterns } from "./prize-patterns"
import { CreatorRoundControls } from "./creator-round-controls"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Square, SkipForward, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export function CreatorRoundView({ roundData }) {
  const [gameStatus, setGameStatus] = useState(roundData.status)
  const params = useParams()
  const gameId = params?.id

  const handlePlayPause = () => {
    setGameStatus(gameStatus === "live" ? "paused" : "live")
  }

  const handleStop = () => {
    setGameStatus("ended")
  }

  const handleNextNumber = () => {
    console.log("Calling next number...")
    // Logic to call next number
  }

  const handleApproveWinner = (winnerId) => {
    console.log("Approving winner:", winnerId)
    // Logic to approve winner
  }

  const handleDenyWinner = (winnerId) => {
    console.log("Denying winner:", winnerId)
    // Logic to deny winner
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/creator/game/${gameId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Lobby
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">Round {roundData.number} - Creator View</h1>
            <p className="text-muted-foreground">Manage the game and approve winners</p>
          </div>

          {/* Game Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Button onClick={handlePlayPause} variant={gameStatus === "live" ? "default" : "outline"} size="sm">
                  {gameStatus === "live" ? (
                    <>
                      <Pause size={16} className="mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={16} className="mr-2" />
                      Resume
                    </>
                  )}
                </Button>
                <Button onClick={handleStop} variant="destructive" size="sm">
                  <Square size={16} className="mr-2" />
                  End Round
                </Button>
                <Button onClick={handleNextNumber} variant="outline" size="sm" disabled={gameStatus !== "live"}>
                  <SkipForward size={16} className="mr-2" />
                  Next Number
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Game Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side: Called Numbers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Called Numbers</h2>
            <CalledNumbersDisplay calledNumbers={roundData.calledNumbers} currentNumber={roundData.currentNumber} />
          </div>

          {/* Right Side: Sample Ticket */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Sample Ticket</h2>
            <BingoTicket
              ticketNumbers={roundData.ticketNumbers}
              calledNumbers={roundData.calledNumbers}
              disabled={true}
            />
          </div>
        </div>

        {/* Prize Patterns */}
        <div className="max-w-4xl mx-auto">
          <PrizePatterns patterns={roundData.patterns} />
        </div>

        {/* Winner Management */}
        <div className="max-w-6xl mx-auto">
          <CreatorRoundControls
            winners={roundData.winners}
            onApproveWinner={handleApproveWinner}
            onDenyWinner={handleDenyWinner}
          />
        </div>
      </div>
    </div>
  )
}
