"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState("")
  const navigate = useNavigate()

  const handleJoinQuiz = () => {
    if (roomCode.trim() && roomCode.length === 6) {
      navigate(`/join/${roomCode.toUpperCase()}`)
    }
  }

  const handleHostQuiz = () => {
    navigate("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black text-foreground mb-4 text-balance">QuizMaster</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">Interactive Quizzes Made Simple</p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span>Real-time participation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-secondary" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-5 h-5 text-accent" />
              <span>Live leaderboards</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Join a Quiz</CardTitle>
                <CardDescription className="text-center">
                  Enter the room code to participate in a live quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="roomCode" className="text-sm font-medium">
                    Room Code
                  </label>
                  <Input
                    id="roomCode"
                    placeholder="Enter 6-digit code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="text-center text-lg font-mono tracking-wider"
                    maxLength={6}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleJoinQuiz()
                      }
                    }}
                  />
                </div>
                <Button onClick={handleJoinQuiz} className="w-full text-lg py-6" disabled={roomCode.length !== 6}>
                  Join Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Host a Quiz</CardTitle>
                <CardDescription className="text-center">
                  Create and manage your own interactive quiz session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Create custom questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span>Monitor participant responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>View real-time analytics</span>
                  </div>
                </div>
                <Button onClick={handleHostQuiz} className="w-full text-lg py-6">
                  Host a Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground">Trusted by educators, trainers, and event organizers worldwide</p>
        </motion.div>
      </div>
    </div>
  )
}
