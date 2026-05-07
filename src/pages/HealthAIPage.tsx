import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons'

const HealthAIPage = () => {
    const navigate = useNavigate()
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
        <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
            <div className="bg-white shadow-sm py-4 px-8 flex items-center flex-none">
                <button className="mr-4 text-gray-600 hover:text-blue-600" onClick={() => navigate('/')}>
                    <ArrowLeftOutlined />
                </button>
                <h1 className="text-xl font-semibold">AI 智能在线问诊</h1>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-4 flex-1 overflow-hidden flex flex-col">
                <div className="bg-white rounded-xl shadow-md overflow-hidden flex-1 flex flex-col">
                    <div className="flex-1 overflow-hidden p-6 space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                {!msg.isUser && (
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-semibold">
                                        AI
                                    </div>
                                )}
                                <div
                                    className={`rounded-2xl px-4 py-3 ${
                                        msg.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.isUser && (
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                                        我
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center flex-none">
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
    )
}

export default HealthAIPage
