"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, Trophy, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function GameCreationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    numberOfUsers: "",
    description: "",
  })

  const [prizeRounds, setPrizeRounds] = useState([
    {
      id: "1",
      name: "Round 1",
      patterns: [{ id: "1", patternName: "", prizeDescription: "", prizeAmount: "" }],
      totalPrize: 0,
    },
  ])

  const [totalPrizePool, setTotalPrizePool] = useState(0)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const updatedRounds = prizeRounds.map((round) => {
      const roundTotal = round.patterns.reduce((sum, pattern) => sum + (parseFloat(pattern.prizeAmount) || 0), 0)
      return { ...round, totalPrize: roundTotal }
    })
    const newTotalPrizePool = updatedRounds.reduce((sum, round) => sum + round.totalPrize, 0)
    setPrizeRounds(updatedRounds)
    setTotalPrizePool(newTotalPrizePool)
  }, [JSON.stringify(prizeRounds.map((r) => r.patterns.map((p) => p.prizeAmount)))])

  const addPrizeRound = () => {
    const newRoundNumber = prizeRounds.length + 1
    const newRound = {
      id: Date.now().toString(),
      name: `Round ${newRoundNumber}`,
      patterns: [{ id: Date.now().toString(), patternName: "", prizeDescription: "", prizeAmount: "" }],
      totalPrize: 0,
    }
    setPrizeRounds([...prizeRounds, newRound])
  }

  const removePrizeRound = (id) => {
    if (prizeRounds.length > 1) {
      const updatedRounds = prizeRounds.filter((round) => round.id !== id)
      const renumberedRounds = updatedRounds.map((round, index) => ({ ...round, name: `Round ${index + 1}` }))
      setPrizeRounds(renumberedRounds)
    }
  }

  const addPatternToRound = (roundId) => {
    setPrizeRounds(
      prizeRounds.map((round) =>
        round.id === roundId
          ? {
            ...round,
            patterns: [...round.patterns, { id: Date.now().toString(), patternName: "", prizeDescription: "", prizeAmount: "" }],
          }
          : round
      )
    )
  }

  const removePatternFromRound = (roundId, patternId) => {
    setPrizeRounds(
      prizeRounds.map((round) =>
        round.id === roundId && round.patterns.length > 1
          ? { ...round, patterns: round.patterns.filter((pattern) => pattern.id !== patternId) }
          : round
      )
    )
  }

  const updatePattern = (roundId, patternId, field, value) => {
    setPrizeRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
            ...round,
            patterns: round.patterns.map((p) => (p.id === patternId ? { ...p, [field]: value } : p)),
          }
          : round
      )
    )
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Game title is required"
    if (!formData.dateTime) newErrors.dateTime = "Date and time is required"
    if (!formData.numberOfUsers || parseInt(formData.numberOfUsers) < 1)
      newErrors.numberOfUsers = "Number of users must be at least 1"

    prizeRounds.forEach((round) => {
      round.patterns.forEach((pattern, index) => {
        if (!pattern.patternName.trim()) newErrors[`pattern_${round.id}_${pattern.id}`] = `Pattern name for ${round.name}, Pattern ${index + 1} is required`
        if (!pattern.prizeDescription.trim()) newErrors[`prize_${round.id}_${pattern.id}`] = `Prize description for ${round.name}, Pattern ${index + 1} is required`
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // 🔹 Fetch JWT token from localStorage
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("You must be logged in to create a game!");
        return;
      }

      // 🔹 Prepare the payload
      const payload = {
        title: formData.title,
        description: formData.description,
        number_of_users: parseInt(formData.numberOfUsers),
        total_prize_pool: totalPrizePool, // You must have computed this earlier
        date_time: formData.dateTime,
        prize_rounds: prizeRounds,
      };

      // 🔹 Send request to Django backend
      const response = await fetch("http://localhost:8000/api/creator/games/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Game created:", data);
        alert("Game created successfully!");
        // Optionally,  redirect
        router.push("/creator/games");

      } else {
        const errorData = await response.json();
        console.error("❌ Error creating game:", errorData);
        alert(`Failed to create game: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error("🚨 Network or server error:", err);
      alert("Something went wrong while creating the game.");
    }
  };


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
              {/* Game Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Trophy size={16} /> Game Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Weekend Bingo Bonanza"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTime" className="flex items-center gap-2">
                    <Calendar size={16} /> Date & Time *
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
                    <Clock size={16} /> Number of Rounds
                  </Label>
                  <Input id="numberOfRounds" type="number" value={prizeRounds.length} readOnly className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Automatically updated based on rounds below</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfUsers" className="flex items-center gap-2">
                    <Users size={16} /> Maximum Players *
                  </Label>
                  <Input
                    id="numberOfUsers"
                    type="number"
                    min="1"
                    placeholder="100"
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
                  placeholder="Describe rules or instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-lg font-semibold text-primary">Total Prize Pool</h3>
                  <p className="text-3xl font-bold text-primary">₹{totalPrizePool.toLocaleString()}</p>
                </CardContent>
              </Card>

              {/* Prize Rounds */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Prize Configuration</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addPrizeRound} className="flex items-center gap-2">
                    <Plus size={16} /> Add Round
                  </Button>
                </div>

                {prizeRounds.map((round) => (
                  <Card key={round.id} className="relative">
                    <CardHeader className="pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-base">{round.name}</CardTitle>
                        <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Total: ₹{round.totalPrize.toLocaleString()}</div>
                      </div>
                      {prizeRounds.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePrizeRound(round.id)} className="text-destructive hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {round.patterns.map((pattern) => (
                        <div key={pattern.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                          <div className="space-y-2">
                            <Label htmlFor={`pattern_${round.id}_${pattern.id}`}>Pattern Name *</Label>
                            <select
                              id={`pattern_${round.id}_${pattern.id}`}
                              value={pattern.patternName}
                              onChange={(e) => updatePattern(round.id, pattern.id, "patternName", e.target.value)}
                              className={`w-full border rounded p-2 ${errors[`pattern_${round.id}_${pattern.id}`] ? "border-destructive" : ""}`}
                            >
                              <option value="">Select a pattern...</option>
                              <optgroup label="Standard Patterns">
                                <option value="full-housie">Full House (all 15 numbers)</option>
                                <option value="any-one-line">Any One Line (Top / Middle / Bottom)</option>
                                <option value="two-lines">Two Lines (any 2 horizontal rows)</option>
                                <option value="early-five">Early Five (first 5 numbers marked)</option>
                              </optgroup>
                              <optgroup label="Corner / Block Patterns">
                                <option value="four-corners">Four Corners</option>
                              </optgroup>
                              <optgroup label="Letter / Shape Patterns">
                                <option value="t-shape">T Shape</option>
                                <option value="cross-plus">Cross / Plus (+)</option>
                                <option value="l-shape">L Shape</option>
                              </optgroup>
                              <optgroup label="Frame / Area Patterns">
                                <option value="border-shape">Border (outer frame)</option>
                              </optgroup>
                              <optgroup label="Mixed / Fun Patterns">
                                <option value="four-corners-middle">Four Corners + Middle</option>
                              </optgroup>
                            </select>
                            {errors[`pattern_${round.id}_${pattern.id}`] && <p className="text-sm text-destructive">{errors[`pattern_${round.id}_${pattern.id}`]}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`prize_${round.id}_${pattern.id}`}>Prize Description *</Label>
                            <Input
                              id={`prize_${round.id}_${pattern.id}`}
                              placeholder="Cash Prize / Gift"
                              value={pattern.prizeDescription}
                              onChange={(e) => updatePattern(round.id, pattern.id, "prizeDescription", e.target.value)}
                              className={errors[`prize_${round.id}_${pattern.id}`] ? "border-destructive" : ""}
                            />
                            {errors[`prize_${round.id}_${pattern.id}`] && <p className="text-sm text-destructive">{errors[`prize_${round.id}_${pattern.id}`]}</p>}
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
                              <Button type="button" variant="ghost" size="sm" onClick={() => removePatternFromRound(round.id, pattern.id)} className="text-destructive hover:text-destructive">
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" size="sm" onClick={() => addPatternToRound(round.id)} className="flex items-center gap-2 w-full">
                        <Plus size={16} /> Add Pattern to {round.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" size="lg" className="flex-1">Create Game</Button>
                {/* <Button type="button" variant="outline" size="lg">Save as Draft</Button> */}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
