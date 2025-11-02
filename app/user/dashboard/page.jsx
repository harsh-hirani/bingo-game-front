"use client";
import { GameList } from "@/components/game/game-list";
import { MainNav } from "@/components/navigation/main-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
// Mock data - replace with actual data fetching

export default function UserDashboard() {

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("access_token"); // JWT access token
        const response = await fetch("http://localhost:8000/api/games/listlatest/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // attach token if present
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);
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
        {loading ? (
          <p>Loading games...</p>):
        <GameList userType="user" games={games} showPagination={true} />}
      </div>
    </div>
  );
}
