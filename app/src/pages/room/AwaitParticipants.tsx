import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuizLayout } from "@/components/quiz-layout"
import { getSession, type User } from "@/lib/auth"
import type { Participant } from "@/lib/room"
import { motion, AnimatePresence } from "framer-motion"
import { Users, UserPlus, LogOut } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "@/hooks/useSocket"

export default function AwaitParticipantsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])

  const { roomCode } = useParams()
  const navigate = useNavigate()

  if (!roomCode || !user) {
    navigate("/")
  }
  const socket = useSocket(roomCode!)

  const handleLeaveRoom = () => {
    socket.emit("leave-room", user?.name)
    navigate("/")
  }

  useEffect(() => {
    const session = getSession()
    if (session?.user) {
      setUser(session.user)
    }
  }, [])

  useEffect(() => {
    socket.on("new-participant", (p) => setParticipants(prev => [...prev, p]))

    return () => {
        socket.off("new-participant")
    }
  }, [socket])

  return (
    <QuizLayout title="Room">
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
                    <p className="text-muted-foreground">The quiz session will begin once participants join</p>
                </div>

                <button className="inline-flex px-3 py-1 items-center gap-2 rounded-full bg-destructive/30 text-red-600 cursor-pointer hover:opacity-80">
                    <LogOut className="w-4 h-4" />
                    Leave
                </button>
            </div>


            {/* Active Room */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >

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
                                Share the room code: <span className="font-mono font-bold">{roomCode}</span>
                            </p>
                            </motion.div>
                        ) : (
                            <div className="grid gap-3">
                            {participants.map((participant, index) => (
                                <motion.div
                                key={index}
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

            </motion.div>
        </div>
    </QuizLayout>
  )
}
