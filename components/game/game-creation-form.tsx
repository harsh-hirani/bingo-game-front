"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, Trophy, Plus, Trash2 } from "lucide-react"

interface PrizeRound {
  id: string
  patternName: string
  prizeDescription: string
  prizeAmount: string
}

export function GameCreationForm() {
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    numberOfRounds: "1",
    numberOfUsers: "",
    description: "",
  })

  const [prizeRounds, setPrizeRounds] = useState<PrizeRound[]>([
    { id: "1", patternName: "", prizeDescription: "", prizeAmount: "" },
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const addPrizeRound = () => {
    const newRound: PrizeRound = {
      id: Date.now().toString(),
      patternName: "",
      prizeDescription: "",
      prizeAmount: "",
    }
    setPrizeRounds([...prizeRounds, newRound])
  }

  const removePrizeRound = (id: string) => {
    if (prizeRounds.length > 1) {
      setPrizeRounds(prizeRounds.filter((round) => round.id !== id))
    }
  }

  const updatePrizeRound = (id: string, field: keyof PrizeRound, value: string) => {
    setPrizeRounds(prizeRounds.map((round) => (round.id === id ? { ...round, [field]: value } : round)))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Game title is required"
    if (!formData.dateTime) newErrors.dateTime = "Date and time is required"
    if (!formData.numberOfUsers || Number.parseInt(formData.numberOfUsers) < 1) {
      newErrors.numberOfUsers = "Number of users must be at least 1"
    }

    // Validate prize rounds
    prizeRounds.forEach((round, index) => {
      if (!round.patternName.trim()) {
        newErrors[`pattern_${round.id}`] = `Pattern name for round ${index + 1} is required`
      }
      if (!round.prizeDescription.trim()) {
        newErrors[`prize_${round.id}`] = `Prize description for round ${index + 1} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Game created:", { formData, prizeRounds })
      // Handle game creation
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary" size={24} />
            Create New Game
          </CardTitle>
          <CardDescription>Set up a new Bingo game with custom rules and prizes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Game Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Trophy size={16} />
                  Game Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekend Bingo Bonanza"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTime" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Date & Time *
                </Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  className={errors.dateTime ? "border-destructive" : ""}
                />
                {errors.dateTime && <p className="text-sm text-destructive">{errors.dateTime}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numberOfRounds" className="flex items-center gap-2">
                  <Clock size={16} />
                  Number of Rounds *
                </Label>
                <Input
                  id="numberOfRounds"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.numberOfRounds}
                  onChange={(e) => setFormData({ ...formData, numberOfRounds: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfUsers" className="flex items-center gap-2">
                  <Users size={16} />
                  Maximum Players *
                </Label>
                <Input
                  id="numberOfUsers"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={formData.numberOfUsers}
                  onChange={(e) => setFormData({ ...formData, numberOfUsers: e.target.value })}
                  className={errors.numberOfUsers ? "border-destructive" : ""}
                />
                {errors.numberOfUsers && <p className="text-sm text-destructive">{errors.numberOfUsers}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Game Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your game, rules, or any special instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Prize Rounds Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Prize Configuration</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPrizeRound}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Plus size={16} />
                  Add Round
                </Button>
              </div>

              <div className="space-y-4">
                {prizeRounds.map((round, index) => (
                  <Card key={round.id} className="relative">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Round {index + 1}</CardTitle>
                        {prizeRounds.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePrizeRound(round.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`pattern_${round.id}`}>Pattern Name *</Label>
                          <Input
                            id={`pattern_${round.id}`}
                            placeholder="e.g., Full House, Line, Corner"
                            value={round.patternName}
                            onChange={(e) => updatePrizeRound(round.id, "patternName", e.target.value)}
                            className={errors[`pattern_${round.id}`] ? "border-destructive" : ""}
                          />
                          {errors[`pattern_${round.id}`] && (
                            <p className="text-sm text-destructive">{errors[`pattern_${round.id}`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`prize_${round.id}`}>Prize Description *</Label>
                          <Input
                            id={`prize_${round.id}`}
                            placeholder="e.g., Cash Prize, Gift Voucher"
                            value={round.prizeDescription}
                            onChange={(e) => updatePrizeRound(round.id, "prizeDescription", e.target.value)}
                            className={errors[`prize_${round.id}`] ? "border-destructive" : ""}
                          />
                          {errors[`prize_${round.id}`] && (
                            <p className="text-sm text-destructive">{errors[`prize_${round.id}`]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`amount_${round.id}`}>Prize Amount</Label>
                          <Input
                            id={`amount_${round.id}`}
                            placeholder="e.g., ₹5000"
                            value={round.prizeAmount}
                            onChange={(e) => updatePrizeRound(round.id, "prizeAmount", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" size="lg" className="flex-1">
                Create Game
              </Button>
              <Button type="button" variant="outline" size="lg">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
