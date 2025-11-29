"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, Filter, Trophy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function PlayerHistory() {
    const router = useRouter()
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalGames: 0,
        hasNext: false,
        hasPrevious: false,
    })

    useEffect(() => {
        fetchHistory()
    }, [currentPage, statusFilter])

    const fetchHistory = async () => {
        try {
            setLoading(true)

            const token = localStorage.getItem("access_token")

            if (!token) {
                router.push("/player/login")
                return
            }

            const params = new URLSearchParams({
                page: currentPage.toString(),
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== "all" && { status: statusFilter }),
            })

            const response = await fetch(`http://localhost:8000/api/player/history/?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/player/login")
                    return
                }
                throw new Error("Failed to fetch history")
            }

            const data = await response.json()
            console.log("History data:", data)

            setGames(data.games || [])
            setPagination(data.pagination || pagination)
        } catch (error) {
            console.error("Error fetching history:", error)
            toast.error("Failed to load game history")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchHistory()
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "ongoing":
                return "bg-green-500 text-white"
            case "upcoming":
                return "bg-blue-500 text-white"
            case "paused":
                return "bg-yellow-500 text-white"
            case "completed":
                return "bg-gray-500 text-white"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            {games.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Games</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{pagination.totalGames}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Winnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">
                                ₹
                                {games
                                    .reduce((sum, game) => sum + parseFloat(game.prizeWon || 0), 0)
                                    .toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Games Won</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {games.filter((game) => parseFloat(game.prizeWon) > 0).length}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Search & Filter Bar */}
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Search by game title or organizer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Filter size={16} className="mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {games.length} of {pagination.totalGames} games
                </p>
                <p className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                </p>
            </div>

            {/* Games History Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading game history...</p>
                    </div>
                </div>
            ) : games.length > 0 ? (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Game Name</TableHead>
                                        <TableHead>Organizer</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Prize Won</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {games.map((game, index) => (
                                        <TableRow key={game.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                {(pagination.currentPage - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{game.title}</p>
                                                    <p className="text-xs text-muted-foreground">{game.rounds} Rounds</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{game.organizer}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm">{new Date(game.dateTime).toLocaleDateString()}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(game.dateTime).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(game.status)}>{getStatusText(game.status)}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {parseFloat(game.prizeWon) > 0 ? (
                                                    <div>
                                                        <p className="font-semibold text-green-600">₹{parseFloat(game.prizeWon).toLocaleString()}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            of ₹{parseFloat(game.totalPrize).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">₹0</p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link href={`/game/${game.id}/lobby`}>
                                                    <Button variant="ghost" size="sm">
                                                        <ExternalLink size={16} />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No games found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm ? "Try adjusting your search terms" : "You haven't joined any games yet"}
                        </p>
                        {!searchTerm && (
                            <Link href="/games">
                                <Button>Browse Games</Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevious || loading}
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum
                            if (pagination.totalPages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
                                    disabled={loading}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNext || loading}
                    >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                    </Button>
                </div>
            )}


        </div>
    )
}