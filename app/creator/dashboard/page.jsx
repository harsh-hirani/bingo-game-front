"use client"

import { useState, useEffect } from "react"
import { GameList } from "@/components/game/game-list"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react"

import Link from "next/link";
export default function CreatorDashboard() {
  const [games, setGames] = useState([])
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlayers: 0,
    prizesDistributed: "0",
    upcomingGames: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userName, setUserName] = useState("Creator")

  useEffect(() => {
    const fetchCreatorGames = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("access_token")
        const storedUserName = localStorage.getItem("user_name") || "Creator"
        setUserName(storedUserName)

        if (!token) {
          throw new Error("Please login to continue")
        }

        const response = await fetch("http://localhost:8000/api/creator/games/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please login again.")
          }
          throw new Error(`Failed to fetch games: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched games:", data)

        setGames(data.games || [])
        setStats(data.stats || stats)
      } catch (err) {
        console.error("Error fetching games:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorGames()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="creator" userName={userName} />
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="creator" userName={userName} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-primary rounded hover:bg-primary/20 border-2 mr-3.5"
              >
                Retry
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                <Link href="/auth/creator/login">Creator Login</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="creator" userName={userName} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <p className="text-muted-foreground">Manage your Bingo games and track performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGames}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalGames > 0 ? "Games created" : "No games yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPlayers > 0 ? "Players registered" : "No players yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prizes Distributed</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.prizesDistributed}</div>
              <p className="text-xs text-muted-foreground">
                {parseFloat(stats.prizesDistributed) > 0 ? "Total prizes" : "No prizes yet"}
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
              <p className="text-xs text-muted-foreground">
                {stats.upcomingGames > 0 ? "Scheduled games" : "No upcoming games"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        {games.length > 0 ? (
          <GameList userType="creator" games={games} showPagination={true} />
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No games yet</h3>
              <p className="text-muted-foreground mb-4">Create your first bingo game to get started</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Create Game
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}