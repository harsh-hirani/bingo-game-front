"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "./countdown-timer"
import { Trophy, Users, Clock, Play, Pause, Calendar, Award, Crown, ExternalLink } from "lucide-react"
import Link from "next/link"

export function GameLobby({ userType, game, rounds, leaderboard }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-success text-success-foreground"
      case "join":
        return "bg-primary text-primary-foreground"
      case "upcoming":
        return "bg-muted text-muted-foreground"
      case "ended":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "live":
        return <Play size={16} />
      case "join":
        return <Users size={16} />
      case "upcoming":
        return <Clock size={16} />
      case "ended":
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
            <CountdownTimer targetDate={game.dateTime} />
            <Badge className={getStatusColor(game.status)}>
              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
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
                  <Button variant="outline" size="sm">
                    <Pause size={16} className="mr-2" />
                    Pause Game
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar size={16} className="mr-2" />
                    Reschedule
                  </Button>
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
                        <Badge className={getStatusColor(round.status)}>
                          {getStatusIcon(round.status)}
                          <span className="ml-1 capitalize">{round.status}</span>
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {round.status === "join" && (
                          <Link href={getRoundUrl(round.id)}>
                            <Button size="sm">
                              <Play size={16} className="mr-2" />
                              Join Round
                            </Button>
                          </Link>
                        )}
                        {round.status === "live" && (
                          <Link href={getRoundUrl(round.id)}>
                            <Button size="sm" variant="outline">
                              <ExternalLink size={16} className="mr-2" />
                              View Live
                            </Button>
                          </Link>
                        )}
                        {round.status === "ended" && (
                          <Link href={getRoundUrl(round.id)}>
                            <Button size="sm" variant="secondary">
                              <Trophy size={16} className="mr-2" />
                              View Results
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Pattern</h4>
                        <p className="font-medium">{round.patternName}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Prize</h4>
                        <p className="font-medium">{round.prizeDescription}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Amount</h4>
                        <p className="font-medium text-primary">₹{round.prizeAmount}</p>
                      </div>
                    </div>
                    {round.prizeWon && (
                      <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center gap-2 text-success">
                          <Trophy size={16} />
                          <span className="font-semibold">You Won: {round.prizeWon}</span>
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
