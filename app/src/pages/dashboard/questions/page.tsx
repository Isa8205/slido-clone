"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QuizLayout } from "@/components/quiz-layout"
import { AuthGuard } from "@/components/auth-guard"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ArrowLeft, Save, X } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

interface Choice {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  question: string
  choices: Choice[]
  timeLimit: number
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    question: "",
    choices: [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
    ],
    timeLimit: 10,
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load saved questions from localStorage
    const savedQuestions = localStorage.getItem("quiz-questions")
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions))
    }
  }, [])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addChoice = () => {
    const newChoice: Choice = {
      id: generateId(),
      text: "",
      isCorrect: false,
    }
    setCurrentQuestion((prev) => ({
      ...prev,
      choices: [...prev.choices, newChoice],
    }))
  }

  const removeChoice = (choiceId: string) => {
    if (currentQuestion.choices.length <= 2) {
      toast.error("A question must have at least 2 choices",)
      return
    }

    setCurrentQuestion((prev) => ({
      ...prev,
      choices: prev.choices.filter((choice) => choice.id !== choiceId),
    }))
  }

  const updateChoice = (choiceId: string, text: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      choices: prev.choices.map((choice) => (choice.id === choiceId ? { ...choice, text } : choice)),
    }))
  }

  const setCorrectChoice = (choiceId: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      choices: prev.choices.map((choice) => ({
        ...choice,
        isCorrect: choice.id === choiceId,
      })),
    }))
  }

  const saveQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error("Please enter a question")
      return
    }

    if (currentQuestion.choices.some((choice) => !choice.text.trim())) {
      toast.error("All choices must have text")
      return
    }

    if (!currentQuestion.choices.some((choice) => choice.isCorrect)) {
      toast.error("Please mark one choice as correct")
      return
    }

    const questionToSave = {
      ...currentQuestion,
      id: currentQuestion.id || generateId(),
    }

    let updatedQuestions
    if (editingIndex !== null) {
      updatedQuestions = [...questions]
      updatedQuestions[editingIndex] = questionToSave
      setEditingIndex(null)
    } else {
      updatedQuestions = [...questions, questionToSave]
    }

    setQuestions(updatedQuestions)
    localStorage.setItem("quiz-questions", JSON.stringify(updatedQuestions))

    // Reset form
    setCurrentQuestion({
      id: "",
      question: "",
      choices: [
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
      ],
      timeLimit: 10,
    })

    editingIndex !== null
      ? toast.success("Question updated successfully")
      : toast.success("Question added successfully")
  }

  const editQuestion = (index: number) => {
    setCurrentQuestion(questions[index])
    setEditingIndex(index)
  }

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
    localStorage.setItem("quiz-questions", JSON.stringify(updatedQuestions))

    toast("Question removed successfully", { icon: "🗑️" })
  }

  const cancelEdit = () => {
    setCurrentQuestion({
      id: "",
      question: "",
      choices: [
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
      ],
      timeLimit: 10,
    })
    setEditingIndex(null)
  }

  return (
    <AuthGuard>
      <QuizLayout title="Setup Questions">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Setup Questions</h1>
              <p className="text-muted-foreground">Create and manage your quiz questions</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Question Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingIndex !== null ? "Edit Question" : "Add New Question"}</CardTitle>
              <CardDescription>Create engaging questions with multiple choice answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Input */}
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your question here..."
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="5"
                  max="60"
                  value={currentQuestion.timeLimit}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({ ...prev, timeLimit: Number.parseInt(e.target.value) || 10 }))
                  }
                  className="w-32"
                />
              </div>

              {/* Choices */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Answer Choices</Label>
                  <Button variant="outline" size="sm" onClick={addChoice} className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add Choice
                  </Button>
                </div>

                <AnimatePresence>
                  {currentQuestion.choices.map((choice, index) => (
                    <motion.div
                      key={choice.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={choice.isCorrect}
                          onChange={() => setCorrectChoice(choice.id)}
                          className="w-4 h-4 text-primary"
                        />
                        <Label className="text-sm text-muted-foreground">Correct</Label>
                      </div>

                      <Input
                        placeholder={`Choice ${index + 1}`}
                        value={choice.text}
                        onChange={(e) => updateChoice(choice.id, e.target.value)}
                        className="flex-1"
                      />

                      {currentQuestion.choices.length > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeChoice(choice.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                {editingIndex !== null && (
                  <Button variant="outline" onClick={cancelEdit} className="gap-2 bg-transparent">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
                <Button onClick={saveQuestion} className="gap-2">
                  <Save className="w-4 h-4" />
                  {editingIndex !== null ? "Update Question" : "Save Question"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Questions */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Questions ({questions.length})</CardTitle>
                <CardDescription>Manage your existing questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{question.question}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {question.choices.length} choices • {question.timeLimit}s time limit
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editQuestion(index)}>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteQuestion(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {question.choices.map((choice, choiceIndex) => (
                          <div
                            key={choice.id}
                            className={`text-sm px-3 py-2 rounded ${
                              choice.isCorrect
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + choiceIndex)}. {choice.text}
                            {choice.isCorrect && <span className="ml-2 font-medium">✓ Correct</span>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </QuizLayout>
    </AuthGuard>
  )
}
