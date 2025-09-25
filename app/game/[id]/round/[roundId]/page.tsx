import { RoundView } from "@/components/game/round-view"

// Mock data - replace with actual data fetching
const mockRoundData = {
  id: "1",
  number: 1,
  status: "live" as const,
  ticketNumbers: [
    [1, null, 25, null, 57, null, 77, null, null],
    [null, 17, null, 37, null, 58, null, 78, 81],
    [4, null, 28, null, 46, null, 65, null, 85],
  ] as (number | null)[][],
  calledNumbers: [1, 17, 25, 37, 46, 57, 65, 77, 78],
  currentNumber: 78,
  patterns: [
    {
      id: "1",
      name: "Single Line",
      description: "Complete any horizontal line",
      amount: "2000",
      status: "pending" as const,
    },
    {
      id: "2",
      name: "Double Line",
      description: "Complete any two horizontal lines",
      amount: "3000",
      status: "pending" as const,
    },
    {
      id: "3",
      name: "Four Corners",
      description: "Mark all four corner numbers",
      amount: "5000",
      status: "won_by_other" as const,
      winner: "Rajesh Kumar",
    },
    {
      id: "4",
      name: "Full House",
      description: "Complete all numbers on the ticket",
      amount: "10000",
      status: "pending" as const,
    },
  ],
}

interface RoundPageProps {
  params: {
    id: string
    roundId: string
  }
  searchParams: {
    userType?: "creator" | "user"
  }
}

export default function RoundPage({ params, searchParams }: RoundPageProps) {
  const userType = searchParams.userType || "user"

  return <RoundView userType={userType} roundData={mockRoundData} />
}
