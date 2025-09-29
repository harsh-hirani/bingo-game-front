"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { Calendar, Clock, Users, Trophy, Plus, Trash2 } from "lucide-react"

const BINGO_PATTERNS = [
  // Standard patterns
  { value: "full-house", label: "Full House (all 15 numbers)" },
  { value: "any-one-line", label: "Any One Line (Top / Middle / Bottom)" },
  { value: "two-lines", label: "Two Lines (any 2 horizontal rows)" },
  { value: "early-five", label: "Early Five (first 5 numbers marked)" },

  // Corner / block patterns
  { value: "four-corners", label: "Four Corners" },
  { value: "postage-stamp", label: "Postage Stamp (2×2 block)" },
  { value: "window", label: "Window (two opposite 2×2 blocks)" },

  // Letter / shape patterns
  { value: "t-shape", label: "T Shape" },
  { value: "cross-plus", label: "Cross / Plus (+)" },
  { value: "x-shape", label: "X Shape (diagonals)" },
  { value: "h-shape", label: "H Shape" },
  { value: "e-shape", label: "E Shape" },
  { value: "l-shape", label: "L Shape" },
  { value: "i-shape", label: "I Shape (full column)" },

  // Frame / area patterns
  { value: "border", label: "Border (outer frame)" },
  { value: "center-line", label: "Center Line / Center Block" },
  { value: "diamond", label: "Diamond" },

  // Mixed / fun patterns
  { value: "four-corners-middle", label: "Four Corners + Middle" },
  { value: "zig-zag", label: "Zig-Zag / Staircase" },
  { value: "wave-pattern", label: "Wave Pattern" },
]

interface PrizePattern {
  id: string
  patternName: string
  prizeDescription: string
  prizeAmount: string
}

interface PrizeRound {
  id: string
  name: string
  patterns: PrizePattern[]
  totalPrize: number
}

export function GameCreationForm() {
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    numberOfUsers: "",
    description: "",
  })

  const [prizeRounds, setPrizeRounds] = useState<PrizeRound[]>([
    {
      id: "1",
      name: "Round 1",
      patterns: [{ id: "1", patternName: "", prizeDescription: "", prizeAmount: "" }],
      totalPrize: 0,
    },
  ])

  const [totalPrizePool, setTotalPrizePool] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const updatedRounds = prizeRounds.map((round) => {
      const roundTotal = round.patterns.reduce((sum, pattern) => {
        const amount = Number.parseFloat(pattern.prizeAmount) || 0
        return sum + amount
      }, 0)
      return { ...round, totalPrize: roundTotal }
    })

    const newTotalPrizePool = updatedRounds.reduce((sum, round) => sum + round.totalPrize, 0)

    setPrizeRounds(updatedRounds)
    setTotalPrizePool(newTotalPrizePool)
  }, [prizeRounds.map((r) => r.patterns.map((p) => p.prizeAmount).join(",")).join("|")])

  const addPrizeRound = () => {
    const newRoundNumber = prizeRounds.length + 1
    const newRound: PrizeRound = {
      id: Date.now().toString(),
      name: `Round ${newRoundNumber}`,
      patterns: [{ id: Date.now().toString(), patternName: "", prizeDescription: "", prizeAmount: "" }],
      totalPrize: 0,
    }
    setPrizeRounds([...prizeRounds, newRound])
  }

  const removePrizeRound = (id: string) => {
    if (prizeRounds.length > 1) {
      const updatedRounds = prizeRounds.filter((round) => round.id !== id)
      const renumberedRounds = updatedRounds.map((round, index) => ({
        ...round,
        name: `Round ${index + 1}`,
      }))
      setPrizeRounds(renumberedRounds)
    }
  }

  const addPatternToRound = (roundId: string) => {
    setPrizeRounds(
      prizeRounds.map((round) => {
        if (round.id === roundId) {
          const newPattern: PrizePattern = {
            id: Date.now().toString(),
            patternName: "",
            prizeDescription: "",
            prizeAmount: "",
          }
          return { ...round, patterns: [...round.patterns, newPattern] }
        }
        return round
      }),
    )
  }

  const removePatternFromRound = (roundId: string, patternId: string) => {
    setPrizeRounds(
      prizeRounds.map((round) => {
        if (round.id === roundId && round.patterns.length > 1) {
          return { ...round, patterns: round.patterns.filter((pattern) => pattern.id !== patternId) }
        }
        return round
      }),
    )
  }

  const updatePattern = (roundId: string, patternId: string, field: keyof PrizePattern, value: string) => {
    setPrizeRounds(
      prizeRounds.map((round) => {
        if (round.id === roundId) {
          return {
            ...round,
            patterns: round.patterns.map((pattern) =>
              pattern.id === patternId ? { ...pattern, [field]: value } : pattern,
            ),
          }
        }
        return round
      }),
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Game title is required"
    if (!formData.dateTime) newErrors.dateTime = "Date and time is required"
    if (!formData.numberOfUsers || Number.parseInt(formData.numberOfUsers) < 1) {
      newErrors.numberOfUsers = "Number of users must be at least 1"
    }

    // Validate prize rounds
    prizeRounds.forEach((round, roundIndex) => {
      round.patterns.forEach((pattern, patternIndex) => {
        if (!pattern.patternName.trim()) {
          newErrors[`pattern_${round.id}_${pattern.id}`] =
            `Pattern name for ${round.name}, Pattern ${patternIndex + 1} is required`
        }
        if (!pattern.prizeDescription.trim()) {
          newErrors[`prize_${round.id}_${pattern.id}`] =
            `Prize description for ${round.name}, Pattern ${patternIndex + 1} is required`
        }
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Game created:", { formData, prizeRounds, totalPrizePool })
      // Handle game creation
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
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
                    Number of Rounds
                  </Label>
                  <Input id="numberOfRounds" type="number" value={prizeRounds.length} readOnly className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Automatically updated based on rounds added below</p>
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

              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-primary">Total Prize Pool</h3>
                    <p className="text-3xl font-bold text-primary">₹{totalPrizePool.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

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
                  {prizeRounds.map((round, roundIndex) => (
                    <Card key={round.id} className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CardTitle className="text-base">{round.name}</CardTitle>
                            <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                              Total: ₹{round.totalPrize.toLocaleString()}
                            </div>
                          </div>
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
                        {round.patterns.map((pattern, patternIndex) => (
                          <div key={pattern.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                            <div className="space-y-2">
                              <Label htmlFor={`pattern_${round.id}_${pattern.id}`}>Pattern Name *</Label>
                              <Combobox
                                options={BINGO_PATTERNS}
                                value={BINGO_PATTERNS.find((p) => p.label === pattern.patternName)?.value || ""}
                                onValueChange={(value) => {
                                  const selectedPattern = BINGO_PATTERNS.find((p) => p.value === value)
                                  if (selectedPattern) {
                                    updatePattern(round.id, pattern.id, "patternName", selectedPattern.label)
                                  }
                                }}
                                placeholder="Select a pattern..."
                                searchPlaceholder="Search patterns..."
                                emptyText="No pattern found."
                                className={errors[`pattern_${round.id}_${pattern.id}`] ? "border-destructive" : ""}
                              />
                              {errors[`pattern_${round.id}_${pattern.id}`] && (
                                <p className="text-sm text-destructive">
                                  {errors[`pattern_${round.id}_${pattern.id}`]}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`prize_${round.id}_${pattern.id}`}>Prize Description *</Label>
                              <Input
                                id={`prize_${round.id}_${pattern.id}`}
                                placeholder="e.g., Cash Prize, Gift Voucher"
                                value={pattern.prizeDescription}
                                onChange={(e) =>
                                  updatePattern(round.id, pattern.id, "prizeDescription", e.target.value)
                                }
                                className={errors[`prize_${round.id}_${pattern.id}`] ? "border-destructive" : ""}
                              />
                              {errors[`prize_${round.id}_${pattern.id}`] && (
                                <p className="text-sm text-destructive">{errors[`prize_${round.id}_${pattern.id}`]}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`amount_${round.id}_${pattern.id}`}>Prize Amount</Label>
                              <Input
                                id={`amount_${round.id}_${pattern.id}`}
                                type="number"
                                placeholder="5000"
                                value={pattern.prizeAmount}
                                onChange={(e) => updatePattern(round.id, pattern.id, "prizeAmount", e.target.value)}
                              />
                            </div>

                            <div className="flex items-end">
                              {round.patterns.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePatternFromRound(round.id, pattern.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addPatternToRound(round.id)}
                          className="flex items-center gap-2 w-full"
                        >
                          <Plus size={16} />
                          Add Pattern to {round.name}
                        </Button>
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
    </div>
  )
}
