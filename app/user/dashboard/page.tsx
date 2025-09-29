import { GameList } from "@/components/game/game-list"
import { MainNav } from "@/components/navigation/main-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react"

// Mock data - replace with actual data fetching
const mockUserGames = [
  {
    id: "1",
    title: "Weekend Bingo Bonanza",
    dateTime: "2024-01-20T19:00:00",
    status: "upcoming" as const,
    players: 45,
    maxPlayers: 100,
    totalPrize: "25000",
    rounds: 5,
    organizer: "Mumbai Bingo Club",
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
    organizer: "Delhi Gaming Society",
    winnings: "5000",
  },
  {
    id: "3",
    title: "Friday Night Fun",
    dateTime: "2024-01-19T21:00:00",
    status: "completed" as const,
    players: 67,
    maxPlayers: 80,
    totalPrize: "15000",
    rounds: 4,
    organizer: "Bangalore Bingo Hub",
    winnings: "0",
  },
]

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav userType="user" userName="Jane Player" />

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
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+5 this month</p>
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
              <div className="text-2xl font-bold">₹12,500</div>
              <p className="text-xs text-muted-foreground">+₹2,500 this month</p>
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
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
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
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Next: Tomorrow 7 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        <GameList userType="user" games={mockUserGames} showPagination={true} />
      </div>
    </div>
  )
}
