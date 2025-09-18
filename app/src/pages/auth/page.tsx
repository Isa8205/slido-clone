"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { QuizLayout } from "@/components/quiz-layout"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { createSession } from "@/lib/auth"
import { NavLink, useNavigate } from "react-router-dom"

export default function AuthPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)

    // Create session
    await createSession({ name: name.trim(), email: email.trim() || undefined })

    // Redirect to dashboard
    navigate("/dashboard")

    setIsLoading(false)
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
              <CardTitle className="text-3xl font-bold text-primary">Welcome to QuizMaster</CardTitle>
              <CardDescription>Enter your details to start hosting quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <Button type="submit" className="w-full text-lg py-6" disabled={!name.trim() || isLoading}>
                  {isLoading ? "Creating Session..." : "Continue to Dashboard"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>By continuing, you agree to our terms of service</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </QuizLayout>
  )
}
