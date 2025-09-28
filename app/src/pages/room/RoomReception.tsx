import { useEffect } from "react"
import { QuizLayout } from "@/components/quiz-layout"
import { LogOut } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "@/context/SocketContext"

export default function RoomReceptionPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { socket, leaveRoom } = useSocket()

  const handleLeaveRoom = () => {
    leaveRoom(roomCode as string)
    navigate("/")
  }

  useEffect(() => {
    socket.on("proceed-to-quiz", () => navigate(`/room/${roomCode}/quiz`))

    return () => {
      socket.off("proceed-to-quiz")
      leaveRoom(roomCode as string)
    }
  }, [socket])

  return (
    <QuizLayout title="QuizMaster">
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Room Code: {roomCode}</h1>
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
