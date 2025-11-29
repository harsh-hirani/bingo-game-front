"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  Trophy, 
  Clock, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function PlayerGameInfo({ gameId }) {
  const router = useRouter()
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("access_token")

        if (!token) {
          router.push("/auth/user/login")
          return
        }

        const response = await fetch(
          `http://localhost:8000/api/player/game/${gameId}/detail/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/user/login")
            return
          }
          throw new Error("Failed to fetch game details")
        }

        const data = await response.json()
        console.log("Game data:", data)
        setGameData(data)
      } catch (err) {
        console.error("Error fetching game:", err)
        setError(err.message)
        toast.error("Failed to load game details")
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [gameId, router])

  const handleJoinGame = async () => {
    setIsJoining(true)

    try {
      const token = localStorage.getItem("access_token")

      if (!token) {
        toast.error("Please login to continue")
        router.push("/auth/user/login")
        return
      }

      const response = await fetch("http://localhost:8000/api/player/games/assign/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game: gameId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to join game")
      }

      const data = await response.json()
      console.log("Joined game:", data)

      toast.success("Successfully joined the game! Your tickets have been assigned.")
      
      // Redirect to game lobby
      router.push(`/game/${gameId}/lobby`)
    } catch (err) {
      console.error("Error joining game:", err)
      toast.error(err.message)
    } finally {
      setIsJoining(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-success text-success-foreground"
      case "upcoming":
        return "bg-blue-500 text-white"
      case "paused":
        return "bg-warning text-warning-foreground"
      case "completed":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Game</h2>
          <p className="text-destructive mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No game data available</p>
      </div>
    )
  }

  const spotsLeft = gameData.maxPlayers - gameData.registeredPlayers

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Games
            </Button>
          </Link>
        </div>

        {/* Game Title & Status */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-3">{gameData.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(gameData.dateTime).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>By {gameData.organizer}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(gameData.status)} text-base px-4 py-2`}>
            {gameData.status.charAt(0).toUpperCase() + gameData.status.slice(1)}
          </Badge>
        </div>

        {/* Description */}
        <div className="grid gap-4 md:grid-cols-2">

        {gameData.description && (
          <Card>
            <CardHeader>
              <CardTitle>About This Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{gameData.description}</p>
            </CardContent>
          </Card>
        )}
        {/* Join Game Button */}{/* Join Button Section */}
        {gameData.hasJoined ? (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                      You're In!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      You have successfully joined this game
                    </p>
                  </div>
                </div>
                <Link href={`/game/${gameId}/lobby`}>
                  <Button size="lg">Go to Game Lobby</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : gameData.canJoin ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ready to Play?</h3>
                  <p className="text-sm text-muted-foreground">
                    Join now and get your tickets for all {gameData.totalRounds} rounds
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={handleJoinGame}
                  disabled={isJoining}
                  className="min-w-[200px] w-100"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Join Game
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-destructive/10 border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-destructive" size={32} />
                <div>
                  <h3 className="text-lg font-semibold text-destructive">Game Full</h3>
                  <p className="text-sm text-muted-foreground">
                    This game has reached maximum capacity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>

        {/* Game Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{gameData.totalPrizePool}</p>
                  <p className="text-sm text-muted-foreground">Total Prize</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gameData.totalRounds}</p>
                  <p className="text-sm text-muted-foreground">Rounds</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gameData.registeredPlayers}</p>
                  <p className="text-sm text-muted-foreground">Players Joined</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={spotsLeft <= 10 && spotsLeft > 0 ? "border-warning" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${spotsLeft <= 10 ? 'bg-warning/10' : 'bg-primary/10'}`}>
                  <Users className={spotsLeft <= 10 ? 'text-warning' : 'text-primary'} size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{spotsLeft}</p>
                  <p className="text-sm text-muted-foreground">Spots Left</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
        {/* Rounds & Prizes */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-primary" />
            Rounds & Prizes
          </h2>
          <div className="grid gap-4">
            {gameData.rounds.map((round) => (
              <Card key={round.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Round {round.number}</CardTitle>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{round.totalPrize}</p>
                      <p className="text-xs text-muted-foreground">{round.totalPatterns} Patterns</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {round.patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{pattern.name}</p>
                          <p className="text-sm text-muted-foreground">{pattern.description}</p>
                        </div>
                        <p className="font-semibold text-primary">₹{pattern.amount}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}