import { useMemo, useState } from 'react'
import { Button, Card, Input, Tag } from 'antd'
import { ReadOutlined, SearchOutlined } from '@ant-design/icons'
import HomePage from '../component/HomePage'
import { useNavigate } from 'react-router-dom'

type TipCategory = '全部' | '养生' | '疾病预防' | '饮食营养' | '心理健康'

const categories: TipCategory[] = ['全部', '养生', '疾病预防', '饮食营养', '心理健康']

const healthArticles = [
    {
        id: 1,
        title: '春季养生小贴士',
        category: '养生',
        summary: '春季宜早睡早起，适度运动，保持情绪舒畅，帮助身体顺应季节变化。',
        tags: ['春季', '作息', '运动'],
        time: '5 分钟阅读',
    },
    {
        id: 2,
        title: '如何有效预防感冒',
        category: '疾病预防',
        summary: '勤洗手、常通风、合理增减衣物，是降低呼吸道感染风险的重要方式。',
        tags: ['感冒', '预防', '卫生'],
        time: '4 分钟阅读',
    },
    {
        id: 3,
        title: '均衡饮食这样搭配',
        category: '饮食营养',
        summary: '每天保证蛋白质、蔬菜、主食和优质脂肪的均衡摄入，帮助维持身体状态。',
        tags: ['饮食', '营养', '健康'],
        time: '6 分钟阅读',
    },
    {
        id: 4,
        title: '压力管理与睡眠质量',
        category: '心理健康',
        summary: '通过规律作息、冥想放松和适度运动，改善紧张情绪与睡眠问题。',
        tags: ['睡眠', '压力', '情绪'],
        time: '5 分钟阅读',
    },
    {
        id: 5,
        title: '久坐人群的日常保健',
        category: '养生',
        summary: '每隔一小时起身活动，缓解肩颈疲劳，减少久坐带来的身体负担。',
        tags: ['久坐', '肩颈', '拉伸'],
        time: '3 分钟阅读',
    },
    {
        id: 6,
        title: '夏季饮食注意事项',
        category: '饮食营养',
        summary: '夏季注意饮食卫生和补水，避免过量生冷刺激，减少肠胃不适。',
        tags: ['夏季', '肠胃', '补水'],
        time: '4 分钟阅读',
    },
]

const HealthTipsPage = () => {
    const [keyword, setKeyword] = useState('')
    const [activeCategory, setActiveCategory] = useState<TipCategory>('全部')
    const navigate = useNavigate()

    const filteredArticles = useMemo(() => {
        return healthArticles.filter((article) => {
            const matchCategory = activeCategory === '全部' || article.category === activeCategory
            const matchKeyword = !keyword.trim() || article.title.includes(keyword.trim()) || article.summary.includes(keyword.trim())
            return matchCategory && matchKeyword
        })
    }, [activeCategory, keyword])

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-4">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="h-full flex flex-col gap-5 overflow-hidden">
                            <div>
                                <div className="text-3xl font-bold text-slate-800">健康科普资讯</div>
                                <div className="text-slate-500 mt-2">精选健康知识，帮助你形成更好的生活习惯</div>
                            </div>

                            <Input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="搜索文章标题或内容"
                                prefix={<SearchOutlined className="text-slate-400" />}
                                className="rounded-xl"
                            />

                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Tag
                                        key={category}
                                        color={activeCategory === category ? 'blue' : 'default'}
                                        className="px-3 py-1 cursor-pointer text-base leading-6 rounded-full"
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </Tag>
                                ))}
                            </div>

                            <div className="flex-1 overflow-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredArticles.map((article) => (
                                    <Card key={article.id} hoverable className="h-full rounded-2xl border-slate-200/80 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-none">
                                                <ReadOutlined />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-lg font-semibold text-slate-800">{article.title}</div>
                                                <div className="text-sm text-slate-500 mt-1">{article.time}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-slate-600 leading-7">{article.summary}</div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {article.tags.map((tag) => (
                                                <Tag key={tag}>{tag}</Tag>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="h-full flex flex-col gap-6 overflow-hidden">
                        <Card className="flex-none rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="text-xl font-semibold text-slate-800">今日推荐</div>
                            <div className="mt-4 space-y-3">
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-slate-700">
                                    保持规律作息，能有效改善免疫状态与精神状态。
                                </div>
                                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-slate-700">
                                    每天饮水 1500ml 左右，有助于维持身体代谢与循环。
                                </div>
                            </div>
                        </Card>

                        <Card className="flex-1 overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="text-xl font-semibold text-slate-800">健康提醒</div>
                            <div className="mt-4 space-y-3 overflow-auto pr-1">
                                <div className="rounded-2xl border border-slate-100 p-4 text-slate-700">尽量减少熬夜，提升睡眠质量。</div>
                                <div className="rounded-2xl border border-slate-100 p-4 text-slate-700">每周保持 3 次以上适度运动。</div>
                                <div className="rounded-2xl border border-slate-100 p-4 text-slate-700">合理饮食，少油少糖少盐。</div>
                            </div>
                        </Card>

                        <Button type="primary" size="large" block onClick={() => navigate('/health-ai')}>
                            去 AI 问诊获取进一步建议
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthTipsPage
