import { io } from "socket.io-client"

export const socket = io('http://172.16.95.214:3000', {
    autoConnect: false
})