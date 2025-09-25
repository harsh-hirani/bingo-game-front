"use client"

import { BingoTicket } from "./bingo-ticket"
import { CalledNumbersDisplay } from "./called-numbers-display"
import { PrizePatterns } from "./prize-patterns"

interface RoundViewProps {
  userType: "creator" | "user"
  roundData: {
    id: string
    number: number
    status: "live" | "ended"
    ticketNumbers: (number | null)[][]
    calledNumbers: number[]
    currentNumber?: number
    patterns: Array<{
      id: string
      name: string
      description: string
      amount: string
      status: "pending" | "won_by_other" | "won_by_you"
      winner?: string
      prizeCode?: string
    }>
  }
}

export function RoundView({ userType, roundData }: RoundViewProps) {
  const handleNumberClick = (number: number) => {
    console.log("Number clicked:", number)
    // Handle number marking logic
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Round {roundData.number}</h1>
          <p className="text-muted-foreground">
            {roundData.status === "live" ? "Game in Progress" : "Round Completed"}
          </p>
        </div>

        {/* Main Game Layout - 2x2 Grid + Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Left: Called Numbers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Called Numbers</h2>
            <CalledNumbersDisplay calledNumbers={roundData.calledNumbers} currentNumber={roundData.currentNumber} />
          </div>

          {/* Top Right: Bingo Ticket */}
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

        {/* Bottom Row: Prize Patterns */}
        <div className="max-w-4xl mx-auto">
          <PrizePatterns patterns={roundData.patterns} />
        </div>
      </div>
    </div>
  )
}
