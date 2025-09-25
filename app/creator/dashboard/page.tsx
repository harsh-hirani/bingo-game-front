import { GameList } from "@/components/game/game-list"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react"

// Mock data - replace with actual data fetching
const mockGames = [
  {
    id: "1",
    title: "Weekend Bingo Bonanza",
    dateTime: "2024-01-20T19:00:00",
    status: "upcoming" as const,
    players: 45,
    maxPlayers: 100,
    totalPrize: "25000",
    rounds: 5,
  },
  {
    id: "2",
    title: "New Year Special",
    dateTime: "2024-01-01T20:00:00",
    status: "completed" as const,
    players: 89,
    maxPlayers: 100,
    totalPrize: "50000",
    rounds: 7,
  },
  {
    id: "3",
    title: "Friday Night Fun",
    dateTime: "2024-01-19T21:00:00",
    status: "live" as const,
    players: 67,
    maxPlayers: 80,
    totalPrize: "15000",
    rounds: 4,
  },
]

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="creator" userName="John Creator" />

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
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prizes Distributed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,45,000</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Games</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next: Tomorrow 7 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        <GameList userType="creator" games={mockGames} />
      </div>
    </div>
  )
}
