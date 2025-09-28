"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, Trophy, X } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import api from "./lib/axios"
import axios from "axios"
import { clearSession } from "./lib/auth"
import { useAuth } from "./context/AuthContext"
import { useSocket } from "./context/SocketContext"

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState("")
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isPinging, setIsPinging] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleJoinQuiz = async() => {
    setIsPinging(true)
    try {
      if (roomCode.trim() && roomCode.length === 6) {
        await api.get(`/room/ping/${roomCode}`);

        // Only runs for 2xx codes
        setIsJoinModalOpen(true);
        return
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 404) {
          toast.error("The room code you entered doesn't exist!");
        } else if (status === 302) {
          toast.error("The room has ended!");
        } else {
          toast.error("Something went wrong, please try again." + err.message);
        }
      } else {
        toast.error("Unexpected error.");
      }
    } finally {
      setIsPinging(false)
    }
  }

  const handleHostQuiz = () => {
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* <Header /> */}
      <header className="border-b border-border bg-card px-8 flex justify-between">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">QuizMaster</h1>
        </div>

        <div className="px-4 py-4">
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Button className="" onClick={() => clearSession()}>Logout</Button>
              <img className="h-10 w-10 rounded-full" src="https://picsum.photos/200/200" alt="profile" />
            </div>
          ) : (
            <Button onClick={() => navigate("/auth/login")}>Login</Button>
          )}
        </div>
      </header>

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
                <CardTitle className="text-2xl font-bold text-center">Join a Room</CardTitle>
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
                <Button onClick={handleJoinQuiz} className="w-full text-lg py-6" disabled={roomCode.length !== 6 || isPinging}>
                  Proceed
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

      {isJoinModalOpen && <JoinModal roomCode={roomCode} onClose={() => setIsJoinModalOpen(false)} />}
    </div>
  )
}

const JoinModal = ({roomCode, onClose}: {roomCode: string, onClose: () => void}) => {
  const [username, setUsername] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const navigate = useNavigate()
  const { joinRoom } = useSocket()

  const handleJoin = async(e: FormEvent) => {
    e.preventDefault()
    setIsJoining(true);
    try {
      const res = await api.post(`room/join/${roomCode}`, { username })
      if (res.status === 200) {
        joinRoom({ roomCode, token: res.data.token })
        toast.success(`Welcome to the room ${username}!`)
        navigate(`/room/${roomCode}`)
      }
    } catch (err) {
      console.error("Encountered and error joining room: ", err)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <button onClick={onClose}><X className="w-6 h-6" /></button>
            <CardTitle className="text-3xl font-bold text-primary">Enter Username</CardTitle>
            <CardDescription>
              Room Code: <span className="font-mono font-bold text-foreground">{roomCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="text-lg"
                  maxLength={50}
                />
              </div>

              <Button onClick={handleJoin} type="button" className="w-full text-lg py-6 gap-2" disabled={!username.trim() || isJoining}>
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
  )
}