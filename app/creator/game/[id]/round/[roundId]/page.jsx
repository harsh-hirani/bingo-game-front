import { CreatorRoundView } from "@/components/game/creator-round-view";

// Mock data with creator-specific information
const mockCreatorRoundData = {
  id: "1",
  number: 2,
  status: "live",
  ticketNumbers: [
    [1, null, 25, null, 57, null, 77, null, null],
    [null, 17, null, 37, null, 58, null, 78, 81],
    [4, null, 28, null, 46, null, 65, null, 85],
  ],
  calledNumbers: [1, 4, 17, 25, 28, 37, 46, 57, 58, 65, 77, 78, 81],
  currentNumber: 81,
  patterns: [
    {
      id: "1",
      name: "Single Line",
      description: "Complete any horizontal line",
      amount: "2000",
      status: "won_by_other",
      winner: "Rajesh Kumar",
    },
    {
      id: "2",
      name: "Double Line",
      description: "Complete any two horizontal lines",
      amount: "3000",
      status: "won_by_other",
      winner: "Priya Sharma",
    },
    {
      id: "3",
      name: "Four Corners",
      description: "Mark all four corner numbers",
      amount: "5000",
      status: "pending",
    },
    {
      id: "4",
      name: "Full House",
      description: "Complete all numbers on the ticket",
      amount: "10000",
      status: "pending",
    },
  ],
  winners: [
    {
      id: "1",
      playerName: "Rajesh Kumar",
      patternName: "Single Line",
      prizeAmount: "2000",
      claimTime: "2024-01-20T19:15:30",
      status: "approved",
      ticketId: "TKT-001-2024",
    },
    {
      id: "2",
      playerName: "Priya Sharma",
      patternName: "Double Line",
      prizeAmount: "3000",
      claimTime: "2024-01-20T19:22:15",
      status: "pending",
      ticketId: "TKT-045-2024",
    },
    {
      id: "3",
      playerName: "Amit Patel",
      patternName: "Four Corners",
      prizeAmount: "5000",
      claimTime: "2024-01-20T19:25:45",
      status: "pending",
      ticketId: "TKT-078-2024",
    },
    {
      id: "4",
      playerName: "Sneha Gupta",
      patternName: "Single Line",
      prizeAmount: "2000",
      claimTime: "2024-01-20T19:18:20",
      status: "denied",
      ticketId: "TKT-023-2024",
    },
  ],
};

export default function CreatorRoundPage({ params }) {
  return <CreatorRoundView roundData={mockCreatorRoundData} />;
}
