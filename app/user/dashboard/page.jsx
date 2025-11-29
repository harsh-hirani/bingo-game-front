"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GameList } from "@/components/game/game-list"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function UserDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalWinnings: "0",
    winRate: 0,
    upcomingGames: 0,
    nextGameTime: null,
  })
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Player")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("access_token")
        const storedUserName = localStorage.getItem("user_name") || "Player"
        setUserName(storedUserName)

        if (!token) {
          router.push("/player/login")
          return
        }

        const response = await fetch("http://localhost:8000/api/player/dashboard/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Session expired. Please login again.")
            router.push("/player/login")
            return
          }
          throw new Error(`HTTP error ${response.status}`)
        }

        const data = await response.json()
        console.log("Dashboard data:", data)

        setStats(data.stats || stats)
        setGames(data.games || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const formatNextGameTime = (isoString) => {
    if (!isoString) return "No upcoming games"
    
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = date - now
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else {
      return "Starting soon"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="user" userName={userName} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="user" userName={userName} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Player Dashboard</h1>
            <p className="text-muted-foreground">Track your games and winnings</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Games Played</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.gamesPlayed > 0 ? "Total games joined" : "Join your first game"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{parseFloat(stats.totalWinnings).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {parseFloat(stats.totalWinnings) > 0 ? "Total prizes won" : "Start playing to win"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.winRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.winRate > 0 ? "Games with prizes" : "Keep playing to improve"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingGames}</div>
              <p className="text-xs text-muted-foreground">{formatNextGameTime(stats.nextGameTime)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        {games.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Games</h2>
            </div>
            <GameList userType="user" games={games} showPagination={true} />
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No games yet</h3>
              <p className="text-muted-foreground mb-4">
                Browse available games and join to start playing
              </p>
              <button
                onClick={() => router.push("/games")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Browse Games
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}