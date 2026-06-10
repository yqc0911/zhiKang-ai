import { useState } from 'react'
import { Button, Card, Collapse, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import HomePage from '../component/HomePage'
import { useNavigate } from 'react-router-dom'

const faqData = [
    {
        key: '1',
        label: '如何使用 AI 问诊？',
        children: '点击首页的 AI 问诊入口，输入你的症状描述后，系统会给出初步建议。',
    },
    {
        key: '2',
        label: '症状自查页面能做什么？',
        children: '你可以通过勾选症状快速获取风险提示，并跳转到 AI 问诊页面继续咨询。',
    },
    {
        key: '3',
        label: '平台是否可以替代医院诊断？',
        children: '不可以。平台仅提供健康咨询和辅助判断，不能替代医生面对面诊断。',
    },
    {
        key: '4',
        label: '如何查看历史问诊记录？',
        children: '进入个人中心后可查看我的问诊历史，便于回顾咨询内容。',
    },
]

const HelpCenterPage = () => {
    const [keyword, setKeyword] = useState('')

    const filteredFaq = faqData.filter(
        (item) => item.label.includes(keyword.trim()) || item.children.includes(keyword.trim()),
    )
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <HomePage />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <div className="text-2xl font-bold text-slate-800 sm:text-3xl">常见问题</div>
                                <div className="mt-2 text-sm text-slate-500 sm:text-base">快速搜索你关心的问题，获取使用指引</div>
                            </div>

                            <Input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="搜索帮助内容"
                                prefix={<SearchOutlined className="text-slate-400" />}
                                className="rounded-xl"
                            />

                            <div className="overflow-auto pr-1">
                                <Collapse accordion items={filteredFaq} />
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card className="rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="text-xl font-semibold text-slate-800">联系客服</div>
                            <div className="mt-4 space-y-3 leading-7 text-slate-600">
                                <div>工作时间：周一至周五 9:00 - 18:00</div>
                                <div>客服电话：400-123-4567</div>
                                <div>客服邮箱：info@healthai.com</div>
                            </div>
                        </Card>

                        <Card className="rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="text-xl font-semibold text-slate-800">建议入口</div>
                            <div className="mt-4 space-y-3 leading-7 text-slate-600">
                                <div>1. 使用 AI 问诊获取初步判断</div>
                                <div>2. 使用症状自查缩小可能范围</div>
                                <div>3. 严重情况请及时线下就医</div>
                            </div>
                        </Card>

                        <Button type="primary" size="large" block onClick={() => navigate('/health-ai')}>
                            去 AI 问诊
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelpCenterPage
