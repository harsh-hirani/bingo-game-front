"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GameLobby } from "@/components/game/game-lobby"
import { GameNav } from "@/components/navigation/game-nav"
import { MainNav } from "@/components/navigation/main-nav"

export default function PlayerGameLobbyPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params?.id

  const [gameData, setGameData] = useState(null)
  const [rounds, setRounds] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLobbyData = async () => {
      if (!gameId) {
        setError("Game ID not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("access_token")

        if (!token) {
          router.push("/player/login")
          return
        }

        const response = await fetch(
          `http://localhost:8000/api/game/${gameId}/lobby/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/player/login")
            return
          }
          if (response.status === 403) {
            throw new Error("You need to register for this game first")
          }
          throw new Error(`Failed to fetch lobby data: ${response.status}`)
        }

        const data = await response.json()
        console.log("Lobby data:", data)

        setGameData(data.game)
        setRounds(data.rounds || [])
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        console.error("Error fetching lobby data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLobbyData()
  }, [gameId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="user" />
        <GameNav gameId={gameId} userType="user" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading game lobby...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="user" />
        <GameNav gameId={gameId} userType="user" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center max-w-md">
              <div className="text-destructive text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold mb-2">Error Loading Lobby</h2>
              <p className="text-destructive mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 mr-2"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/user/dashboard")}
                className="px-4 py-2 border border-input rounded hover:bg-accent"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="user" />
        <GameNav gameId={gameId} userType="user" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">No game data available</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <MainNav userType="user" />
      <GameNav gameId={gameId} userType="user" />
      <GameLobby
        userType="user"
        game={gameData}
        rounds={rounds}
        leaderboard={leaderboard}
        gameId={gameId}
      />
    </>
  )
}