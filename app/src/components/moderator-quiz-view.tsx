"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { QuizSession } from "@/lib/quiz"
import type { Room } from "@/lib/room"
import { motion, AnimatePresence } from "framer-motion"
import { Play, SkipForward, Users, Clock, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ModeratorQuizViewProps {
  quizSession: QuizSession
  onQuizUpdate: (session: QuizSession) => void
  room: Room
}

export function ModeratorQuizView({ quizSession, onQuizUpdate, room }: ModeratorQuizViewProps) {
  const [timeLeft, setTimeLeft] = useState(10)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const navigate = useNavigate()

  const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex]
  const isLastQuestion = quizSession.currentQuestionIndex === quizSession.questions.length - 1

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeLeft])

  const handleStartQuiz = () => {
    const updatedSession = {
      ...quizSession,
      status: "active" as const,
      startTime: new Date(),
    }
    onQuizUpdate(updatedSession)
    startQuestion()
  }

  const startQuestion = () => {
    setTimeLeft(10)
    setIsTimerActive(true)
  }

  const handleTimeUp = () => {
    // Show results for current question
    setTimeout(() => {
      if (isLastQuestion) {
        // Quiz finished, go to results
        navigate(`/results/${room.code}`)
      } else {
        // Next question
        handleNextQuestion()
      }
    }, 3000)
  }

  const handleNextQuestion = () => {
    const updatedSession = {
      ...quizSession,
      currentQuestionIndex: quizSession.currentQuestionIndex + 1,
    }
    onQuizUpdate(updatedSession)
    startQuestion()
  }

  const handleSkipQuestion = () => {
    setIsTimerActive(false)
    handleTimeUp()
  }

  const getResponseCount = (optionIndex: number) => {
    // Mock response data
    return Math.floor(Math.random() * 10)
  }

  const getTotalResponses = () => {
    return room.participants.length
  }

  if (quizSession.status === "waiting") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Start Quiz?</CardTitle>
              <CardDescription>
                {quizSession.questions.length} questions • {room.participants.length} participants connected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{quizSession.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{room.participants.length}</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">10s</div>
                  <div className="text-sm text-muted-foreground">Per Question</div>
                </div>
              </div>

              <Button onClick={handleStartQuiz} className="text-lg py-6 px-8 gap-2">
                <Play className="w-5 h-5" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
          </h1>
          <p className="text-muted-foreground">{getTotalResponses()} participants</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-2">
            <Clock className="w-4 h-4" />
            {timeLeft}s
          </Badge>
          <Button variant="outline" onClick={handleSkipQuestion} className="gap-2 bg-transparent">
            <SkipForward className="w-4 h-4" />
            Skip
          </Button>
        </div>
      </div>

      {/* Timer Progress */}
      <Progress value={(timeLeft / 10) * 100} className="h-2" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question Display */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={quizSession.currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-balance">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        currentQuestion.correctAnswer === index
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-border bg-muted"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{getResponseCount(index)} responses</span>
                          {currentQuestion.correctAnswer === index && (
                            <Badge variant="default" className="bg-green-500">
                              Correct
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const responses = getResponseCount(index)
                  const percentage = getTotalResponses() > 0 ? (responses / getTotalResponses()) * 100 : 0

                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Option {String.fromCharCode(65 + index)}</span>
                        <span>
                          {responses}/{getTotalResponses()}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.floor(Math.random() * getTotalResponses()) + 1}/{getTotalResponses()}
                </div>
                <div className="text-sm text-muted-foreground">Answered</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
