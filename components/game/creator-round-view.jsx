"use client"

import { useState, useEffect, useRef } from "react"
import { CalledNumbersDisplay } from "./called-numbers-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function CreatorRoundView({ gameId, roundId }) {
  const [roundData, setRoundData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  
  const wsRef = useRef(null)

  // Fetch initial round data
  useEffect(() => {
    const fetchRoundData = async () => {
      if (!gameId || !roundId) {
        setError("Game ID or Round ID not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("access_token")
        
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const url = `http://localhost:8000/api/creator/game/${gameId}/round/${roundId}/`
        console.log("📡 Fetching URL:", url)

        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        console.log("📦 Received data:", data)

        setRoundData(data)
      } catch (err) {
        console.error("❌ Error fetching round data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRoundData()
  }, [gameId, roundId])

  // WebSocket connection
  useEffect(() => {
    if (!gameId || !roundId || !roundData) return

    const token = localStorage.getItem("access_token")
    if (!token) {
      console.error("❌ No token found for WebSocket connection")
      return
    }

    const wsUrl = `ws://localhost:8000/ws/game/${gameId}/round/${roundId}/?token=${token}`
    console.log("🔌 Connecting to WebSocket:", wsUrl)

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("✅ WebSocket connected")
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      console.log("📨 WebSocket message received:", event.data)
      
      try {
        const data = JSON.parse(event.data)
        console.log(data.error !== undefined);
        
        // Handle new number generated
        if (data.number !== undefined && data.called_numbers) {
          console.log("🎲 New number called:", data.number)
          setRoundData(prev => ({
            ...prev,
            calledNumbers: data.called_numbers,
            currentNumber: data.number,
          }))
        }
        if(data.error !== undefined) {
          toast.error(`Error from server: ${data.error}`)
          return
        }

        // Handle winner announcement
        if (data.winners && Array.isArray(data.winners)) {
          console.log("🏆 Winners announced:", data.winners)
          
          setRoundData(prev => ({
            ...prev,
            patterns: prev.patterns.map(pattern => {
              const winnerData = data.winners.find(w => w.pattern_id === pattern.id)
              
              if (winnerData && winnerData.winners.length > 0) {
                return {
                  ...pattern,
                  winners: winnerData.winners.map(w => ({
                    id: w.player_id,
                    name: w.player_name,
                    email: w.player_email || '',
                  })),
                  hasWinners: true,
                }
              }
              return pattern
            }),
          }))

          toast.success("New winner(s) announced!")
        }
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err)
      }
    }

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error)
      setWsConnected(false)
    }

    ws.onclose = (event) => {
      console.log("🔌 WebSocket closed:", event.code, event.reason)
      setWsConnected(false)
    }

    return () => {
      console.log("🧹 Cleaning up WebSocket connection")
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [gameId, roundId, roundData?.roundId])

  // Function to generate number
  const handleGenerateNumber = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🎲 Requesting number generation")
      wsRef.current.send(JSON.stringify({
        action: "generate_number"
      }))
      toast.info("Generating new number...")
    } else {
      console.error("❌ WebSocket not connected")
      toast.error("WebSocket not connected. Please refresh the page.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading round data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Round</h2>
          <p className="text-destructive mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!roundData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No round data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/creator/game/${gameId}/lobby`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Lobby
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {wsConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{roundData.gameTitle} - Round {roundData.roundNumber}</h1>
            <p className="text-muted-foreground">Creator View - Manage the game and monitor winners</p>
          </div>

          {/* Generate Number Control */}
          <Card>
            <CardContent className="p-4">
              <Button 
                onClick={handleGenerateNumber} 
                disabled={!wsConnected}
                size="lg"
                className="font-semibold"
              >
                {wsConnected ? "🎲 Generate Number" : "⏳ Connecting..."}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Called Numbers Display */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Called Numbers</h2>
            <CalledNumbersDisplay
              calledNumbers={roundData.calledNumbers}
              currentNumber={roundData.currentNumber}
            />
          </div>
        </div>

        {/* Prize Patterns with Winners */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-primary" size={24} />
            Prize Patterns & Winners
          </h2>

          <div className="grid gap-6">
            {roundData.patterns.map((pattern) => (
              <Card key={pattern.id} className={pattern.hasWinners ? "border-green-500 ring-2 ring-green-500/20" : ""}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{pattern.name}</CardTitle>
                      <Badge variant={pattern.hasWinners ? "success" : "secondary"}>
                        {pattern.hasWinners ? (
                          <>
                            <Trophy size={14} className="mr-1" />
                            {pattern.winners.length} Winner{pattern.winners.length > 1 ? 's' : ''}
                          </>
                        ) : (
                          'No Winners Yet'
                        )}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">₹{pattern.amount}</div>
                      <p className="text-xs text-muted-foreground">Prize Amount</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{pattern.description}</p>
                </CardHeader>
                
                {pattern.hasWinners && (
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Users size={16} />
                        Winners:
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {pattern.winners.map((winner) => (
                          <div
                            key={winner.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                          >
                            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                              {winner.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{winner.name}</p>
                              <p className="text-xs text-muted-foreground">{winner.email}</p>
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              <Trophy size={20} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}