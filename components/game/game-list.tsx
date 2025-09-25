"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Calendar, Clock, Users, Trophy, Eye, Edit, Trash2 } from "lucide-react"

interface Game {
  id: string
  title: string
  dateTime: string
  status: "upcoming" | "live" | "completed" | "draft"
  players: number
  maxPlayers: number
  totalPrize: string
  rounds: number
  organizer?: string
  winnings?: string
}

interface GameListProps {
  userType: "creator" | "user"
  games: Game[]
}

export function GameList({ userType, games }: GameListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 20

  const totalPages = Math.ceil(games.length / gamesPerPage)
  const startIndex = (currentPage - 1) * gamesPerPage
  const currentGames = games.slice(startIndex, startIndex + gamesPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-success text-success-foreground"
      case "upcoming":
        return "bg-primary text-primary-foreground"
      case "completed":
        return "bg-muted text-muted-foreground"
      case "draft":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{userType === "creator" ? "My Games" : "Game History"}</h2>
          <p className="text-muted-foreground">
            {userType === "creator" ? "Manage your created games" : "View games you've played and winnings"}
          </p>
        </div>
        {userType === "creator" && (
          <Button>
            <Trophy size={16} className="mr-2" />
            Create New Game
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {currentGames.map((game) => (
          <Card key={game.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                    <Badge className={getStatusColor(game.status)}>
                      {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                    </Badge>
                  </div>
                  {userType === "user" && game.organizer && (
                    <CardDescription>Organized by {game.organizer}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                  {userType === "creator" && (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span>{formatDateTime(game.dateTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users size={16} />
                  <span>
                    {game.players}/{game.maxPlayers} players
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span>{game.rounds} rounds</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy size={16} />
                  <span>
                    {userType === "creator"
                      ? `₹${game.totalPrize} total`
                      : game.winnings
                        ? `Won ₹${game.winnings}`
                        : "No winnings"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + gamesPerPage, games.length)} of {games.length} games
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showFirstLast={true}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  )
}
