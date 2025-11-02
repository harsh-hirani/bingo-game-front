"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function CalledNumbersDisplay({ calledNumbers = [], currentNumber }) {
  // Show all called numbers in reverse order (most recent first)
  const allCalledNumbers = [...calledNumbers].reverse()

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Current Number */}
        {currentNumber && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Current Number</div>
            <div className="w-20 h-20 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold shadow-lg animate-pulse">
              {currentNumber}
            </div>
          </div>
        )}

        {/* All Called Numbers */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">Called Numbers</div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-muted/30 rounded">
            {allCalledNumbers.length > 0 ? (
              allCalledNumbers.map((number, index) => (
                <Badge
                  key={`${number}-${index}`}
                  variant="outline"
                  className={cn(
                    "text-sm px-3 py-1",
                    index === 0 && currentNumber === number
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary",
                  )}
                >
                  {number}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No numbers called yet</p>
            )}
          </div>
        </div>

        {/* Total Called */}
        <div className="text-center text-sm text-muted-foreground">
          Total Called: {calledNumbers.length} / 90
        </div>
      </CardContent>
    </Card>
  )
}