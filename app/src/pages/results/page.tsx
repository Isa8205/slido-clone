"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuizLayout } from "@/components/quiz-layout"
import { getSession } from "@/lib/auth"
import { getRoom } from "@/lib/room"
import { getLeaderboard } from "@/lib/quiz"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Medal, Award, RotateCcw, Home, Share2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast/headless"

interface ResultsPageProps {
  params: Promise<{ roomCode: string }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { roomCode } = use(params)
  const [session, setSession] = useState<any>(null)
  const [room, setRoom] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [isModerator, setIsModerator] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const userSession = getSession()
    const roomData = getRoom(roomCode)

    if (!roomData) {
      setIsLoading(false)
      return
    }

    setSession(userSession)
    setRoom(roomData)
    setIsModerator(userSession?.user?.name === roomData.hostName)

    // Get leaderboard data
    const results = getLeaderboard(roomCode)
    setLeaderboard(results)
    setIsLoading(false)
  }, [roomCode])

  const handleRestartQuiz = () => {
    // TODO: Reset quiz session and redirect to dashboard
    navigate("/dashboard")
    toast.success("Quiz session reset. You can start a new quiz from your dashboard.")
  }

  const handleEndSession = () => {
    // TODO: Clean up session and redirect to dashboard
    navigate("/dashboard")
    toast.success("Session ended. Thanks for using QuizMaster!")
  }

  const handleShareResults = () => {
    const resultsText = `QuizMaster Results for Room ${roomCode}:\n${leaderboard
      .map((p, i) => `${i + 1}. ${p.participantName}: ${p.score}/${p.totalQuestions}`)
      .join("\n")}`

    navigator.clipboard.writeText(resultsText)
    toast.success("Leaderboard copied to clipboard")
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</div>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      case 2:
        return "border-gray-400 bg-gray-50 dark:bg-gray-950"
      case 3:
        return "border-amber-600 bg-amber-50 dark:bg-amber-950"
      default:
        return "border-border bg-card"
    }
  }

  if (isLoading) {
    return (
      <QuizLayout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      </QuizLayout>
    )
  }

  if (!room) {
    return (
      <QuizLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Results Not Found</h2>
            <p className="text-muted-foreground">The quiz results for room "{roomCode}" are not available.</p>
            <Button onClick={handleGoHome} className="mt-4">
              Go Home
            </Button>
          </div>
        </div>
      </QuizLayout>
    )
  }

  return (
    <QuizLayout title="Quiz Results">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Quiz Complete! 🎉</h1>
          <p className="text-xl text-muted-foreground">Room: {roomCode}</p>
          <p className="text-muted-foreground">{leaderboard.length} participants • 5 questions</p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Final Leaderboard
              </CardTitle>
              <CardDescription>Congratulations to all participants!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {leaderboard.map((participant, index) => {
                    const rank = index + 1
                    const percentage = Math.round((participant.score / participant.totalQuestions) * 100)

                    return (
                      <motion.div
                        key={participant.participantId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 transition-all ${getRankColor(rank)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getRankIcon(rank)}
                            <div>
                              <div className="font-bold text-lg">{participant.participantName}</div>
                              <div className="text-sm text-muted-foreground">
                                {participant.score} out of {participant.totalQuestions} correct
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{percentage}%</div>
                            <Badge variant={rank <= 3 ? "default" : "secondary"}>
                              {rank === 1 ? "Winner!" : `#${rank}`}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(leaderboard.reduce((acc, p) => acc + p.score, 0) / leaderboard.length)}
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary">{leaderboard[0]?.score || 0}</div>
                <div className="text-sm text-muted-foreground">Highest Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent">{leaderboard.length}</div>
                <div className="text-sm text-muted-foreground">Total Participants</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                {isModerator ? "Manage your quiz session" : "Thanks for participating!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleShareResults} variant="outline" className="gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>

                {isModerator ? (
                  <>
                    <Button onClick={handleRestartQuiz} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Start New Quiz
                    </Button>
                    <Button onClick={handleEndSession} variant="outline">
                      End Session
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleGoHome} className="gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </QuizLayout>
  )
}
