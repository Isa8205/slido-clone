import { useState, useEffect } from "react"
import { QuizLayout } from "@/components/quiz-layout"
import { getSession, type User } from "@/lib/auth"
import { LogOut } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "@/hooks/useSocket"

export default function RoomReceptionPage() {
  const [user, setUser] = useState<User | null>(null)

  const { roomCode } = useParams()
  const navigate = useNavigate()

  if (!roomCode || !user) {
    navigate("/")
  }
  const socket = useSocket(roomCode!)
  console.log(socket)

  const handleLeaveRoom = () => {
    if (user?.name) {
      socket.emit("leave-room", user.name)
    }
    navigate("/")
  }

  useEffect(() => {
    const session = getSession()
    if (session?.user) {
      setUser(session.user)
    }
  }, [])

  useEffect(() => {
    socket.on("proceed-to-quiz", () => navigate(`/room/${roomCode}/quiz`))

    return () => {
        socket.off("new-participant")
    }
  }, [socket])

  return (
    <QuizLayout title="QuizMaster">
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}!</h1>
                    <p className="text-muted-foreground">The quiz session will begin once participants join</p>
                </div>

                <button 
                    onClick={handleLeaveRoom}
                    className="inline-flex px-3 py-1 items-center gap-2 rounded-full bg-destructive/30 text-red-600 cursor-pointer hover:opacity-80"
                >
                    <LogOut className="w-4 h-4" />
                    Leave
                </button>
            </div>
        </div>
    </QuizLayout>
  )
}
