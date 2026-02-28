'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageSquare, RefreshCw, Search, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'
import { AuthUtils } from '@/lib/firebase'

type ConversationUser = {
  id?: string
  uid?: string
  name?: string
  email?: string
  profilePhoto?: string | null
}

type ConversationParticipant = {
  id?: string
  user?: ConversationUser
}

type Conversation = {
  id: string
  propertyTitle?: string
  lastMessage?: string
  lastMessageAt?: string
  participants?: ConversationParticipant[]
}

type ChatMessage = {
  id?: string
  _id?: string
  content?: string
  createdAt?: string
  senderId?: string
  sender?: {
    id?: string
    name?: string
    profilePhoto?: string | null
  }
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const getId = (value: any) => String(value?.id || value?._id || '')

export default function GroundPartnerMessagesPage() {
  const [loading, setLoading] = useState(true)
  const [messageLoading, setMessageLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [profile, setProfile] = useState<{ uniqueId?: string } | null>(null)

  // Fetch profile for UID
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backendApi.user.getProfile()
        if (response?.success) {
          setProfile({
            uniqueId: response.data.uid
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    const user = AuthUtils.getCachedUser()
    const id = String(user?.uid || '')
    setCurrentUserId(id)
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await backendApi.chat.getConversations()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load conversations')
      }

      const rows = Array.isArray(response?.data?.conversations) ? response.data.conversations : []
      setConversations(rows)

      if (!selectedConversationId && rows.length > 0) {
        setSelectedConversationId(rows[0].id)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    if (!conversationId) {
      setMessages([])
      return
    }

    try {
      setMessageLoading(true)
      const response = await backendApi.chat.getMessages(conversationId)
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load messages')
      }
      setMessages(Array.isArray(response?.data?.messages) ? response.data.messages : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load messages')
    } finally {
      setMessageLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    loadMessages(selectedConversationId)
  }, [selectedConversationId])

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((row) => {
      const participantNames = (row.participants || []).map((p) => p.user?.name || p.user?.email || '').join(' ')
      return (
        (row.propertyTitle || '').toLowerCase().includes(q) ||
        (row.lastMessage || '').toLowerCase().includes(q) ||
        participantNames.toLowerCase().includes(q)
      )
    })
  }, [conversations, search])

  const selectedConversation = useMemo(() => {
    return conversations.find((row) => row.id === selectedConversationId)
  }, [conversations, selectedConversationId])

  const otherParticipantLabel = (conversation?: Conversation) => {
    if (!conversation) return '-'
    const participant = (conversation.participants || []).find((p) => {
      const id = String(p.user?.id || '')
      const uid = String(p.user?.uid || '')
      return id !== currentUserId && uid !== currentUserId
    })
    return participant?.user?.name || participant?.user?.email || 'Participant'
  }

  const sendMessage = async () => {
    if (!selectedConversationId || !draft.trim()) return

    try {
      const response = await backendApi.chat.sendMessage(selectedConversationId, draft.trim())
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to send message')
      }
      setDraft('')
      await loadMessages(selectedConversationId)
      await loadConversations()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send message')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time conversation history from backend chat workflow</p>
        </div>
        <button
          onClick={loadConversations}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid min-h-[620px] gap-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div className="max-h-[540px] space-y-2 overflow-y-auto">
            {loading && <p className="text-sm text-gray-500">Loading conversations...</p>}
            {!loading && filteredConversations.length === 0 && <p className="text-sm text-gray-500">No conversations found.</p>}
            {!loading &&
              filteredConversations.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedConversationId(row.id)}
                  className={`w-full rounded-lg border p-3 text-left ${selectedConversationId === row.id
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900'
                    }`}
                >
                  <p className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">{otherParticipantLabel(row)}</p>
                  <p className="line-clamp-1 text-xs text-gray-500">{row.propertyTitle || 'General conversation'}</p>
                  <p className="line-clamp-1 text-xs text-gray-500">{row.lastMessage || 'No messages yet'}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(row.lastMessageAt)}</p>
                </button>
              ))}
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800">
          {!selectedConversationId && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-gray-500">
              <MessageSquare size={32} className="mb-2" />
              Select a conversation to view messages.
            </div>
          )}

          {selectedConversationId && (
            <>
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{otherParticipantLabel(selectedConversation)}</p>
                <p className="text-xs text-gray-500">{selectedConversation?.propertyTitle || 'General conversation'}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messageLoading && <p className="text-sm text-gray-500">Loading messages...</p>}
                {!messageLoading && messages.length === 0 && <p className="text-sm text-gray-500">No messages available.</p>}
                {!messageLoading &&
                  messages.map((row) => {
                    const senderId = String(row.senderId || row.sender?.id || '')
                    const mine = senderId && senderId === currentUserId
                    return (
                      <div key={getId(row) || `${senderId}-${row.createdAt}`} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${mine
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                          }`}>
                          <p>{row.content || '-'}</p>
                          <p className={`mt-1 text-xs ${mine ? 'text-blue-100' : 'text-gray-500'}`}>{formatDate(row.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>

              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Type your message"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!draft.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Conversations are shared through the same chat system used across buyer, seller, employee, and partner workflows.
      </div>
    </div>
  )
}
