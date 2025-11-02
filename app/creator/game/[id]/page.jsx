"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { GameNav } from "@/components/navigation/game-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Users, 
  Trophy,
  Download,
  Search,
  Mail,
  Phone,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function RegisteredPlayersPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params?.id

  const [gameData, setGameData] = useState(null)
  const [players, setPlayers] = useState([])
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlayers = async () => {
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
          router.push("/creator/login")
          return
        }

        const response = await fetch(
          `http://localhost:8000/api/creator/actions/getregisteredplayers/?game_id=${gameId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/creator/login")
            return
          }
          throw new Error(`Failed to fetch players: ${response.status}`)
        }

        const data = await response.json()
        console.log("Players data:", data)

        setGameData({
          id: data.game_id,
          title: data.game_title,
          totalPlayers: data.total_players,
          maxPlayers: data.max_players,
        })
        setPlayers(data.players || [])
        setFilteredPlayers(data.players || [])
      } catch (err) {
        console.error("Error fetching players:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [gameId, router])

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPlayers(players)
    } else {
      const filtered = players.filter(
        (player) =>
          player.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.mobile_number.includes(searchTerm)
      )
      setFilteredPlayers(filtered)
    }
  }, [searchTerm, players])

  const handleExportCSV = () => {
    if (players.length === 0) return

    const csvHeaders = ["Name", "Email", "Mobile", "Joined At", "Won Amount"]
    const csvRows = players.map((player) => [
      player.full_name,
      player.email,
      player.mobile_number,
      new Date(player.joined_at).toLocaleString(),
      player.won_amount,
    ])

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${gameData?.title || "game"}_players.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="creator" />
        <GameNav gameId={gameId} userType="creator" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading players...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav userType="creator" />
        <GameNav gameId={gameId} userType="creator" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center max-w-md">
              <div className="text-destructive text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold mb-2">Error Loading Players</h2>
              <p className="text-destructive mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
                <Link href="/creator/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="creator" />
      <GameNav gameId={gameId} userType="creator" />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{gameData?.title}</h1>
            <p className="text-muted-foreground">Registered Players</p>
          </div>

          <Button onClick={handleExportCSV} disabled={players.length === 0}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gameData?.totalPlayers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {gameData?.maxPlayers ? `of ${gameData.maxPlayers} max` : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gameData?.totalPlayers && gameData?.maxPlayers
                  ? `${Math.round((gameData.totalPlayers / gameData.maxPlayers) * 100)}%`
                  : "0%"}
              </div>
              <p className="text-xs text-muted-foreground">Filled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {players
                  .reduce((sum, player) => sum + parseFloat(player.won_amount || 0), 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Distributed</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Players Table */}
        {filteredPlayers.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Won Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {player.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{player.full_name}</div>
                            {parseFloat(player.won_amount) > 0 && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Winner
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail size={14} />
                          {player.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone size={14} />
                          {player.mobile_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          {new Date(player.joined_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${parseFloat(player.won_amount) > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          ₹{parseFloat(player.won_amount).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No players found" : "No players registered yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Players will appear here once they register for this game"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}