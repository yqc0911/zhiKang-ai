import { useMemo, useState } from 'react'
import { Button, Card, Input, Progress, Tag } from 'antd'
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HomePage from '../component/HomePage'

const symptomCategories = [
    '头痛',
    '发热',
    '咳嗽',
    '胸闷',
    '腹痛',
    '恶心',
    '呕吐',
    '腹泻',
    '乏力',
    '失眠',
    '心悸',
    '皮疹',
]

const suggestions = [
    '多饮水，保持休息',
    '记录症状持续时间',
    '若持续加重请及时就医',
]

const SymptomSelfCheckPage = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<string[]>([])

    const filteredCategories = useMemo(() => {
        if (!query.trim()) return symptomCategories
        return symptomCategories.filter((item) => item.includes(query.trim()))
    }, [query])

    const riskScore = Math.min(100, selected.length * 18)
    const riskLabel = riskScore >= 70 ? '高风险' : riskScore >= 35 ? '中风险' : '低风险'

    const toggleSymptom = (symptom: string) => {
        setSelected((prev) =>
            prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom],
        )
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-4">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                    <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="h-full flex flex-col gap-5 overflow-hidden">
                            <div>
                                <div className="text-2xl font-bold text-slate-800">快速症状自查</div>
                                <div className="text-slate-500 mt-2">搜索或点击症状标签，快速查看自查建议</div>
                            </div>

                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="搜索症状，例如：头痛、发热、咳嗽"
                                prefix={<SearchOutlined className="text-slate-400" />}
                                className="rounded-xl"
                            />

                            <div className="flex flex-wrap gap-3 overflow-auto pr-1">
                                {filteredCategories.map((symptom) => {
                                    const active = selected.includes(symptom)
                                    return (
                                        <Tag
                                            key={symptom}
                                            color={active ? 'blue' : 'default'}
                                            className="px-3 py-1 cursor-pointer text-base leading-6 rounded-full"
                                            onClick={() => toggleSymptom(symptom)}
                                        >
                                            {symptom}
                                        </Tag>
                                    )
                                })}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {suggestions.map((item) => (
                                    <div key={item} className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-slate-700 shadow-sm">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="h-full flex flex-col gap-6 overflow-hidden">
                        <Card className="flex-none rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="text-slate-500 mb-2">当前自查风险</div>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-4xl font-bold text-blue-600">{riskLabel}</div>
                                    <div className="text-slate-400 mt-1">已选择 {selected.length} 项症状</div>
                                </div>
                                <CheckCircleOutlined className="text-4xl text-blue-500" />
                            </div>
                            <Progress percent={riskScore} status={riskScore >= 70 ? 'exception' : 'active'} className="mt-5" />
                        </Card>

                        <Card className="flex-1 overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="text-lg font-semibold mb-4 text-slate-800">已选择的症状</div>
                            <div className="flex flex-wrap gap-2 overflow-auto max-h-[220px]">
                                {selected.length ? (
                                    selected.map((item) => (
                                        <Tag key={item} color="blue" className="px-3 py-1 rounded-full">
                                            {item}
                                        </Tag>
                                    ))
                                ) : (
                                    <div className="text-slate-400">暂无选择，请在左侧添加症状</div>
                                )}
                            </div>
                        </Card>

                        <Button type="primary" size="large" block onClick={() => navigate('/health-ai')}>
                            去 AI 问诊进一步咨询
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SymptomSelfCheckPage
