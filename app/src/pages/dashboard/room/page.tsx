import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSocket } from "@/context/SocketContext";
import type { Participant } from "@/lib/room";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Play, Users, UserPlus, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export function RoomHostPage() {
    const { roomCode } = useParams()
    const [participants, setParticipants] = useState<Participant[]>([])
    const { socket, joinRoom } = useSocket()

    const handleCopyRoomCode = () => {
      navigator.clipboard.writeText(roomCode!)
      toast.success("Room code copied to clipboard!")
    }

    useEffect(() => {
        (async () => {
            const res = await socket.timeout(1000).emitWithAck("join-room", roomCode);
        })()
        socket.on("new-participant", (p) => setParticipants(prev => [...prev, p]))
        socket.on("participant-left", (p) => setParticipants(prev => prev.filter(participant => participant.id !== p.id)))

        return () => {
            socket.off("new-participant")
        }
    })

    return (
        <div className="min-h-screen max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >
                {/* Room Info */}
                <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">Room Active</CardTitle>
                        <CardDescription>Share this code with participants</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Room Code</div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="text-4xl font-mono font-bold text-primary bg-muted px-6 py-3 rounded-lg">
                        {roomCode}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopyRoomCode} className="gap-2 bg-transparent">
                        <Copy className="w-4 h-4" />
                        Copy
                        </Button>
                    </div>
                    </div>

                    <div className="flex justify-center gap-4">
                    <Button
                        disabled={participants.length === 0}
                        className="gap-2 text-lg py-6 px-8"
                    >
                        <Play className="w-5 h-5" />
                        Close Room & Start Quiz
                    </Button>
                    </div>
                </CardContent>
                </Card>

                {/* Participants */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Connected Participants ({participants.length})
                    </CardTitle>
                    <CardDescription>Participants will appear here as they join</CardDescription>
                </CardHeader>
                <CardContent>
                    <AnimatePresence>
                    {participants.length === 0 ? (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground"
                        >
                        <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Waiting for participants to join...</p>
                        <p className="text-sm mt-2">
                            Share the room code: <span className="font-mono font-bold">{roomCode}</span>
                        </p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-3">
                        {participants.map((participant, index) => (
                            <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                {participant.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                <div className="font-medium">{participant.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    Joined {new Date(participant.joinedAt).toLocaleTimeString()}
                                </div>
                                </div>
                            </div>
                            <Badge variant="outline" className="gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Online
                            </Badge>
                            </motion.div>
                        ))}
                        </div>
                    )}
                    </AnimatePresence>
                </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="gap-2 bg-transparent">
                    <Lock className="w-4 h-4" />
                    Lock Room
                    </Button>
                    <Button variant="outline" onClick={() => {}}>
                    End Session
                    </Button>
                </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}