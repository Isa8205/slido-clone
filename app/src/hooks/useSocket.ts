import { socket } from "@/lib/socket";
import { useEffect } from "react";

export function useSocket(roomCode: string) {
    useEffect(() => {
        socket.connect();
        socket.emit('join-room', roomCode)

        return () => {
            socket.emit("leave-room", roomCode)
            socket.disconnect()
        }
    }, [roomCode])

    return socket;
}