"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizLayout } from "@/components/quiz-layout"
import { AuthGuard } from "@/components/auth-guard"
import { motion } from "framer-motion"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "@/lib/axios"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const navigate = useNavigate()


  const handleCreateRoom = async () => {
    setIsCreatingRoom(true)
    try {
      const res = await api.post("/room/create")

      if (res.status === 201) {
        const roomCode = res.data.roomCode
        toast.success(res.data.message)
        navigate(`/dashboard/room/${roomCode}`)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          toast.error("Please login to create a room")
        } else if (status === 500) {
          console.error("Encountered and error creating room: ", err)
          toast.error("Server error, please try again.")
        } else {
          console.error("Encountered and error creating room: ", err)
          toast.error("Something went wrong, please try again.")
        }
      }
      console.error("Encountered and error creating room: ", err)
    } finally {
      setIsCreatingRoom(false)
    }
  }

  const handleLogout = async() => {
    await logout()
    await navigate("/")
  }

  return (
    <AuthGuard>
      <QuizLayout title="Dashboard">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.username}!</h1>
              <p className="text-muted-foreground">Create and manage your quiz sessions</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Start a New Quiz Session</CardTitle>
                <CardDescription>Create a room and share the code with participants</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={handleCreateRoom} disabled={isCreatingRoom} className="text-lg py-6 px-8">
                  {isCreatingRoom ? "Creating Room..." : "Start a Room"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </QuizLayout>
    </AuthGuard>
  )
}
