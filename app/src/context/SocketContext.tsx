import { socket } from "@/lib/socket";
import { useEffect, createContext, useContext } from "react";

interface SocketContextType {
    socket: typeof socket;
    joinRoom: ({ roomCode, token }: { roomCode: string, token: string }) => boolean;
    leaveRoom: (roomCode: string) => void;
}
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const joinRoom = ({ roomCode,  }: { roomCode: string }): boolean => {
        if (socket.connected) {
            socket.emit("join-room", roomCode, (res: { success: boolean }) => {
                if (res.success) {
                    return true;
                }
                return false
            });
        }
        return false
    }

    const leaveRoom = (roomCode: string) => {
        if (socket.connected) {
            socket.emit("leave-room", roomCode);
        }
    }

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        }
    })
    return (
        <SocketContext.Provider value={{ socket, joinRoom, leaveRoom }}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }

    return context;
}