import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, User, Trophy } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Trophy size={32} />
            <h1 className="text-2xl font-bold">BingoHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/user/login">Player Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/creator/login">Creator Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-balance">Professional Bingo & Housie Platform</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Create engaging Bingo games with real-time features, prize management, and seamless player experience.
            Perfect for clubs, organizations, and events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth/creator/register">Start Creating Games</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/auth/user/register">Join as Player</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Choose Your Experience</h3>
          <p className="text-muted-foreground text-lg">Whether you're organizing games or playing them</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Creator Card */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Building2 size={24} />
                </div>
                <CardTitle className="text-2xl">Game Creator</CardTitle>
              </div>
              <CardDescription className="text-base">
                Organize and manage professional Bingo games with advanced features
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Create unlimited games with custom rules</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Real-time game management and controls</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Prize pool management and winner verification</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Detailed analytics and reporting</span>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/auth/creator/register">Register as Creator</Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/auth/creator/login">Creator Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Player Card */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
                  <User size={24} />
                </div>
                <CardTitle className="text-2xl">Player</CardTitle>
              </div>
              <CardDescription className="text-base">
                Join exciting Bingo games and compete for amazing prizes
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Join games from multiple organizers</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Real-time gameplay with live updates</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Track your winnings and game history</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Mobile-optimized gaming experience</span>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/auth/user/register">Register as Player</Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/auth/user/login">Player Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card/50 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Games Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">50K+</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-success">₹10L+</div>
              <div className="text-sm text-muted-foreground">Prizes Distributed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-warning">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Trophy size={24} />
              <span className="font-bold">BingoHub</span>
            </div>
            <div className="text-sm text-muted-foreground">© 2024 BingoHub. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
