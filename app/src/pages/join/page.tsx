"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { QuizLayout } from "@/components/quiz-layout"
import { joinRoom, getRoom } from "@/lib/room"
import { motion } from "framer-motion"
import { ArrowLeft, Users } from "lucide-react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"


export default function JoinPage() {
  const { roomCode } = useParams()
  const [name, setName] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const navigate = useNavigate()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsJoining(true)

    // Check if room exists
    const room = getRoom(roomCode || "")
    if (!room) {
      toast.error("The room code you entered doesn't exist or has ended.")
      setIsJoining(false)
      return
    }

    if (room.status !== "waiting") {
      toast.error("This quiz has already started or ended.")
      setIsJoining(false)
      return
    }

    // Join the room
    const participant = joinRoom(roomCode || "", name.trim())
    if (participant) {
      toast.success("Successfully joined the quiz!")
      // TODO: Navigate to participant waiting room or quiz
      navigate(`/quiz/${roomCode}`)
    } else {
      toast.error("Unable to join the quiz room. Please try again.")
    }

    setIsJoining(false)
  }

  return (
    <QuizLayout showHeader={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </NavLink>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">Join Quiz</CardTitle>
              <CardDescription>
                Room Code: <span className="font-mono font-bold text-foreground">{roomCode}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-lg"
                    maxLength={50}
                  />
                </div>

                <Button type="submit" className="w-full text-lg py-6 gap-2" disabled={!name.trim() || isJoining}>
                  <Users className="w-5 h-5" />
                  {isJoining ? "Joining..." : "Join Quiz"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Make sure you have a stable internet connection</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </QuizLayout>
  )
}
