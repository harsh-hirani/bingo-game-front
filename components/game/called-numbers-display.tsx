"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CalledNumbersDisplayProps {
  calledNumbers: number[]
  currentNumber?: number
}

export function CalledNumbersDisplay({ calledNumbers, currentNumber }: CalledNumbersDisplayProps) {
  const recentNumbers = calledNumbers.slice(-10).reverse()

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Current Number */}
        {currentNumber && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Current Number</div>
            <div className="w-20 h-20 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
              {currentNumber}
            </div>
          </div>
        )}

        {/* Recent Numbers */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">Recently Called</div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {recentNumbers.map((number, index) => (
              <Badge
                key={`${number}-${index}`}
                variant="outline"
                className={cn(
                  "text-sm",
                  index === 0 && currentNumber === number ? "bg-primary text-primary-foreground" : "",
                )}
              >
                {number}
              </Badge>
            ))}
          </div>
        </div>

        {/* Total Called */}
        <div className="text-center text-sm text-muted-foreground">Total Called: {calledNumbers.length} / 90</div>
      </CardContent>
    </Card>
  )
}
