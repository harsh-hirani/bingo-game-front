import { GameLobby } from "@/components/game/game-lobby"

// Mock data - replace with actual data fetching based on game ID
const mockGame = {
  id: "1",
  title: "Weekend Bingo Bonanza",
  dateTime: "2024-01-20T19:00:00",
  organizer: "Mumbai Bingo Club",
  totalPrizePool: "25000",
  totalRounds: 5,
  status: "upcoming" as const,
}

const mockRounds = [
  {
    id: "1",
    number: 1,
    status: "upcoming" as const,
    patternName: "Single Line",
    prizeDescription: "Cash Prize",
    prizeAmount: "2000",
  },
  {
    id: "2",
    number: 2,
    status: "upcoming" as const,
    patternName: "Double Line",
    prizeDescription: "Gift Voucher",
    prizeAmount: "3000",
  },
  {
    id: "3",
    number: 3,
    status: "upcoming" as const,
    patternName: "Four Corners",
    prizeDescription: "Cash Prize",
    prizeAmount: "5000",
  },
  {
    id: "4",
    number: 4,
    status: "upcoming" as const,
    patternName: "Full House",
    prizeDescription: "Grand Prize",
    prizeAmount: "10000",
  },
  {
    id: "5",
    number: 5,
    status: "upcoming" as const,
    patternName: "Special Pattern",
    prizeDescription: "Bonus Prize",
    prizeAmount: "5000",
  },
]

const mockLeaderboard = [
  {
    id: "1",
    name: "Rajesh Kumar",
    prize: "2000",
    round: "Round 1 - Single Line",
  },
  {
    id: "2",
    name: "Priya Sharma",
    prize: "3000",
    round: "Round 2 - Double Line",
  },
  {
    id: "3",
    name: "Amit Patel",
    prize: "5000",
    round: "Round 3 - Four Corners",
  },
]

interface GameLobbyPageProps {
  params: {
    id: string
  }
  searchParams: {
    userType?: "creator" | "user"
  }
}

export default function GameLobbyPage({ params, searchParams }: GameLobbyPageProps) {
  const userType = searchParams.userType || "user"

  return <GameLobby userType={userType} game={mockGame} rounds={mockRounds} leaderboard={mockLeaderboard} />
}
