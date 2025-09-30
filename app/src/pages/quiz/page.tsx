"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { useSocket } from "@/context/SocketContext"
import { useParams } from "react-router-dom"
import type { QuizQuestion } from "@/lib/quiz"
import api from "@/lib/axios"
import axios from "axios"
import toast from "react-hot-toast"


export function ParticipantQuizView() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [showResult, setShowResult] = useState(false)
  const [status, setStatus] = useState<"waiting" | "started">("started")
  const [quizSet, setQuizSet] = useState<QuizQuestion[] | []>([
    {
      id: "2",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      timeLimit: 10,
    },
  ])
  const [quizIndex, setQuizIndex] = useState<number | null>(0)

  const socket = useSocket()
  const { roomCode } = useParams()
  
  useEffect(() => {
    // Reset state for new question
    let interval: NodeJS.Timeout | null = null
    socket.socket.on("start-quiz", (quizIndex: number) => {
      setStatus('started')
      setSelectedAnswer(null)
      setHasAnswered(false)
      setShowResult(false)
      setTimeLeft(10)
  
      // Start timer
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!hasAnswered) {
              setHasAnswered(true)
            }
            setTimeout(() => setShowResult(true), 1000)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    })

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/room/quiz-set/" + roomCode)

        if (response.status === 200) {
          setQuizSet(response.data.quizSet || [])
        }

      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.status

          if (status === 500) {
            toast.error("Encountered a server erro while fetching questions")
          }
        }
      }

    })()
  })

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || timeLeft === 0) return

    setSelectedAnswer(answerIndex)
    setHasAnswered(true)

    // TODO: Send answer to backend
    console.log("Answer submitted:", answerIndex)

    // Show result after a brief delay
    setTimeout(() => setShowResult(true), 1000)
  }

  if (status === "waiting") {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Get Ready!</CardTitle>
              <CardDescription>The quiz will start soon.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-6xl">🎯</div>
                <p className="text-muted-foreground">{quizSet.length} questions coming your way!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">
            Question {quizIndex ? quizIndex + 1 : 1} of {quizSet.length}
          </h1>
          <p className="text-muted-foreground">Welcome, Isa</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-lg">{timeLeft}s</span>
        </div>
      </div>

      {/* Timer Progress */}
      <Progress value={(timeLeft / 10) * 100} className="h-3" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-balance text-center">{quizSet[quizIndex!].question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quizSet[quizIndex!].options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = quizSet[quizIndex!].correctAnswer === index
                  const showCorrectAnswer = showResult && isCorrect
                  const showWrongAnswer = showResult && isSelected && !isCorrect

                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className={`p-6 h-auto text-left justify-start text-wrap transition-all ${
                        showCorrectAnswer
                          ? "bg-green-500 hover:bg-green-600 border-green-500"
                          : showWrongAnswer
                            ? "bg-red-500 hover:bg-red-600 border-red-500"
                            : ""
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={hasAnswered || timeLeft === 0}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showResult && (
                          <div>
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-white" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>

              {hasAnswered && !showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-6 p-4 bg-muted rounded-lg"
                >
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Answer submitted!</p>
                  <p className="text-sm text-muted-foreground">Waiting for results...</p>
                </motion.div>
              )}

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-6 p-4 bg-muted rounded-lg"
                >
                  {selectedAnswer === quizSet[quizIndex!].correctAnswer ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="font-medium text-green-600">Correct! 🎉</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="font-medium text-red-600">
                        Incorrect. The correct answer was {String.fromCharCode(65 + quizSet[quizIndex!].correctAnswer)}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
