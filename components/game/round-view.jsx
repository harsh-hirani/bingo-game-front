"use client"

import { useState, useEffect, useRef } from "react"
import { BingoTicket } from "./bingo-ticket"
import { CalledNumbersDisplay } from "./called-numbers-display"
import { PrizePatterns } from "./prize-patterns"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner" // or your toast library

export function RoundView({ userType, gameId, roundId }) {
  const [roundData, setRoundData] = useState(null)
  const [gameTitle, setGameTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [latestWinners, setLatestWinners] = useState([])
  
  const wsRef = useRef(null)
  const announcedWinnersRef = useRef(new Set()) // Track announced winners to avoid duplicates

  // Fetch initial round data
  useEffect(() => {
    const fetchRoundData = async () => {
      if (!gameId || !roundId) {
        console.log("Missing gameId or roundId")
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

        const url = `http://localhost:8000/api/game/${gameId}/round/${roundId}/`
        console.log("📡 Fetching URL:", url)

        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("✅ Response status:", response.status)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized. Please login again.")
          }
          const errorText = await response.text()
          console.error("❌ Error response:", errorText)
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        console.log("📦 Received data:", data)

        // Transform backend data
        const transformedData = {
          id: roundId,
          number: roundId,
          status: "live",
          ticketNumbers: data.ticketNumbers,
          calledNumbers: data.calledNumbers || [],
          currentNumber: data.calledNumbers?.[data.calledNumbers.length - 1] || null,
          patterns: data.patterns.map(pattern => ({
            id: pattern.id,
            name: pattern.name,
            description: pattern.description,
            amount: pattern.amount,
            status: pattern.status,
            winner: pattern.winner || undefined,
          })),
        }

        if (data.gameTitle) {
          setGameTitle(data.gameTitle)
        }

        console.log("✅ Transformed data:", transformedData)
        setRoundData(transformedData)
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

    // WebSocket URL with token
    const wsUrl = `ws://localhost:8000/ws/game/${gameId}/round/${roundId}/?token=${token}`
    console.log("🔌 Connecting to WebSocket:", wsUrl)

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("✅ WebSocket connected")
      setWsConnected(true)
      
      // Request current called numbers on connect
      ws.send(JSON.stringify({
        action: "get_called_numbers"
      }))
    }

    ws.onmessage = (event) => {
      console.log("📨 WebSocket message received:", event.data)
      
      try {
        const data = JSON.parse(event.data)
        
        // Handle connection message
        if (data.message) {
          console.log("💬 Server message:", data.message)
        }

        // Handle new number generated
        if (data.number !== undefined && data.called_numbers) {
          console.log("🎲 New number called:", data.number)
          setRoundData(prev => ({
            ...prev,
            calledNumbers: data.called_numbers,
            currentNumber: data.number,
          }))
        }
        
        // Handle called numbers update (without new number)
        else if (data.called_numbers && data.number === undefined) {
          console.log("📋 Called numbers updated:", data.called_numbers)
          setRoundData(prev => ({
            ...prev,
            calledNumbers: data.called_numbers,
            currentNumber: data.called_numbers[data.called_numbers.length - 1] || prev.currentNumber,
          }))
        }

        // Handle winner announcement
        if (data.winners && Array.isArray(data.winners)) {
          console.log("🏆 Winners announced:", data.winners)
          handleWinnerAnnouncement(data.winners)
        }

        // Handle errors
        if (data.error) {
          console.error("❌ WebSocket error:", data.error)
          toast.error(data.error)
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

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up WebSocket connection")
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [gameId, roundId, roundData?.id])

  // Handle winner announcement
  const handleWinnerAnnouncement = (winners) => {
    const currentUserId = localStorage.getItem("user_id")
    const newWinners = []

    winners.forEach(winnerData => {
      const { pattern_id, pattern_name, winners: winnersList } = winnerData

      if (!winnersList || winnersList.length === 0) return

      // Create unique key for this pattern win
      const winKey = `${pattern_id}-${winnersList[0].player_id}`
      
      // Skip if already announced
      if (announcedWinnersRef.current.has(winKey)) return
      
      announcedWinnersRef.current.add(winKey)

      winnersList.forEach(winner => {
        const isCurrentUser = String(winner.player_id) === String(currentUserId)
        
        newWinners.push({
          pattern_id,
          pattern_name,
          player_name: winner.player_name,
          amount: winner.amount,
          is_current_user: isCurrentUser,
        })

        // Show toast notification
        if (isCurrentUser) {
          toast.success(`🎉 Congratulations! You won ${pattern_name}!`, {
            description: `Prize: ₹${winner.amount}`,
            duration: 5000,
          })
        } else {
          toast.info(`🏆 ${winner.player_name} won ${pattern_name}!`, {
            description: `Prize: ₹${winner.amount}`,
            duration: 4000,
          })
        }
      })

      // Update pattern status in roundData
      setRoundData(prev => ({
        ...prev,
        patterns: prev.patterns.map(pattern => {
          if (pattern.id === pattern_id) {
            const winner = winnersList[0]
            const isCurrentUser = String(winner.player_id) === String(currentUserId)
            
            return {
              ...pattern,
              status: isCurrentUser ? "won_by_you" : "won_by_other",
              winner: winner.player_name,
            }
          }
          return pattern
        }),
      }))
    })

    // Show winners in modal if any
    if (newWinners.length > 0) {
      setLatestWinners(newWinners)
      setShowWinnerModal(true)
      
      // Auto-hide modal after 5 seconds
      setTimeout(() => {
        setShowWinnerModal(false)
      }, 5000)
    }
  }

  // Function to generate number (Creator only)
  const handleGenerateNumber = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🎲 Requesting number generation")
      wsRef.current.send(JSON.stringify({
        action: "generate_number"
      }))
    } else {
      console.error("❌ WebSocket not connected")
      toast.error("WebSocket not connected. Please refresh the page.")
    }
  }

  const handleNumberClick = (number) => {
    console.log("Number clicked:", number)
    // Handle number marking logic if needed
  }

  const getBackUrl = () => {
    return userType === "creator" ? `/creator/game/${gameId}/lobby` : `/game/${gameId}/lobby`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading round data...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Game: {gameId}, Round: {roundId}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Round</h2>
          <p className="text-destructive mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
            >
              Retry
            </Button>
            <Link href={getBackUrl()}>
              <Button variant="outline">
                Back to Lobby
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!roundData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No round data available</p>
          <Link href={getBackUrl()}>
            <Button variant="outline">Back to Lobby</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href={getBackUrl()}>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft size={16} />
              Back to Lobby
            </Button>
          </Link>

          {/* WebSocket Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {wsConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Winner Modal */}
        {showWinnerModal && latestWinners.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background border-2 border-primary rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in">
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {latestWinners.some(w => w.is_current_user) ? "🎉 You Won!" : "🏆 Winner!"}
                </h2>
              </div>
              
              <div className="space-y-4">
                {latestWinners.map((winner, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${winner.is_current_user ? 'bg-green-500/20 border-2 border-green-500' : 'bg-muted'}`}
                  >
                    <p className="font-semibold text-lg">{winner.pattern_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {winner.is_current_user ? 'You' : winner.player_name}
                    </p>
                    <p className="text-xl font-bold text-primary mt-2">₹{winner.amount}</p>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setShowWinnerModal(false)}
                className="w-full mt-6"
              >
                Continue Playing
              </Button>
            </div>
          </div>
        )}

        {/* Header with Game Title */}
        <div className="mb-8 text-center">
          {gameTitle && (
            <p className="text-lg text-muted-foreground mb-2">{gameTitle}</p>
          )}
          <h1 className="text-3xl font-bold mb-2">Round {roundData.number}</h1>
          <p className="text-muted-foreground">
            {roundData.status === "live" ? "🔴 Game in Progress" : "✅ Round Completed"}
          </p>
        </div>

        {/* Creator Controls */}
        {userType === "creator" && (
          <div className="mb-6 text-center">
            <Button 
              onClick={handleGenerateNumber}
              disabled={!wsConnected}
              size="lg"
              className="font-semibold px-8"
            >
              {wsConnected ? "🎲 Generate Number" : "⏳ Connecting..."}
            </Button>
            {!wsConnected && (
              <p className="text-sm text-muted-foreground mt-2">
                Waiting for WebSocket connection...
              </p>
            )}
          </div>
        )}

        {/* Main Game Layout - 2x2 Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Called Numbers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Called Numbers</h2>
            <CalledNumbersDisplay
              calledNumbers={roundData.calledNumbers}
              currentNumber={roundData.currentNumber}
            />
          </div>

          {/* Bingo Ticket */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Ticket</h2>
            <BingoTicket
              ticketNumbers={roundData.ticketNumbers}
              calledNumbers={roundData.calledNumbers}
              onNumberClick={handleNumberClick}
              disabled={roundData.status === "ended"}
            />
          </div>
        </div>

        {/* Prize Patterns */}
        <div className="max-w-4xl mx-auto">
          <PrizePatterns patterns={roundData.patterns} />
        </div>
      </div>
    </div>
  )
}