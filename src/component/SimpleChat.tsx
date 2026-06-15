import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Image as ImageIcon, Loader2, MessageCircle, MessageSquare, Plus, Send, Sparkles, Trash2, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { message } from 'antd'
import { deleteChatThread, getChatHistory, getToken, saveCurrentConsultationToProfile } from '../utils/request'
import { setConsultationGuardState } from '../utils/consultationGuard'

const IMAGE_MAX_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const CHAT_STORAGE_KEY = 'zhikang-ai-chat-state'
const CHAT_DELETED_THREADS_KEY = 'zhikang-ai-chat-deleted-threads'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  timestamp: number
  bodyPart?: string
}

interface Thread {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface SimpleChatProps {
  initialPainParts?: string[]
  initialSymptoms?: string[]
  initialPainPoints?: Array<{ part: string; point: { x: number; y: number; z: number } }>
}

const mapRemoteThreads = (threads: Array<{ id: string; title: string; createdAt: number; updatedAt: number; messages: Array<{ id: string; role: 'user' | 'assistant' | 'system'; content: string; image?: string; bodyPart?: string; timestamp: number }> }>): Thread[] => {
  return threads.map((thread) => ({
    id: thread.id,
    title: thread.title,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    messages: thread.messages.filter((message) => message.role !== 'system') as Message[],
  }))
}

const normalizeMarkdown = (content: string) =>
  content
    .replace(/\n{2,}/g, '\n')
    .replace(/(^|\n)(\s*[-*+]\s+)(.+)$/gm, (_, prefix, bullet, text) => `${prefix}${bullet}${String(text).replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ')}`)
    .replace(/(^|\n)(\s*\d+\.\s+)(.+)$/gm, (_, prefix, bullet, text) => `${prefix}${bullet}${String(text).replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ')}`)

const SimpleChat = ({ initialPainParts = [], initialSymptoms = [], initialPainPoints = [] }: SimpleChatProps) => {
  const [threads, setThreads] = useState<Thread[]>([])
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [pendingBodyPart, setPendingBodyPart] = useState<string | null>(null)
  const [hasUnsavedConversation, setHasUnsavedConversation] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(CHAT_STORAGE_KEY)
      const deletedCached = window.localStorage.getItem(CHAT_DELETED_THREADS_KEY)
      const deletedIds = deletedCached ? (JSON.parse(deletedCached) as string[]) : []
      if (!cached) return
      const parsed = JSON.parse(cached) as { threads?: Thread[]; currentThreadId?: string | null; hasUnsavedConversation?: boolean }
      if (Array.isArray(parsed.threads)) setThreads(parsed.threads.filter((thread) => !deletedIds.includes(thread.id)))
      if (typeof parsed.currentThreadId !== 'undefined' && !deletedIds.includes(parsed.currentThreadId ?? '')) setCurrentThreadId(parsed.currentThreadId)
      if (typeof parsed.hasUnsavedConversation === 'boolean') setHasUnsavedConversation(parsed.hasUnsavedConversation)
    } catch (error) {
      console.warn('恢复聊天缓存失败:', error)
    }
  }, [])

  const extraContext = useMemo(() => {
    return [
      initialPainParts.length ? `疼痛部位：${initialPainParts.join('、')}` : '',
      initialPainPoints.length ? `疼痛位置坐标：${initialPainPoints.map((item) => `${item.part}(${item.point.x},${item.point.y},${item.point.z})`).join('；')}` : '',
      initialSymptoms.length ? `自查症状：${initialSymptoms.join('、')}` : '',
    ]
      .filter(Boolean)
      .join('；')
  }, [initialPainParts, initialPainPoints, initialSymptoms])

  const currentThread = threads.find((thread) => thread.id === currentThreadId)
  const messages = currentThread?.messages ?? []
  const hasConversation = hasUnsavedConversation

  const buildArchivePayload = useCallback(() => {
    if (!currentThread || !hasConversation) return null
    const contentMessages = currentThread.messages.filter((item) => item.content.trim())
    const firstUserMessage = contentMessages.find((item) => item.role === 'user')?.content || currentThread.title
    const lastAssistantMessage = [...contentMessages].reverse().find((item) => item.role === 'assistant')?.content || ''
    const summarySource = lastAssistantMessage || firstUserMessage
    return {
      id: currentThread.id,
      title: currentThread.title === '新对话' ? firstUserMessage.slice(0, 30) || 'AI 问诊记录' : currentThread.title,
      summary: summarySource.slice(0, 180) + (summarySource.length > 180 ? '...' : ''),
      messageCount: currentThread.messages.length,
      archivedAt: new Date().toISOString(),
    }
  }, [currentThread, hasConversation])

  const saveCurrentConsultation = useCallback(async () => {
    const payload = buildArchivePayload()
    if (!payload) return false
    try {
      await saveCurrentConsultationToProfile(payload)
      message.success('本次问诊已添加到个人档案')
      return true
    } catch (error) {
      console.error('保存问诊到个人档案失败:', error)
      message.error('保存问诊失败，请检查后端服务')
      return false
    }
  }, [buildArchivePayload])

  useEffect(() => {
    setConsultationGuardState({
      hasConversation: () => hasConversation,
      buildArchivePayload,
      saveCurrentConsultation,
    })
    return () => setConsultationGuardState(null)
  }, [buildArchivePayload, hasConversation, saveCurrentConsultation])

  useEffect(() => {
    const loadHistory = async () => {
      if (!getToken()) {
        setIsHistoryLoading(false)
        return
      }

      try {
        const res = await getChatHistory()
        const nextThreads = res.data?.data || []
        setThreads(mapRemoteThreads(nextThreads))
        setCurrentThreadId(nextThreads[0]?.id ?? null)
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          console.error('获取问诊历史失败:', error)
        }
        setThreads([])
        setCurrentThreadId(null)
      } finally {
        setIsHistoryLoading(false)
      }
    }

    void loadHistory()
  }, [])

  useEffect(() => {
    if (extraContext) {
      setInput((prev) => (prev ? prev : `我刚才在自查中记录了：${extraContext}，请结合这些信息帮我分析。`))
    }
  }, [extraContext])

  useEffect(() => {
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({ threads, currentThreadId, hasUnsavedConversation }),
    )
  }, [threads, currentThreadId, hasUnsavedConversation])

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = viewportRef.current.scrollHeight
  }, [threads, currentThreadId])

  const createNewThread = useCallback(() => {
    const newThread: Thread = { id: `thread-${Date.now()}`, title: '新对话', messages: [], createdAt: Date.now(), updatedAt: Date.now() }
    setThreads((prev) => [newThread, ...prev])
    setCurrentThreadId(newThread.id)
  }, [])

  const deleteThread = useCallback(async (threadId: string) => {
    const previousThreads = threads
    const nextThreads = previousThreads.filter((thread) => thread.id !== threadId)
    const nextCurrentThreadId = currentThreadId === threadId ? (nextThreads[0]?.id ?? null) : currentThreadId

    setThreads(nextThreads)
    setCurrentThreadId(nextCurrentThreadId)
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ threads: nextThreads, currentThreadId: nextCurrentThreadId, hasUnsavedConversation }))

    try {
      await deleteChatThread(threadId)
      window.dispatchEvent(new Event('consultations:updated'))
      message.success('历史记录已删除')
    } catch (error) {
      console.error('删除历史记录失败:', error)
      setThreads(previousThreads)
      setCurrentThreadId(currentThreadId)
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ threads: previousThreads, currentThreadId, hasUnsavedConversation }))
      message.error('删除失败，请检查后端服务后重试')
    }
  }, [currentThreadId, hasUnsavedConversation, threads])

  const updateThreadTitle = useCallback((threadId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? { ...thread, title } : thread)))
  }, [])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type)) return window.alert('请选择有效的图片格式（JPG、PNG、GIF、WebP）')
    if (file.size > IMAGE_MAX_SIZE) return window.alert('图片大小不能超过 5MB')

    const reader = new FileReader()
    reader.onload = (e) => setSelectedImage(String(e.target?.result ?? ''))
    reader.readAsDataURL(file)
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return

    let threadId = currentThreadId
    if (!threadId) {
      const newThread: Thread = { id: `thread-${Date.now()}`, title: '新对话', messages: [], createdAt: Date.now(), updatedAt: Date.now() }
      setThreads((prev) => [newThread, ...prev])
      threadId = newThread.id
      setCurrentThreadId(threadId)
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: input.trim(),
      image: selectedImage || undefined,
      bodyPart: pendingBodyPart || undefined,
      timestamp: Date.now(),
    }

    const nextMessages = [...messages, userMessage]
    setHasUnsavedConversation(true)
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? { ...thread, messages: [...thread.messages, userMessage], updatedAt: Date.now() } : thread)))
    if (messages.length === 0) updateThreadTitle(threadId, input.trim())

    setInput('')
    setPendingBodyPart(null)
    removeSelectedImage()
    setIsLoading(true)

    try {
      const response = await fetch('https://zhi-kang-ai-backend.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken() || ''}`,
        },
        body: JSON.stringify({
          threadId,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content || (m.image ? '[图片]' : ''),
            image: m.image,
            bodyPart: m.bodyPart,
          })),
        }),
      })

      if (!response.ok) throw new Error('API request failed')
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder('utf-8')
      let assistantContent = ''
      const assistantMessageId = `msg-${Date.now()}-a`
      setThreads((prev) => prev.map((thread) => thread.id === threadId ? {
        ...thread,
        messages: [...thread.messages, { id: assistantMessageId, role: 'assistant', content: '', timestamp: Date.now() }],
        updatedAt: Date.now(),
      } : thread))
      setHasUnsavedConversation(true)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n\n').filter((line) => line.startsWith('data:'))
        for (const line of lines) {
          const data = line.replace('data:', '').trim()
          if (!data) continue
          try {
            const json = JSON.parse(data)
            if (json.type === 'text-delta' && json.delta) {
              assistantContent += json.delta
              setThreads((prev) => prev.map((thread) => thread.id === threadId ? {
                ...thread,
                messages: thread.messages.map((msg) => msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg),
                updatedAt: Date.now(),
              } : thread))
            }
          } catch {
            // ignore stream chunk parse errors
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { id: `msg-${Date.now()}-e`, role: 'assistant', content: '抱歉，发生了错误，请稍后重试。', timestamp: Date.now() }
      setThreads((prev) => prev.map((thread) => thread.id === threadId ? { ...thread, messages: [...thread.messages, errorMessage], updatedAt: Date.now() } : thread))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const LoadingBubble = () => (
    <div className="mb-4 flex items-end gap-3 justify-start">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#00685F]">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-[#00685F]" />
        <span>AI 正在思考中…</span>
      </div>
    </div>
  )

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const diff = Date.now() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="flex h-full w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl">
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} flex flex-col bg-[#213145] transition-all duration-300`}>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[#89F5E7]" />
              <h2 className="text-xl font-bold text-white">AI 健康助手</h2>
            </div>
            <button onClick={createNewThread} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700">
              <Plus className="h-5 w-5" />
              <span>新对话</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[#89F5E7]/60">历史记录</div>
            {isHistoryLoading ? (
              <div className="px-2 text-sm text-[#89F5E7]/60">正在加载历史记录...</div>
            ) : threads.length === 0 ? (
              <div className="px-2 text-sm text-[#89F5E7]/60">暂无对话记录</div>
            ) : (
              threads.map((thread) => (
                <div key={thread.id} className={`group mb-1.5 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 transition-all ${currentThreadId === thread.id ? 'bg-[#89F5E7]/20' : 'hover:bg-white/10'}`} onClick={() => setCurrentThreadId(thread.id)}>
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-[#89F5E7]/70" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{thread.title}</div>
                    <div className="text-xs text-[#89F5E7]/50">{formatDate(thread.updatedAt)}</div>
                  </div>
                  <button onClick={(event) => { event.stopPropagation(); void deleteThread(thread.id) }} className="rounded-lg p-1.5 opacity-0 transition-all hover:bg-white/10 group-hover:opacity-100">
                    <Trash2 className="h-3.5 w-3.5 text-[#89F5E7]/70" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="border-b border-slate-100 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00685F] shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#213145]">AI 健康助手</h2>
                <p className="flex items-center gap-1 text-sm text-[#00685F]"><span className="h-2 w-2 rounded-full bg-[#89F5E7]"></span>在线</p>
              </div>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto rounded-lg p-2 transition-colors hover:bg-slate-100">
                <svg className={`h-5 w-5 text-[#213145] transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={viewportRef} className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50 p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#00685F] shadow-xl shadow-[#00685F]/30">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-[#213145]">AI 健康助手</h2>
                  <p className="text-lg text-slate-500">您好，点击人体模型记录疼痛部位后，我可以基于位置给出分析建议。</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`mb-4 flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#00685F]"><Bot className="h-4 w-4 text-white" /></div>}
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'border border-slate-200 bg-white text-slate-800'}`}>
                      {msg.bodyPart && <div className="mb-2 text-xs opacity-80">疼痛部位：{msg.bodyPart}</div>}
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizeMarkdown(msg.content)}</ReactMarkdown>
                    </div>
                    {msg.role === 'user' && <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200"><User className="h-4 w-4 text-slate-600" /></div>}
                  </div>
                ))}
                {isLoading && <LoadingBubble />}
              </>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageSelect} />
              <button onClick={() => fileInputRef.current?.click()} className="rounded-lg p-2 hover:bg-slate-100"><ImageIcon className="h-5 w-5" /></button>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 rounded-xl border px-3 py-2 text-sm leading-5" style={{ height: '44px', minHeight: '44px', maxHeight: '44px' }} placeholder="输入你的问题..." />
              <button onClick={() => void handleSend()} disabled={isLoading} className="h-11 rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:opacity-50"><Send className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleChat
