import { useState } from 'react'
import { Button, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import HomePage from '../component/HomePage'

const HealthAIPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: '您好，我是您的健康助手，有什么症状需要咨询吗？', isUser: false },
        { id: 2, text: '我最近总是感到头晕乏力', isUser: true },
        { id: 3, text: '了解，您还有其他症状吗？比如发烧、咳嗽等？', isUser: false },
    ])
    const [inputValue, setInputValue] = useState('')

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const userMessage = inputValue
        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, text: userMessage, isUser: true },
            {
                id: prev.length + 2,
                text: '我已收到您的描述，建议您先注意休息并保持观察。如果症状持续或加重，请尽快就医。',
                isUser: false,
            },
        ])
        setInputValue('')
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-4">
                <div className="mx-auto flex h-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <div className="text-xl font-semibold text-slate-800">AI 智能在线问诊</div>
                            <div className="mt-1 text-sm text-slate-500">输入症状描述，系统会给出初步建议</div>
                        </div>

                        <div className="flex-1 overflow-hidden p-6 space-y-5">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                    {!msg.isUser && (
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 border border-blue-100 flex items-center justify-center text-white font-semibold shadow-sm">
                                            AI
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 leading-7 shadow-sm ${
                                            msg.isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.isUser && (
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold shadow-sm">
                                            我
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 bg-white/95 p-4 flex items-center flex-none">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onPressEnter={handleSendMessage}
                                placeholder="请输入您的症状或问题..."
                                className="flex-1 mr-3"
                            />
                            <Button type="primary" onClick={handleSendMessage} icon={<SendOutlined />}>
                                发送
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthAIPage
