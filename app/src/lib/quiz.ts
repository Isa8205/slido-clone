export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  timeLimit: number
}

export interface QuizResponse {
  participantId: string
  questionId: string
  selectedAnswer: number
  timestamp: Date
  isCorrect: boolean
}

export interface QuizSession {
  roomCode: string
  questions: QuizQuestion[]
  currentQuestionIndex: number
  status: "waiting" | "active" | "finished"
  startTime: Date | null
  responses: Map<string, QuizResponse[]>
  scores: Map<string, number>
}

// Sample quiz questions
const sampleQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    timeLimit: 10,
  },
  {
    id: "2",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    timeLimit: 10,
  },
  {
    id: "3",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    timeLimit: 10,
  },
  {
    id: "4",
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
    correctAnswer: 2,
    timeLimit: 10,
  },
  {
    id: "5",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    timeLimit: 10,
  },
]

export function getQuizQuestions(): QuizQuestion[] {
  return sampleQuestions
}

export function submitAnswer(
  sessionId: string,
  participantId: string,
  questionId: string,
  selectedAnswer: number,
): QuizResponse {
  const question = sampleQuestions.find((q) => q.id === questionId)
  if (!question) {
    throw new Error("Question not found")
  }

  const response: QuizResponse = {
    participantId,
    questionId,
    selectedAnswer,
    timestamp: new Date(),
    isCorrect: selectedAnswer === question.correctAnswer,
  }

  // TODO: Store response in backend
  console.log("Answer submitted:", response)

  return response
}

export function calculateScore(responses: QuizResponse[]): number {
  return responses.filter((r) => r.isCorrect).length
}

export function getLeaderboard(sessionId: string): Array<{
  participantId: string
  participantName: string
  score: number
  totalQuestions: number
}> {
  // TODO: Implement real leaderboard calculation
  return [
    { participantId: "1", participantName: "Alice", score: 5, totalQuestions: 5 },
    { participantId: "2", participantName: "Bob", score: 4, totalQuestions: 5 },
    { participantId: "3", participantName: "Charlie", score: 3, totalQuestions: 5 },
  ]
}
