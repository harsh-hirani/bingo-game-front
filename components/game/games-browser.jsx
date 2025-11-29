"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Calendar, Users, Trophy, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function GamesBrowser({userType = "user"}) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalGames: 0,
    hasNext: false,
    hasPrevious: false,
  })

  useEffect(() => {
    fetchGames()
  }, [currentPage, statusFilter])

  const fetchGames = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      })

      const response = await fetch(`http://localhost:8000/api/${userType}/games/list/?${params}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch games")
      }

      const data = await response.json()
      console.log("Games data:", data)

      setGames(data.games || [])
      setPagination(data.pagination || pagination)
    } catch (error) {
      console.error("Error fetching games:", error)
      toast.error("Failed to load games")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    fetchGames()
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500 text-white"
      case "upcoming":
        return "bg-blue-500 text-white"
      case "paused":
        return "bg-yellow-500 text-white"
      case "completed":
        return "bg-gray-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by game title, organizer, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {games.length} of {pagination.totalGames} games
        </p>
        <p className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </p>
      </div>

      {/* Games List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading games...</p>
          </div>
        </div>
      ) : games.length > 0 ? (
        <div className="grid gap-4">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{game.title}</CardTitle>
                    {game.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(game.status)}>{getStatusText(game.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="text-sm font-medium">{new Date(game.dateTime).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(game.dateTime).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                      <p className="text-sm font-medium">{game.organizer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Players</p>
                      <p className="text-sm font-medium">
                        {game.players} / {game.maxPlayers}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Prize</p>
                      <p className="text-sm font-medium text-primary">₹{parseFloat(game.totalPrize).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rounds</p>
                      <p className="text-sm font-medium">{game.rounds}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {game.players >= game.maxPlayers ? (
                      <Badge variant="destructive">Full</Badge>
                    ) : game.status === "upcoming" ? (
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        {game.maxPlayers - game.players} Spots Left
                      </Badge>
                    ) : null}
                  </div>
                  {userType === "user" ? (
                    <Link href={`/game/${game.id}`}>
                      <Button>Join Game</Button>
                    </Link>
                  ) : (
                  <Link href={`/creator/game/${game.id}`}>
                    <Button>View Details</Button>
                  </Link>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "No games are currently available"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevious || loading}
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum
              if (pagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext || loading}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}