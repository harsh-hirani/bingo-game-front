import { RoundView } from "@/components/game/round-view";

// Mock data with user-specific information
const mockUserRoundData = {
  id: "1",
  number: 2,
  status: "live",
  ticketNumbers: [
    [1, null, 25, null, 57, null, 77, null, 83],
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
      status: "won_by_you",
      prizeCode: "BG2024-SL-001",
    },
    {
      id: "2",
      name: "Double Line",
      description: "Complete any two horizontal lines",
      amount: "3000",
      status: "won_by_you",
      prizeCode: "BG2024-DL-002",
    },
    {
      id: "3",
      name: "Four Corners",
      description: "Mark all four corner numbers",
      amount: "5000",
      status: "won_by_other",
      winner: "Priya Sharma",
    },
    {
      id: "4",
      name: "Full House",
      description: "Complete all numbers on the ticket",
      amount: "10000",
      status: "pending",
    },
  ],
};

export default function UserRoundPage({ params }) {
  return <RoundView userType="user" roundData={mockUserRoundData} />;
}
