"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, User, Trophy, Clock, AlertCircle } from "lucide-react"

export function CreatorRoundControls({ winners, onApproveWinner, onDenyWinner }) {
  const [selectedWinner, setSelectedWinner] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground"
      case "denied":
        return "bg-destructive text-destructive-foreground"
      case "pending":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />
      case "denied":
        return <XCircle size={16} />
      case "pending":
        return <Clock size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const pendingWinners = winners.filter((w) => w.status === "pending")
  const processedWinners = winners.filter((w) => w.status !== "pending")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="text-primary" size={24} />
          Winner Management
        </h3>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-warning/10">
            {pendingWinners.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-success/10">
            {processedWinners.filter((w) => w.status === "approved").length} Approved
          </Badge>
        </div>
      </div>

      {/* Pending Winners */}
      {pendingWinners.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-warning">Pending Approvals</h4>
          <div className="grid gap-4">
            {pendingWinners.map((winner) => (
              <Card key={winner.id} className="border-warning/20 bg-warning/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-warning/10 text-warning">
                        <User size={16} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{winner.playerName}</CardTitle>
                        <p className="text-sm text-muted-foreground">Ticket ID: {winner.ticketId}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(winner.status)}>
                      {getStatusIcon(winner.status)}
                      <span className="ml-1 capitalize">{winner.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Pattern:</span>
                        <p className="font-medium">{winner.patternName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Prize:</span>
                        <p className="font-medium text-primary">₹{winner.prizeAmount}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Claimed at: {new Date(winner.claimTime).toLocaleString("en-IN")}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedWinner(winner)}
                            className="flex-1"
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Winner Details</DialogTitle>
                            <DialogDescription>Review the winning claim for verification</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Player Name</label>
                                <p className="font-medium">{selectedWinner?.playerName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Ticket ID</label>
                                <p className="font-mono text-sm">{selectedWinner?.ticketId}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Pattern</label>
                                <p className="font-medium">{selectedWinner?.patternName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Prize Amount</label>
                                <p className="font-medium text-primary">₹{selectedWinner?.prizeAmount}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Claim Time</label>
                              <p className="text-sm">
                                {selectedWinner && new Date(selectedWinner.claimTime).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        onClick={() => onApproveWinner(winner.id)}
                        className="bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDenyWinner(winner.id)}>
                        <XCircle size={16} className="mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processed Winners */}
      {processedWinners.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Processed Winners</h4>
          <div className="grid gap-3">
            {processedWinners.map((winner) => (
              <Card key={winner.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted text-muted-foreground">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{winner.playerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {winner.patternName} - ₹{winner.prizeAmount}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(winner.status)} variant="outline">
                      {getStatusIcon(winner.status)}
                      <span className="ml-1 capitalize">{winner.status}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {winners.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No winners yet</p>
            <p className="text-sm text-muted-foreground">Winners will appear here when players claim prizes</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
