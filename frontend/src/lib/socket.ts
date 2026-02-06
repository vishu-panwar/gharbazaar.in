import { io, Socket } from 'socket.io-client'
import { CONFIG } from '@/config'

let sharedSocket: Socket | null = null

export function getOrCreateSocket(token?: string): Socket {
    if (sharedSocket) return sharedSocket

    sharedSocket = io(CONFIG.API.SOCKET_URL, {
        auth: { token: token || undefined },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    })

    return sharedSocket
}

export function getSocket(): Socket | null {
    return sharedSocket
}

export function disconnectSocket(): void {
    if (sharedSocket) {
        try {
            sharedSocket.disconnect()
        } catch (e) {
            // ignore
        }
        sharedSocket = null
    }
}

export default {
    getOrCreateSocket,
    getSocket,
    disconnectSocket,
}
