import { useCallback, useEffect, useRef, useState } from 'react'
import { Bot, Image as ImageIcon, MessageCircle, MessageSquare, Plus, Send, Sparkles, Trash2, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const IMAGE_MAX_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const STORAGE_KEY = 'chat_threads'

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

const loadThreads = (): Thread[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Thread[]) : []
  } catch {
    return []
  }
}

const saveThreads = (threads: Thread[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [pendingBodyPart, setPendingBodyPart] = useState<string | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extraContext = [
    initialPainParts.length ? `疼痛部位：${initialPainParts.join('、')}` : '',
    initialPainPoints.length
      ? `疼痛位置坐标：${initialPainPoints.map((item) => `${item.part}(${item.point.x},${item.point.y},${item.point.z})`).join('；')}`
      : '',
    initialSymptoms.length ? `自查症状：${initialSymptoms.join('、')}` : '',
  ]
    .filter(Boolean)
    .join('；')

  useEffect(() => {
    const loaded = loadThreads()
    setThreads(loaded)
    if (loaded.length > 0) setCurrentThreadId(loaded[0].id)
  }, [])

  useEffect(() => {
    if (extraContext) {
      setInput((prev) => (prev ? prev : `我刚才在自查中记录了：${extraContext}，请结合这些信息帮我分析。`))
    }
  }, [extraContext])

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = viewportRef.current.scrollHeight
  }, [threads, currentThreadId])

  const currentThread = threads.find((thread) => thread.id === currentThreadId)
  const messages = currentThread?.messages ?? []

  const createNewThread = useCallback(() => {
    const newThread: Thread = { id: `thread-${Date.now()}`, title: '新对话', messages: [], createdAt: Date.now(), updatedAt: Date.now() }
    const next = [newThread, ...threads]
    setThreads(next)
    saveThreads(next)
    setCurrentThreadId(newThread.id)
  }, [threads])

  const deleteThread = useCallback(
    (threadId: string) => {
      const next = threads.filter((thread) => thread.id !== threadId)
      setThreads(next)
      saveThreads(next)
      if (currentThreadId === threadId) setCurrentThreadId(next[0]?.id ?? null)
    },
    [threads, currentThreadId],
  )

  const updateThreadTitle = useCallback((threadId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
    setThreads((prev) => {
      const next = prev.map((thread) => (thread.id === threadId ? { ...thread, title } : thread))
      saveThreads(next)
      return next
    })
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
      const next = [newThread, ...threads]
      setThreads(next)
      saveThreads(next)
      threadId = newThread.id
      setCurrentThreadId(threadId)
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      image: selectedImage || undefined,
      bodyPart: pendingBodyPart || undefined,
      timestamp: Date.now(),
    }

    const currentMessages = threads.find((thread) => thread.id === threadId)?.messages ?? []
    setThreads((prev) => {
      const next = prev.map((thread) => (thread.id === threadId ? { ...thread, messages: [...thread.messages, userMessage], updatedAt: Date.now() } : thread))
      saveThreads(next)
      return next
    })

    if (currentMessages.length === 0) updateThreadTitle(threadId, input.trim())
    setInput('')
    setPendingBodyPart(null)
    removeSelectedImage()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...currentMessages, userMessage].map((m) => ({ role: m.role, content: m.content || (m.image ? '[图片]' : ''), image: m.image })),
        }),
      })

      if (!response.ok) throw new Error('API request failed')
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder('utf-8')
      let assistantContent = ''
      const assistantMessageId = `msg-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }

      setThreads((prev) => {
        const next = prev.map((thread) =>
          thread.id === threadId ? { ...thread, messages: [...thread.messages, assistantMessage], updatedAt: Date.now() } : thread,
        )
        saveThreads(next)
        return next
      })

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
              setThreads((prev) => {
                const next = prev.map((thread) =>
                  thread.id === threadId
                    ? { ...thread, messages: thread.messages.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg)), updatedAt: Date.now() }
                    : thread,
                )
                saveThreads(next)
                return next
              })
            }
          } catch {
            // ignore parse issues for streamed chunks
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { id: `msg-${Date.now()}`, role: 'assistant', content: '抱歉，发生了错误，请稍后重试。', timestamp: Date.now() }
      setThreads((prev) => {
        const next = prev.map((thread) => (thread.id === threadId ? { ...thread, messages: [...thread.messages, errorMessage], updatedAt: Date.now() } : thread))
        saveThreads(next)
        return next
      })
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
            {threads.length === 0 ? (
              <div className="px-2 text-sm text-[#89F5E7]/60">暂无对话记录</div>
            ) : (
              threads.map((thread) => (
                <div key={thread.id} className={`group mb-1.5 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 transition-all ${currentThreadId === thread.id ? 'bg-[#89F5E7]/20' : 'hover:bg-white/10'}`} onClick={() => setCurrentThreadId(thread.id)}>
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-[#89F5E7]/70" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{thread.title}</div>
                    <div className="text-xs text-[#89F5E7]/50">{formatDate(thread.updatedAt)}</div>
                  </div>
                  <button onClick={(event) => { event.stopPropagation(); deleteThread(thread.id) }} className="rounded-lg p-1.5 opacity-0 transition-all hover:bg-white/10 group-hover:opacity-100">
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
                <div className="w-24 h-24 rounded-3xl bg-[#00685F] flex items-center justify-center shadow-xl shadow-[#00685F]/30">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#213145] mb-2">AI 健康助手</h2>
                  <p className="text-lg text-slate-500">您好，点击人体模型记录疼痛部位后，我可以基于位置给出分析建议。</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#00685F]"><Bot className="h-4 w-4 text-white" /></div>}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'border border-slate-200 bg-white text-slate-800'}`}>
                    {msg.bodyPart && <div className="mb-2 text-xs opacity-80">疼痛部位：{msg.bodyPart}</div>}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizeMarkdown(msg.content)}</ReactMarkdown>
                  </div>
                  {msg.role === 'user' && <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200"><User className="h-4 w-4 text-slate-600" /></div>}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageSelect} />
              <button onClick={() => fileInputRef.current?.click()} className="rounded-lg p-2 hover:bg-slate-100"><ImageIcon className="h-5 w-5" /></button>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 rounded-xl border p-3" placeholder="输入你的问题..." />
              <button onClick={() => void handleSend()} disabled={isLoading} className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"><Send className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleChat
