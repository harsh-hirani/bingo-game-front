"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BingoTicketProps {
  ticketNumbers: (number | null)[][]
  calledNumbers: number[]
  onNumberClick?: (number: number) => void
  disabled?: boolean
}

export function BingoTicket({ ticketNumbers, calledNumbers, onNumberClick, disabled = false }: BingoTicketProps) {
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set())

  // Auto-mark called numbers
  useEffect(() => {
    setMarkedNumbers(new Set(calledNumbers))
  }, [calledNumbers])

  const handleNumberClick = (number: number | null) => {
    if (!number || disabled) return

    if (calledNumbers.includes(number)) {
      onNumberClick?.(number)
    }
  }

  const isNumberCalled = (number: number | null) => {
    return number !== null && calledNumbers.includes(number)
  }

  const isNumberMarked = (number: number | null) => {
    return number !== null && markedNumbers.has(number)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="grid grid-cols-9 gap-1">
          {ticketNumbers.map((row, rowIndex) =>
            row.map((number, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm font-bold rounded cursor-pointer transition-all duration-200",
                  number === null
                    ? "bg-transparent"
                    : isNumberMarked(number)
                      ? "bg-success text-success-foreground shadow-md scale-95"
                      : isNumberCalled(number)
                        ? "bg-primary text-primary-foreground hover:bg-primary/80"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                  disabled && "cursor-not-allowed opacity-50",
                )}
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </div>
            )),
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Marked: {markedNumbers.size} / {ticketNumbers.flat().filter((n) => n !== null).length}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
