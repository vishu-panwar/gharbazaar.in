
import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import Ticket from '../../models/ticket.model';
import TicketMessage from '../../models/ticketMessage.model';
import { isMongoDBAvailable } from '../../utils/memoryStore';

// In-memory state for live chat (moved to a separate module if needed)
export const waitingQueue: any[] = [];
export const activeSessions = new Map<string, any>();
export const agents = new Map<string, any>();

export const registerAgentHandlers = (io: Server, socket: Socket) => {
    const user = getSocketUser(socket);

    socket.on('agent_connect', (data: { agentId: string; agentName: string; agentEmail: string }) => {
        if (user.role !== 'employee' && user.role !== 'admin') {
            socket.emit('error', { message: 'Not authorized as agent' });
            return;
        }

        agents.set(user.userId, {
            id: user.userId,
            name: data.agentName || user.email.split('@')[0],
            email: data.agentEmail || user.email,
            socketId: socket.id,
            status: 'available'
        });

        socket.join('employees');
        socket.emit('agent_connected');
        console.log(`👔 Agent ${user.email} connected and ready`);

        // Send initial queue to the new agent
        socket.emit('queue_data', { queue: waitingQueue });
    });

    socket.on('agent_get_queue', () => {
        socket.emit('queue_data', { queue: waitingQueue });
    });

    socket.on('agent_get_sessions', () => {
        const agentSessions = Array.from(activeSessions.values()).filter(s => s.agentId === user.userId);
        socket.emit('active_sessions', { sessions: agentSessions });
    });

    socket.on('agent_set_status', (data: { status: 'available' | 'busy' | 'offline' }) => {
        const agent = agents.get(user.userId);
        if (agent) {
            agent.status = data.status;
            console.log(`👔 Agent ${user.email} set status to ${data.status}`);
        }
    });

    socket.on('agent_accept_chat', async (data: { sessionId: string }) => {
        const { sessionId } = data;
        const queueIndex = waitingQueue.findIndex(item => item.id === sessionId);

        if (queueIndex === -1) {
            // Already accepted by someone else or removed
            socket.emit('error', { message: 'Session no longer in queue' });
            return;
        }

        const sessionData = waitingQueue.splice(queueIndex, 1)[0];
        const newSession = {
            ...sessionData,
            agentId: user.userId,
            agentName: user.name || user.email.split('@')[0],
            startedAt: new Date().toISOString(),
            messages: []
        };

        activeSessions.set(sessionId, newSession);

        // Notify agent
        socket.emit('chat_accepted', newSession);

        // Join the ticket room for communication
        socket.join(sessionId);

        // Update database ticket status
        if (isMongoDBAvailable()) {
            try {
                await Ticket.findByIdAndUpdate(sessionId, {
                    status: 'assigned',
                    assignedTo: user.userId,
                    assignedToName: user.name || user.email.split('@')[0]
                });
            } catch (error) {
                console.error('Error updating ticket in DB:', error);
            }
        }

        // Notify customer that agent joined
        // Customer should be in the room 'sessionId'
        io.to(sessionId).emit('ticket:assigned', {
            ticketId: sessionId,
            agentName: user.name || user.email.split('@')[0],
            status: 'assigned',
            userId: sessionData.userId // For SupportChatbot.tsx frontend check
        });

        // Broadcast updated queue to all other agents
        io.to('employees').emit('queue_data', { queue: waitingQueue });

        console.log(`✅ Agent ${user.email} accepted chat ${sessionId}`);
    });

    socket.on('agent_send_message', (data: { sessionId: string; message: string }) => {
        const session = activeSessions.get(data.sessionId);
        if (!session) {
            console.warn(`⚠️ Attempted to send message to inactive session: ${data.sessionId}`);
            return;
        }

        const messageData = {
            role: 'agent',
            content: data.message,
            timestamp: new Date().toISOString(),
            agentName: user.name || user.email.split('@')[0]
        };

        if (!session.messages) session.messages = [];
        session.messages.push(messageData);

        // Save to Database
        if (isMongoDBAvailable()) {
            TicketMessage.create({
                ticketId: data.sessionId,
                senderId: user.userId,
                senderType: 'employee',
                message: data.message,
                timestamp: new Date()
            }).catch(err => console.error('Error saving agent message to DB:', err));
        }

        // Send to room (customer + agent)
        io.to(data.sessionId).emit('ticket:message', {
            ticketId: data.sessionId,
            message: data.message,
            role: 'agent',
            timestamp: messageData.timestamp,
            agentName: messageData.agentName
        });

        console.log(`📨 Agent message sent to ${data.sessionId}`);
    });

    socket.on('agent_typing', (data: { sessionId: string; isTyping: boolean }) => {
        // Notify customer
        socket.to(data.sessionId).emit('agent_typing_status', {
            sessionId: data.sessionId,
            isTyping: data.isTyping
        });
    });

    socket.on('agent_end_session', async (data: { sessionId: string; resolved: boolean }) => {
        const session = activeSessions.get(data.sessionId);
        if (session) {
            activeSessions.delete(data.sessionId);

            // Update ticket in DB
            if (isMongoDBAvailable()) {
                await Ticket.findByIdAndUpdate(data.sessionId, {
                    status: data.resolved ? 'resolved' : 'closed',
                    closedAt: new Date()
                });
            }

            // Notify all in room
            io.to(data.sessionId).emit('ticket:closed', {
                ticketId: data.sessionId,
                status: 'closed'
            });

            // Also emit session_ended to agent specifically to handle UI state
            socket.emit('session_ended', { sessionId: data.sessionId });

            console.log(`🏁 Agent ${user.email} ended session ${data.sessionId}`);
        }
    });

    socket.on('disconnect', () => {
        agents.delete(user.userId);
        console.log(`👔 Agent ${user.email} disconnected`);
    });
};

/**
 * Helper to add a ticket to the live waiting queue.
 * Called from Ticket Controller or Ticket Handler.
 */
export const addToWaitingQueue = (ticket: any, userData: { name: string, email: string }, io: Server) => {
    const ticketId = ticket._id?.toString() || ticket.id;

    // Check if already in queue
    if (waitingQueue.some(item => item.id === ticketId)) return;

    const queueItem = {
        id: ticketId,
        userId: ticket.userId,
        userName: userData.name || 'Customer',
        userEmail: userData.email || '',
        reason: ticket.problem,
        priority: 'standard',
        addedAt: new Date().toISOString(),
        conversationHistory: []
    };

    waitingQueue.push(queueItem);

    // Notify all connected agents
    io.to('employees').emit('queue_data', { queue: waitingQueue });

    console.log(`📢 Ticket ${ticketId} added to live queue. Queue size: ${waitingQueue.length}`);
    return queueItem;
};
