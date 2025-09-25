"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, CheckCircle, Clock, User } from "lucide-react"

interface PrizePattern {
  id: string
  name: string
  description: string
  amount: string
  status: "pending" | "won_by_other" | "won_by_you"
  winner?: string
  prizeCode?: string
}

interface PrizePatternsProps {
  patterns: PrizePattern[]
}

export function PrizePatterns({ patterns }: PrizePatternsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won_by_you":
        return <Trophy className="text-success" size={16} />
      case "won_by_other":
        return <CheckCircle className="text-muted-foreground" size={16} />
      case "pending":
        return <Clock className="text-warning" size={16} />
      default:
        return <Clock className="text-muted-foreground" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won_by_you":
        return "bg-success text-success-foreground"
      case "won_by_other":
        return "bg-muted text-muted-foreground"
      case "pending":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (pattern: PrizePattern) => {
    switch (pattern.status) {
      case "won_by_you":
        return "You Won!"
      case "won_by_other":
        return `Won by ${pattern.winner}`
      case "pending":
        return "Pending"
      default:
        return "Pending"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="text-primary" size={20} />
        Prize Patterns
      </h3>

      <div className="grid gap-4">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className={cn(
              "transition-all duration-200",
              pattern.status === "won_by_you" ? "ring-2 ring-success shadow-lg" : "",
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pattern.name}</CardTitle>
                <Badge className={getStatusColor(pattern.status)}>
                  {getStatusIcon(pattern.status)}
                  <span className="ml-1">{getStatusText(pattern)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{pattern.description}</span>
                  <span className="font-semibold text-primary">₹{pattern.amount}</span>
                </div>

                {pattern.status === "won_by_you" && pattern.prizeCode && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success mb-1">
                      <Trophy size={16} />
                      <span className="font-semibold">Congratulations!</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Prize Code: </span>
                      <span className="font-mono font-bold">{pattern.prizeCode}</span>
                    </div>
                  </div>
                )}

                {pattern.status === "won_by_other" && pattern.winner && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <User size={14} />
                    <span>Winner: {pattern.winner}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
