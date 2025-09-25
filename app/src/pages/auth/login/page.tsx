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
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"

export default function AuthPage() {
  const { login, isLoading } = useAuth()
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isLoggedIn = await login(userName, password)

    // Redirect to dashboard
    if (isLoggedIn) {
      toast.success("Login successful")
      navigate("/dashboard")
    }
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
              <CardTitle className="text-3xl font-bold text-primary">Login</CardTitle>
              <CardDescription>Enter your details to start hosting quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Username <span className="text-orange-500">*</span></Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Password <span className="text-orange-500">*</span></Label>
                  <Input
                    id="email"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <Button type="submit" className="w-full text-lg py-6" disabled={!userName.trim() || isLoading}>
                  {isLoading ? "Please wait..." : "Login"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Don't have and account? <NavLink className={'text-primary hover:underline'} to={"/auth/signup"}>Signup</NavLink></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </QuizLayout>
  )
}
