"use client"

import { BingoTicket } from "./bingo-ticket"
import { CalledNumbersDisplay } from "./called-numbers-display"
import { PrizePatterns } from "./prize-patterns"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export function RoundView({ userType, roundData }) {
  const params = useParams()
  const gameId = params?.id

  const handleNumberClick = (number) => {
    console.log("Number clicked:", number)
    // Handle number marking logic
  }

  const getBackUrl = () => {
    return userType === "creator" ? `/creator/game/${gameId}` : `/game/${gameId}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={getBackUrl()}>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft size={16} />
              Back to Lobby
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Round {roundData.number}</h1>
          <p className="text-muted-foreground">
            {roundData.status === "live" ? "Game in Progress" : "Round Completed"}
          </p>
        </div>

        {/* Main Game Layout - 2x2 Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Called Numbers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Called Numbers</h2>
            <CalledNumbersDisplay
              calledNumbers={roundData.calledNumbers}
              currentNumber={roundData.currentNumber}
            />
          </div>

          {/* Bingo Ticket */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Ticket</h2>
            <BingoTicket
              ticketNumbers={roundData.ticketNumbers}
              calledNumbers={roundData.calledNumbers}
              onNumberClick={handleNumberClick}
              disabled={roundData.status === "ended"}
            />
          </div>
        </div>

        {/* Prize Patterns */}
        <div className="max-w-4xl mx-auto">
          <PrizePatterns patterns={roundData.patterns} />
        </div>
      </div>
    </div>
  )
}
