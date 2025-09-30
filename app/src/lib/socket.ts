import { io } from "socket.io-client"

export const socket = io('http://192.168.88.67:3000', {
    autoConnect: false
})