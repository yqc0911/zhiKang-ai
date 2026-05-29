import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageCircle, Bot, User, Sparkles, Plus, Trash2, MessageSquare, Image as ImageIcon, X, Copy, Check } from 'lucide-react';
import { Avatar, message as antdMessage } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: number;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'chat_threads';

const loadThreads = (): Thread[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveThreads = (threads: Thread[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
};

const normalizeMarkdown = (content: string) =>
  content
    .replace(/\n{2,}/g, '\n')
    .replace(/(^|\n)(\s*[-*+]\s+)(.+)$/gm, (_, prefix, bullet, text) => `${prefix}${bullet}${text.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ')}`)
    .replace(/(^|\n)(\s*\d+\.\s+)(.+)$/gm, (_, prefix, bullet, text) => `${prefix}${bullet}${text.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ')}`);

const SimpleChat = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('avatarUrl') || ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      alert('请选择有效的图片格式（JPG、PNG、GIF、WebP）');
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      alert('图片大小不能超过 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      antdMessage.success('已复制内容');
      window.setTimeout(() => {
        setCopiedMessageId((current) => (current === messageId ? null : current));
      }, 1500);
    } catch {
      antdMessage.error('复制失败，请手动复制');
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'avatarUrl') {
        setAvatarUrl(e.newValue || '')
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const currentThread = threads.find(t => t.id === currentThreadId);
  const messages = currentThread?.messages || [];

  useEffect(() => {
    const loadedThreads = loadThreads();
    setThreads(loadedThreads);
    if (loadedThreads.length > 0) {
      setCurrentThreadId(loadedThreads[0].id);
    }
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  const createNewThread = useCallback(() => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const newThreads = [newThread, ...threads];
    setThreads(newThreads);
    saveThreads(newThreads);
    setCurrentThreadId(newThread.id);
  }, [threads]);

  const deleteThread = useCallback((threadId: string) => {
    const newThreads = threads.filter(t => t.id !== threadId);
    setThreads(newThreads);
    saveThreads(newThreads);
    if (currentThreadId === threadId) {
      setCurrentThreadId(newThreads.length > 0 ? newThreads[0].id : null);
    }
  }, [threads, currentThreadId]);

  const updateThreadTitle = useCallback((threadId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
    setThreads(prev => {
      const newThreads = prev.map(t => 
        t.id === threadId 
          ? { ...t, title }
          : t
      );
      saveThreads(newThreads);
      return newThreads;
    });
  }, []);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    let threadId = currentThreadId;
    
    if (!threadId) {
      const newThread: Thread = {
        id: `thread-${Date.now()}`,
        title: '新对话',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const newThreads = [newThread, ...threads];
      setThreads(newThreads);
      saveThreads(newThreads);
      threadId = newThread.id;
      setCurrentThreadId(threadId);
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    const currentMessages = threads.find(t => t.id === threadId)?.messages || [];
    
    setThreads(prev => {
      const newThreads = prev.map(t => 
        t.id === threadId 
          ? { ...t, messages: [...t.messages, userMessage], updatedAt: Date.now() }
          : t
      );
      saveThreads(newThreads);
      return newThreads;
    });
    
    if (currentMessages.length === 0) {
      updateThreadTitle(threadId, input.trim());
    }
    
    setInput('');
    removeSelectedImage();
    setIsLoading(true);

    const messageWithContent = {
      ...userMessage,
      content: userMessage.content || (userMessage.image ? '[图片]' : '')
    };

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...currentMessages, messageWithContent].map(m => ({
            role: m.role,
            content: m.content,
            image: m.image
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder('utf-8');
      let assistantContent = '';
      const assistantMessageId = `msg-${Date.now()}`;

      setThreads(prev => {
        const newThreads = prev.map(t => 
          t.id === threadId 
            ? { ...t, messages: [...t.messages, { id: assistantMessageId, role: 'assistant' as const, content: '', timestamp: Date.now() }], updatedAt: Date.now() }
            : t
        );
        saveThreads(newThreads);
        return newThreads;
      });

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n\n').filter(line => line.startsWith('data:'));
        
        for (const line of lines) {
          const data = line.replace('data:', '').trim();
          if (!data) continue;

          try {
            const json = JSON.parse(data);
            
            if (json.type === 'text-delta' && json.delta) {
              assistantContent += json.delta;
              setThreads(prev => {
                const newThreads = prev.map(t => {
                  if (t.id === threadId) {
                    return {
                      ...t,
                      messages: t.messages.map(msg =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: assistantContent }
                          : msg
                      ),
                      updatedAt: Date.now()
                    };
                  }
                  return t;
                });
                saveThreads(newThreads);
                return newThreads;
              });
            }
          } catch (e) {
            console.log('Parse error:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，发生了错误，请稍后重试。',
        timestamp: Date.now()
      };
      setThreads(prev => {
        const newThreads = prev.map(t => 
          t.id === threadId 
            ? { ...t, messages: [...t.messages, errorMessage], updatedAt: Date.now() }
            : t
        );
        saveThreads(newThreads);
        return newThreads;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 p-4 md:p-6 lg:p-8 flex items-center justify-center overflow-hidden">
      {/* 整体容器 */}
      <div className="w-full h-full max-w-7xl flex rounded-2xl overflow-hidden shadow-2xl">
        
        {/* 侧边栏 - 深蓝灰色背景 */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#213145] flex flex-col`}>
          {/* 侧边栏头部 */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#89F5E7]" />
              <h2 className="text-white font-bold text-xl"> AI 健康助手</h2>
            </div>
            <button
              onClick={createNewThread}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>新对话</span>
            </button>
          </div>
          
          {/* 对话列表 */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="text-[#89F5E7]/60 text-xs font-medium uppercase tracking-wider px-2 mb-2">历史记录</div>
            {threads.length === 0 ? (
              <div className="px-2 text-[#89F5E7]/60 text-sm">
                暂无对话记录
              </div>
            ) : (
              threads.map(thread => (
                <div
                  key={thread.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer mb-1.5 transition-all ${
                    currentThreadId === thread.id 
                      ? 'bg-[#89F5E7]/20' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setCurrentThreadId(thread.id)}
                >
                  <MessageSquare className="w-4 h-4 text-[#89F5E7]/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {thread.title}
                    </div>
                    <div className="text-[#89F5E7]/50 text-xs">
                      {formatDate(thread.updatedAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#89F5E7]/70" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 主聊天区域 - 白底 */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* 聊天头部 - 深青色 */}
          <div className="px-6 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00685F] flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[#213145] font-semibold text-lg">AI 健康助手</h2>
                <p className="text-[#00685F] text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#89F5E7] rounded-full"></span>
                  在线
                </p>
              </div>
              {/* 侧边栏收起/展开按钮 */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="ml-auto p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className={`w-5 h-5 text-[#213145] transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 消息区域 */}
          <div 
            ref={viewportRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-slate-50/50"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-[#00685F] flex items-center justify-center shadow-xl shadow-[#00685F]/30">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#89F5E7] flex items-center justify-center shadow-md">
                    <span className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#213145] mb-2">AI 健康助手</h2>
                  <p className="text-slate-500 text-lg">您好，有医学相关的问题都可以问我哦。</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {["写作润色", "翻译", "编程帮助", "知识问答"].map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(tag)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 text-sm hover:bg-[#00685F]/10 hover:border-[#00685F] hover:text-[#00685F] transition-all duration-200 shadow-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 mb-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {message.role === 'user' ? (
                    <>
                      {avatarUrl ? (
                        <Avatar src={avatarUrl} size={40} className="flex-shrink-0 shadow-md" />
                      ) : (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#213145] flex items-center justify-center shadow-md">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="relative max-w-[70%]">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm px-5 py-3 shadow-lg">
                          {message.content && <p className="text-base leading-relaxed">{message.content}</p>}
                          {message.image && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                              <img src={message.image} alt="图片消息" className="max-w-full max-h-64 object-contain" />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="relative max-w-[70%]">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                          <div className="text-base leading-normal text-slate-800 whitespace-pre-wrap break-words [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-slate-900 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:text-slate-900 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1.5 [&_h3]:text-slate-900 [&_p]:mb-1.5 [&_p]:last:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-0 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-0 [&_li]:mb-0 [&_li_p]:mb-0 [&_li_p]:inline [&_li_ul]:mt-0 [&_li_ol]:mt-0 [&_li_ul]:mb-0 [&_li_ol]:mb-0 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:text-slate-500 [&_blockquote]:bg-emerald-50/60 [&_blockquote]:rounded-r-lg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:text-slate-800 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:rounded-2xl [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_a]:text-blue-600 [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:my-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizeMarkdown(message.content)}</ReactMarkdown>
                          </div>
                          {message.role === 'assistant' && (
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => copyMessage(message.id, message.content)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs"
                              >
                                {copiedMessageId === message.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedMessageId === message.id ? '已复制' : '复制'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t border-slate-100 bg-white px-6 py-4">
            {/* 选中的图片预览 */}
            {selectedImage && (
              <div className="mb-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <img src={selectedImage} alt="选中的图片" className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">已选择图片</p>
                  <p className="text-xs text-slate-400">点击发送按钮发送图片</p>
                </div>
                <button
                  onClick={removeSelectedImage}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <textarea
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                  style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem', lineHeight: '1.5rem' }}
                  placeholder="输入你的问题..."
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
              
              {/* 图片上传按钮 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                disabled={isLoading}
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                  isLoading || (!input.trim() && !selectedImage)
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-xs text-slate-400 text-center mt-2">按 Enter 发送，Shift + Enter 换行 | 支持图片上传</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChat;
