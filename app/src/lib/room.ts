export interface Room {
  code: string
  hostId: string
  hostName: string
  status: "waiting" | "active" | "ended"
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
  }[]
  createdAt: Date
  participants: string[]
}

export interface Participant {
  id: string
  name: string
  roomCode: string
  joinedAt: Date
  isOnline: boolean
}

// Mock storage
const rooms: Map<string, Room> = new Map()
const participants: Map<string, Participant> = new Map()

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function createRoom(code: string, hostName: string): Room {
  const room: Room = {
    code,
    hostId: Math.random().toString(36).substr(2, 9),
    hostName,
    status: "waiting",
    questions: [],
    createdAt: new Date(),
    participants: [],
  }

  rooms.set(code, room)
  return room
}

export function getRoom(code: string): Room | null {
  return rooms.get(code) || null
}

export function joinRoom(roomCode: string, participantName: string): Participant | null {
  const room = rooms.get(roomCode)
  if (!room || room.status !== "waiting") {
    return null
  }

  const participant: Participant = {
    id: Math.random().toString(36).substr(2, 9),
    name: participantName,
    roomCode,
    joinedAt: new Date(),
    isOnline: true,
  }

  participants.set(participant.id, participant)
  room.participants.push(participant.id)

  return participant
}

export function getRoomParticipants(roomCode: string): Participant[] {
  const room = rooms.get(roomCode)
  if (!room) return []

  return room.participants
    .map((id) => participants.get(id))
    .filter((p): p is Participant => p !== undefined)
    .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())
}

export function removeParticipant(participantId: string): void {
  const participant = participants.get(participantId)
  if (!participant) return

  const room = rooms.get(participant.roomCode)
  if (room) {
    room.participants = room.participants.filter((id) => id !== participantId)
  }

  participants.delete(participantId)
}

export function updateRoomStatus(roomCode: string, status: Room["status"]): void {
  const room = rooms.get(roomCode)
  if (room) {
    room.status = status
  }
}

// Mock some participants joining for demo purposes
export function simulateParticipants(roomCode: string): void {
  const mockNames = ["Alice", "Bob", "Charlie", "Diana", "Eve"]

  setTimeout(() => {
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
    joinRoom(roomCode, randomName)
  }, 3000)

  setTimeout(() => {
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
    joinRoom(roomCode, randomName)
  }, 6000)
}
