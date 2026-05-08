import { useMemo, useState } from 'react'
import { Button, Card, Input, Progress, Tag } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

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
        <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <div className="bg-white shadow-sm py-4 px-8 flex items-center flex-none">
                <button className="mr-4 text-gray-600 hover:text-blue-600" onClick={() => navigate('/')}>
                    <ArrowLeftOutlined />
                </button>
                <h1 className="text-xl font-semibold">症状自查</h1>
            </div>

            <div className="flex-1 overflow-hidden px-8 py-6">
                <div className="h-full grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
                    <Card className="h-full overflow-hidden">
                        <div className="h-full flex flex-col gap-5 overflow-hidden">
                            <div>
                                <div className="text-2xl font-bold text-gray-800">快速症状自查</div>
                                <div className="text-gray-500 mt-2">搜索或点击症状标签，快速查看自查建议</div>
                            </div>

                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="搜索症状，例如：头痛、发热、咳嗽"
                                prefix={<SearchOutlined className="text-gray-400" />}
                            />

                            <div className="flex flex-wrap gap-3 overflow-auto pr-1">
                                {filteredCategories.map((symptom) => {
                                    const active = selected.includes(symptom)
                                    return (
                                        <Tag
                                            key={symptom}
                                            color={active ? 'blue' : 'default'}
                                            className="px-3 py-1 cursor-pointer text-base leading-6"
                                            onClick={() => toggleSymptom(symptom)}
                                        >
                                            {symptom}
                                        </Tag>
                                    )
                                })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {suggestions.map((item) => (
                                    <div key={item} className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-gray-700">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="h-full flex flex-col gap-6 overflow-hidden">
                        <Card className="flex-none">
                            <div className="text-gray-500 mb-2">当前自查风险</div>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-4xl font-bold text-blue-600">{riskLabel}</div>
                                    <div className="text-gray-400 mt-1">已选择 {selected.length} 项症状</div>
                                </div>
                                <CheckCircleOutlined className="text-4xl text-blue-500" />
                            </div>
                            <Progress percent={riskScore} status={riskScore >= 70 ? 'exception' : 'active'} className="mt-5" />
                        </Card>

                        <Card className="flex-1 overflow-hidden">
                            <div className="text-lg font-semibold mb-4">已选择的症状</div>
                            <div className="flex flex-wrap gap-2 overflow-auto max-h-[220px]">
                                {selected.length ? (
                                    selected.map((item) => (
                                        <Tag key={item} color="blue" className="px-3 py-1">
                                            {item}
                                        </Tag>
                                    ))
                                ) : (
                                    <div className="text-gray-400">暂无选择，请在左侧添加症状</div>
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
