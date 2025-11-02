"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function BingoTicket({ ticketNumbers, calledNumbers, onNumberClick, disabled = false }) {
  const [markedNumbers, setMarkedNumbers] = useState(new Set())

  // Calculate total valid numbers in ticket (max 15 for a 3x9 bingo ticket)
  const totalValidNumbers = ticketNumbers?.flat().filter((n) => n !== null && n !== 0).length || 0

  // Auto-mark called numbers (but only up to the total valid numbers in ticket)
  useEffect(() => {
    if (calledNumbers && Array.isArray(calledNumbers) && ticketNumbers) {
      // Get all valid numbers from the ticket
      const validTicketNumbers = ticketNumbers.flat().filter((n) => n !== null && n !== 0)
      
      // Only mark numbers that are both called AND in the ticket
      const markedSet = new Set(
        calledNumbers.filter(num => validTicketNumbers.includes(num))
      )
      
      setMarkedNumbers(markedSet)
    }
  }, [calledNumbers, ticketNumbers])

  const handleNumberClick = (number) => {
    // Don't allow clicking on empty cells (0 or null)
    if (!number || number === 0 || disabled) return

    // Only allow clicking if number has been called
    if (calledNumbers && calledNumbers.includes(number)) {
      onNumberClick?.(number)
    }
  }

  const isNumberCalled = (number) => {
    if (number === null || number === 0) return false
    return calledNumbers && calledNumbers.includes(number)
  }

  const isNumberMarked = (number) => {
    if (number === null || number === 0) return false
    return markedNumbers.has(number)
  }

  // Check if ticketNumbers exists and is valid
  if (!ticketNumbers || !Array.isArray(ticketNumbers) || ticketNumbers.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            No ticket data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="grid grid-cols-9 gap-1">
          {ticketNumbers.map((row, rowIndex) =>
            row.map((number, colIndex) => {
              const isEmpty = number === null || number === 0
              const isCalled = isNumberCalled(number)
              const isMarked = isNumberMarked(number)

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm font-bold rounded transition-all duration-200",
                    isEmpty
                      ? "bg-transparent cursor-default"
                      : isMarked
                        ? "bg-green-500 text-white shadow-md scale-95 cursor-pointer hover:scale-100"
                        : isCalled
                          ? "bg-yellow-500 text-black cursor-pointer hover:bg-yellow-400 animate-pulse"
                          : "bg-muted text-muted-foreground cursor-default",
                    disabled && !isEmpty && "cursor-not-allowed opacity-50",
                  )}
                  onClick={() => handleNumberClick(number)}
                  title={
                    isEmpty
                      ? ""
                      : isMarked
                        ? `${number} - Marked`
                        : isCalled
                          ? `${number} - Called (Click to mark)`
                          : `${number} - Not called yet`
                  }
                >
                  {isEmpty ? "" : number}
                </div>
              )
            }),
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Marked: {markedNumbers.size} / {totalValidNumbers}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {calledNumbers?.length || 0} numbers called
          </p>
        </div>
      </CardContent>
    </Card>
  )
}