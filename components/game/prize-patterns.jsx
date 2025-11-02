"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, CheckCircle, Clock, User } from "lucide-react"

export function PrizePatterns({ patterns = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "won_by_you":
        return <Trophy className="text-green-600" size={16} />
      case "won_by_other":
        return <CheckCircle className="text-blue-500" size={16} />
      case "pending":
        return <Clock className="text-yellow-600" size={16} />
      default:
        return <Clock className="text-muted-foreground" size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "won_by_you":
        return "bg-green-500 text-white hover:bg-green-600"
      case "won_by_other":
        return "bg-blue-500 text-white hover:bg-blue-600"
      case "pending":
        return "bg-yellow-500 text-white hover:bg-yellow-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (pattern) => {
    switch (pattern.status) {
      case "won_by_you":
        return "You Won!"
      case "won_by_other":
        return pattern.winner ? `Won by ${pattern.winner}` : "Won"
      case "pending":
        return "In Progress"
      default:
        return "Waiting"
    }
  }

  const getCardBorderClass = (status) => {
    switch (status) {
      case "won_by_you":
        return "ring-2 ring-green-500 shadow-lg border-green-500"
      case "won_by_other":
        return "border-blue-500/50"
      case "pending":
        return "border-yellow-500/50"
      default:
        return ""
    }
  }

  if (!patterns || patterns.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="text-primary" size={20} />
          Prize Patterns
        </h3>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No prize patterns available for this round
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="text-primary" size={20} />
        Prize Patterns ({patterns.length})
      </h3>

      <div className="grid gap-4 md:grid-cols-1">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              getCardBorderClass(pattern.status),
              pattern.status === "won_by_you" && "animate-in fade-in slide-in-from-bottom-4"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight">{pattern.name}</CardTitle>
                <Badge className={cn("shrink-0", getStatusColor(pattern.status))}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(pattern.status)}
                    <span className="text-xs font-semibold">{getStatusText(pattern)}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Description and Amount */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground flex-1">
                    {pattern.description}
                  </span>
                  <span className="font-bold text-lg text-primary shrink-0">
                    ₹{pattern.amount}
                  </span>
                </div>

                {/* Won by You */}
                {pattern.status === "won_by_you" && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border-2 border-green-500 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                      <Trophy size={18} className="animate-bounce" />
                      <span className="font-bold text-base">🎉 Congratulations!</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      You've won this pattern! Prize: <span className="font-bold">₹{pattern.amount}</span>
                    </p>
                    {pattern.prizeCode && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Prize Code: </span>
                        <span className="font-mono font-bold text-green-700 dark:text-green-400">
                          {pattern.prizeCode}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Won by Other */}
                {pattern.status === "won_by_other" && pattern.winner && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm">
                      <User size={14} />
                      <span>
                        <span className="font-semibold">{pattern.winner}</span> won this pattern
                      </span>
                    </div>
                  </div>
                )}

                {/* Pending */}
                {pattern.status === "pending" && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-sm">
                      <Clock size={14} className="animate-spin" />
                      <span>Keep playing to win this pattern!</span>
                    </div>
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