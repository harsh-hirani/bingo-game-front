"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "./countdown-timer"
import { Trophy, Users, Clock, Play, Pause, Calendar, Award, Crown, ExternalLink, Check, Edit } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function GameLobby({ userType, game, rounds, leaderboard, gameId }) {
  const [gameStatus, setGameStatus] = useState(game.status)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-success text-success-foreground"
      case "upcoming":
        return "bg-muted text-muted-foreground"
      case "paused":
        return "bg-warning text-warning-foreground"
      case "completed":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "ongoing":
        return <Play size={16} />
      case "upcoming":
        return <Clock size={16} />
      case "paused":
        return <Pause size={16} />
      case "completed":
        return <Trophy size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getRoundUrl = (roundId) => {
    if (userType === "creator") {
      return `/creator/game/${game.id}/round/${roundId}`
    } else {
      return `/game/${game.id}/round/${roundId}`
    }
  }

  const updateGameStatus = async (newStatus) => {
    setIsUpdatingStatus(true)

    try {
      const token = localStorage.getItem("access_token")

      if (!token) {
        toast.error("Please login to continue")
        return
      }

      const response = await fetch(`http://localhost:8000/api/creator/game/${gameId}/status/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update game status")
      }

      const data = await response.json()
      console.log("Status updated:", data)

      setGameStatus(newStatus)
      toast.success(`Game ${newStatus === "ongoing" ? "started" : newStatus === "paused" ? "paused" : "completed"} successfully!`)
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update game status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleStartGame = () => {
    updateGameStatus("ongoing")
  }

  const handlePauseGame = () => {
    updateGameStatus("paused")
  }

  const handleResumeGame = () => {
    updateGameStatus("ongoing")
  }

  const handleCompleteGame = () => {
    if (confirm("Are you sure you want to mark this game as completed? This action cannot be undone.")) {
      updateGameStatus("completed")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">{game.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(game.dateTime).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Organized by: {game.organizer}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            { gameStatus === "upcoming" &&
            <CountdownTimer targetDate={game.dateTime} />}
            <Badge className={getStatusColor(gameStatus)}>
              {getStatusIcon(gameStatus)}
              <span className="ml-1 text-2xl">{gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}</span>
            </Badge>
          </div>
        </div>

        {/* Prize Pool Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Trophy size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">₹{game.totalPrizePool}</h3>
                  <p className="text-muted-foreground">Total Prize Pool</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{game.totalRounds} Rounds</div>
                <p className="text-sm text-muted-foreground">Multiple winning patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rounds Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rounds</h2>
              {userType === "creator" && (
                <div className="flex gap-2">
                  {/* Start Game Button */}
                  {gameStatus === "upcoming" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleStartGame}
                      disabled={isUpdatingStatus}
                    >
                      <Play size={16} className="mr-2" />
                      {isUpdatingStatus ? "Starting..." : "Start Game"}
                    </Button>
                  )}

                  {/* Pause Game Button */}
                  {gameStatus === "ongoing" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePauseGame}
                      disabled={isUpdatingStatus}
                    >
                      <Pause size={16} className="mr-2" />
                      {isUpdatingStatus ? "Pausing..." : "Pause Game"}
                    </Button>
                  )}

                  {/* Resume Game Button */}
                  {gameStatus === "paused" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleResumeGame}
                      disabled={isUpdatingStatus}
                    >
                      <Play size={16} className="mr-2" />
                      {isUpdatingStatus ? "Resuming..." : "Resume Game"}
                    </Button>
                  )}

                  {/* Complete Game Button */}
                  {(gameStatus === "ongoing" || gameStatus === "paused") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCompleteGame}
                      disabled={isUpdatingStatus}
                    >
                      <Check size={16} className="mr-2" />
                      {isUpdatingStatus ? "Completing..." : "Complete Game"}
                    </Button>
                  )}

                  {/* Edit/Reschedule Button */}
                  {gameStatus === "upcoming" && game.isCreator && (
                    <Link href={`/creator/game/${gameId}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-2" />
                        Edit Game
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {rounds.map((round) => (
                <Card key={round.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">Round {round.number}</div>
                      </div>
                      <div className="flex gap-2">
                        {
                          <Link href={getRoundUrl(round.id)}>
                            <Button size="sm" variant="outline">
                              <ExternalLink size={16} className="mr-2" />
                              {gameStatus === "completed" ? "View Results" : "View Round"}
                            </Button>
                          </Link>
                        }
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Total Patterns</h4>
                        <p className="font-medium">{round.totalPatterns}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Called Numbers</h4>
                        <p className="font-medium">{round.calledNumbers} / 90</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Total Prize</h4>
                        <p className="font-medium text-primary">₹{round.totalPrize}</p>
                      </div>
                    </div>
                    {round.winnersCount > 0 && (
                      <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 text-success">
                          <Trophy size={16} />
                          <span className="font-semibold">{round.winnersCount} Winner(s)</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="text-accent" />
              Leaderboard
            </h2>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Winners</CardTitle>
                <CardDescription>Recent prize winners in this game</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {leaderboard.map((winner, index) => (
                      <div key={winner.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{winner.name}</p>
                          <p className="text-sm text-muted-foreground">{winner.round}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">₹{winner.prize}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No winners yet</p>
                    <p className="text-sm">Be the first to win a prize!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}