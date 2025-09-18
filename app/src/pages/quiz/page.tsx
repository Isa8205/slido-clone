"use client"

import { useState, useEffect } from "react"
import { QuizLayout } from "@/components/quiz-layout"
import { ModeratorQuizView } from "@/components/moderator-quiz-view"
import { ParticipantQuizView } from "@/components/participant-quiz-view"
import { getSession } from "@/lib/auth"
import { getRoom } from "@/lib/room"
import { getQuizQuestions } from "@/lib/quiz"
import type { QuizSession } from "@/lib/quiz"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"

export default function QuizPage() {
  const { roomCode } = useParams()
  const [session, setSession] = useState<any>(null)
  const [room, setRoom] = useState<any>(null)
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModerator, setIsModerator] = useState(false)

  useEffect(() => {
    const userSession = getSession()
    const roomData = getRoom(roomCode || "")

    if (!roomData) {
      // Room not found
      setIsLoading(false)
      return
    }

    setSession(userSession)
    setRoom(roomData)
    setIsModerator(userSession?.user?.name === roomData.hostName)

    // Initialize quiz session
    const questions = getQuizQuestions()
    const quiz: QuizSession = {
      roomCode,
      questions,
      currentQuestionIndex: 0,
      status: "waiting",
      startTime: null,
      responses: new Map(),
      scores: new Map(),
    }

    setQuizSession(quiz)
    setIsLoading(false)
  }, [roomCode])

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

  if (!room || !quizSession) {
    return (
      <QuizLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
            <p className="text-muted-foreground">The quiz room "{roomCode}" does not exist or has ended.</p>
          </div>
        </div>
      </QuizLayout>
    )
  }

  return (
    <QuizLayout title={`Quiz Room: ${roomCode}`}>
      {isModerator ? (
        <ModeratorQuizView quizSession={quizSession} onQuizUpdate={setQuizSession} room={room} />
      ) : (
        <ParticipantQuizView quizSession={quizSession} participantName={session?.user?.name || "Anonymous"} />
      )}
    </QuizLayout>
  )
}
