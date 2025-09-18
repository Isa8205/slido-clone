"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuizLayout } from "@/components/quiz-layout"
import { AuthGuard } from "@/components/auth-guard"
import { getSession, clearSession } from "@/lib/auth"
import { generateRoomCode, createRoom, getRoomParticipants } from "@/lib/room"
import type { Room, Participant } from "@/lib/room"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Copy, Play, LogOut, UserPlus, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function DashboardPage() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()


  useEffect(() => {
    const session = getSession()
    if (session?.user) {
      setUser(session.user)
    }
  }, [])

  useEffect(() => {
    if (currentRoom) {
      // Simulate real-time participant updates
      const interval = setInterval(() => {
        const roomParticipants = getRoomParticipants(currentRoom.code)
        setParticipants(roomParticipants)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [currentRoom])

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true)

    // Simulate room creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const roomCode = generateRoomCode()
    const room = createRoom(roomCode, user?.name || "Host")
    setCurrentRoom(room)
    setParticipants([])

    setIsCreatingRoom(false)

    toast.success(`Room Created! Room code: ${roomCode}`)
  }

  const handleCopyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.code)
      toast.success("Room code copied to clipboard!")
    }
  }

  const handleStartQuiz = () => {
    if (currentRoom) {
      // TODO: Navigate to quiz interface
      navigate(`/quiz/${currentRoom.code}`)
    }
  }

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  return (
    <AuthGuard>
      <QuizLayout title="Dashboard">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">Create and manage your quiz sessions</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Room Creation */}
          {!currentRoom && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Start a New Quiz Session</CardTitle>
                  <CardDescription>Create a room and share the code with participants</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={handleCreateRoom} disabled={isCreatingRoom} className="text-lg py-6 px-8">
                    {isCreatingRoom ? "Creating Room..." : "Start a Room"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Active Room */}
          {currentRoom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Room Info */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">Room Active</CardTitle>
                      <CardDescription>Share this code with participants</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {currentRoom.status === "waiting" ? "Waiting" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Room Code</div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-4xl font-mono font-bold text-primary bg-muted px-6 py-3 rounded-lg">
                        {currentRoom.code}
                      </div>
                      <Button variant="outline" size="sm" onClick={handleCopyRoomCode} className="gap-2 bg-transparent">
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={handleStartQuiz}
                      disabled={participants.length === 0}
                      className="gap-2 text-lg py-6 px-8"
                    >
                      <Play className="w-5 h-5" />
                      Close Room & Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Connected Participants ({participants.length})
                  </CardTitle>
                  <CardDescription>Participants will appear here as they join</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {participants.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Waiting for participants to join...</p>
                        <p className="text-sm mt-2">
                          Share the room code: <span className="font-mono font-bold">{currentRoom.code}</span>
                        </p>
                      </motion.div>
                    ) : (
                      <div className="grid gap-3">
                        {participants.map((participant, index) => (
                          <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                {participant.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{participant.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Joined {new Date(participant.joinedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Online
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Lock className="w-4 h-4" />
                    Lock Room
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentRoom(null)}>
                    End Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </QuizLayout>
    </AuthGuard>
  )
}
