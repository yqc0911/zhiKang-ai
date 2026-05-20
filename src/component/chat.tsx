import { useMemo, useState } from 'react'
import { Button, Input, Tag } from 'antd'
import {
    ArrowUpOutlined,
    BellOutlined,
    ClockCircleOutlined,
    HeartOutlined,
    MedicineBoxOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons'

type Message = {
    id: number
    text: string
    isUser: boolean
    time: string
}

const quickQuestions = ['头晕乏力怎么办？', '最近咳嗽发烧要注意什么？', '如何判断是否需要就医？']

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: '您好，我是您的健康助手。请描述症状、持续时间和伴随表现，我会帮您做初步分析。',
            isUser: false,
            time: '09:12',
        },
        {
            id: 2,
            text: '我最近总是感觉头晕，而且没什么精神。',
            isUser: true,
            time: '09:13',
        },
        {
            id: 3,
            text: '明白了。请问您是否伴随发热、恶心、睡眠不足或饮水较少的情况？',
            isUser: false,
            time: '09:13',
        },
    ])
    const [inputValue, setInputValue] = useState('')

    const latestStatus = useMemo(() => {
        return '在线服务中 · 平均响应 3 秒'
    }, [])

    const sendMessage = (content: string) => {
        const text = content.trim()
        if (!text) return

        setMessages((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                text,
                isUser: true,
                time: '09:14',
            },
            {
                id: prev.length + 2,
                text: '我已收到您的描述。建议您补充年龄、血压、是否近期熬夜或饮水不足等信息，以便进一步判断。',
                isUser: false,
                time: '09:14',
            },
        ])
        setInputValue('')
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/60 to-white text-slate-800">
            <aside className="hidden w-[340px] flex-col border-r border-slate-200/70 bg-white/80 px-6 py-6 backdrop-blur xl:flex">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                        <MedicineBoxOutlined />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">AI 健康问诊</div>
                        <div className="text-sm text-slate-500">智能分诊与健康建议</div>
                    </div>
                </div>

                <div className="mt-8 rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-cyan-700">
                        <SafetyCertificateOutlined />
                        当前状态
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-slate-900">{latestStatus}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-500">
                        输入症状后，系统会结合常见疾病特征给出初步建议，并提示是否需要尽快就医。
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm text-slate-500">平均响应</div>
                        <div className="mt-2 text-xl font-semibold text-slate-900">3s</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-sm text-slate-500">在线医生</div>
                        <div className="mt-2 text-xl font-semibold text-slate-900">24/7</div>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">快捷问题</div>
                    <div className="mt-4 flex flex-col gap-3">
                        {quickQuestions.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => sendMessage(item)}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                    <div className="flex items-center gap-2 font-medium">
                        <BellOutlined />
                        温馨提示
                    </div>
                    <div className="mt-2 leading-6">
                        本页面结果仅供参考，不能替代专业医生诊断。如有胸痛、呼吸困难、意识异常等情况，请立即就医。
                    </div>
                </div>
            </aside>

            <main className="flex flex-1 flex-col overflow-hidden">
                <header className="flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-4 py-4 backdrop-blur md:px-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-cyan-700">
                            <HeartOutlined />
                            在线问诊助手
                        </div>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">让对话更像一次专业问诊</h1>
                    </div>
                    <div className="hidden items-center gap-2 md:flex">
                        <Tag color="cyan" className="rounded-full px-3 py-1 text-sm">
                            {latestStatus}
                        </Tag>
                        <Tag color="blue" className="rounded-full px-3 py-1 text-sm">
                            <ClockCircleOutlined />
                            9:00 - 22:00
                        </Tag>
                    </div>
                </header>

                <section className="flex flex-1 overflow-hidden p-4 md:p-6">
                    <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <div className="border-b border-slate-100 px-5 py-4 md:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-base font-semibold text-slate-900">对话窗口</div>
                                    <div className="mt-1 text-sm text-slate-500">支持连续追问、补充病情与快捷建议</div>
                                </div>
                                <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
                                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                    服务在线
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
                            <div className="space-y-5">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                        {!msg.isUser && (
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-semibold text-white shadow-md shadow-cyan-500/20">
                                                AI
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[80%] rounded-[1.5rem] px-4 py-3 shadow-sm md:max-w-[68%] ${
                                                msg.isUser
                                                    ? 'rounded-br-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                                                    : 'rounded-bl-md border border-slate-200 bg-slate-50 text-slate-800'
                                            }`}
                                        >
                                            <div className="whitespace-pre-wrap leading-7">{msg.text}</div>
                                            <div className={`mt-2 text-xs ${msg.isUser ? 'text-cyan-50/80' : 'text-slate-400'}`}>{msg.time}</div>
                                        </div>

                                        {msg.isUser && (
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 shadow-sm">
                                                我
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 bg-white px-4 py-4 md:px-6">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <Tag color="green" className="rounded-full px-3 py-1">
                                    <ThunderboltOutlined />
                                    快速分诊
                                </Tag>
                                <Tag color="cyan" className="rounded-full px-3 py-1">
                                    <SafetyCertificateOutlined />
                                    隐私保护
                                </Tag>
                                <Tag color="blue" className="rounded-full px-3 py-1">
                                    <PhoneOutlined />
                                    可继续追问
                                </Tag>
                            </div>

                            <div className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-inner shadow-slate-100">
                                <Input.TextArea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="请输入症状、持续时间、年龄、是否发热等信息"
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                    variant="borderless"
                                    className="!bg-transparent !text-base"
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            e.preventDefault()
                                            sendMessage(inputValue)
                                        }
                                    }}
                                />
                                <Button
                                    type="primary"
                                    shape="round"
                                    size="large"
                                    icon={<ArrowUpOutlined />}
                                    onClick={() => sendMessage(inputValue)}
                                    className="shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600"
                                >
                                    发送
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
