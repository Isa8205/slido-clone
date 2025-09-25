import { socket } from "@/lib/socket";
import { useEffect } from "react";

export function useSocket(roomCode: string) {
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        socket.emit('join-room', roomCode);

        return () => {
            socket.emit("leave-room", roomCode);
            // Only disconnect if no other components are using the socket
            // Consider implementing a reference counter or connection manager
        };
    }, [roomCode]);

    return socket;
}