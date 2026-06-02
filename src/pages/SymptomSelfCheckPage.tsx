import { useState } from 'react'
import { Button, Card, Progress, Tag, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HomePage from '../component/HomePage'
import HumanBody3D from '../component/HumanBody3D'

interface SelectedPainPoint {
    part: string
    point: {
        x: number
        y: number
        z: number
    }
}

const SymptomSelfCheckPage = () => {
    const navigate = useNavigate()
    const [bodyPainParts, setBodyPainParts] = useState<string[]>([])
    const [painPoints, setPainPoints] = useState<SelectedPainPoint[]>([])

    const riskScore = Math.min(100, bodyPainParts.length * 18)
    const riskLabel = riskScore >= 70 ? '高风险' : riskScore >= 35 ? '中风险' : '低风险'

    const handleBodyPartSelect = (part: string, point: SelectedPainPoint['point']) => {
        setBodyPainParts((prev) => {
            const next = prev.includes(part) ? prev.filter((item) => item !== part) : [...prev, part]
            message.info(next.includes(part) ? `已记录疼痛部位：${part}` : `已取消记录：${part}`)
            return next
        })

        setPainPoints((prev) => {
            const filtered = prev.filter((item) => item.part !== part)
            return [...filtered, { part, point }]
        })
    }

    const handleAskAI = () => {
        if (!bodyPainParts.length) {
            message.warning('请先点击人体模型记录疼痛部位')
            return
        }

        navigate('/health-ai', {
            state: {
                painParts: bodyPainParts,
                painPoints,
                symptoms: [],
            },
        })
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-4">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="flex h-full flex-col gap-5 overflow-hidden">
                            <div>
                                <div className="text-2xl font-bold text-slate-800">快速症状自查</div>
                                <div className="mt-2 text-slate-500">点击 3D 人体模型记录疼痛部位</div>
                            </div>

                            <div className="flex-1 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <div>
                                        <div className="text-lg font-semibold text-slate-800">3D 人体模型</div>
                                        <div className="text-sm text-slate-500">点击身体部位记录疼痛位置</div>
                                    </div>
                                    <div className="text-sm text-slate-500">已选 {bodyPainParts.length} 个部位</div>
                                </div>
                                <div className="h-[calc(100%-3.5rem)] min-h-[420px] overflow-hidden">
                                    <HumanBody3D onSelectPart={handleBodyPartSelect} selectedParts={bodyPainParts} />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex h-full flex-col gap-6 overflow-hidden">
                        <Card className="flex-none rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="mb-2 text-slate-500">当前自查风险</div>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-4xl font-bold text-blue-600">{riskLabel}</div>
                                    <div className="mt-1 text-slate-400">已选择 {bodyPainParts.length} 个疼痛部位</div>
                                </div>
                                <CheckCircleOutlined className="text-4xl text-blue-500" />
                            </div>
                            <Progress percent={riskScore} status={riskScore >= 70 ? 'exception' : 'active'} className="mt-5" />
                        </Card>

                        <Card className="flex-1 overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="mb-4 text-lg font-semibold text-slate-800">已记录的疼痛部位</div>
                            <div className="flex max-h-[180px] flex-wrap gap-2 overflow-auto">
                                {bodyPainParts.length ? (
                                    bodyPainParts.map((item) => (
                                        <Tag key={item} color="geekblue" className="rounded-full px-3 py-1">
                                            {item}
                                        </Tag>
                                    ))
                                ) : (
                                    <div className="text-slate-400">暂无记录，请点击左侧 3D 模型</div>
                                )}
                            </div>
                        </Card>

                        <Button type="primary" size="large" block onClick={handleAskAI}>
                            去 AI 问诊进一步咨询
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SymptomSelfCheckPage
