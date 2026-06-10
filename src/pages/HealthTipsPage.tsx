import { useMemo, useState, useEffect } from 'react'
import { Button, Card, Input, Tag, Table, Skeleton } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import HomePage from '../component/HomePage'
import { useNavigate } from 'react-router-dom'
import { getHealthReminders, type HealthReminder, type WeatherInfo } from '../utils/request'

type TipCategory = '全部' | '养生' | '疾病预防' | '饮食营养' | '心理健康'

const iconMap: Record<string, string> = {
    hot: '🔥',
    cold: '❄️',
    rain: '🌧️',
    fog: '🌫️',
    sunny: '☀️',
    humid: '💧',
    windy: '💨',
    sleep: '🌙',
    exercise: '🏃',
    diet: '🥗',
}

const categories: TipCategory[] = ['全部', '养生', '疾病预防', '饮食营养', '心理健康']

const healthArticles = [
    { id: 1, title: '春季养生小贴士', category: '养生', summary: '春季宜早睡早起，适度运动，保持情绪舒畅，帮助身体顺应季节变化。', tags: ['春季', '作息', '运动'], time: '5 分钟阅读' },
    { id: 2, title: '如何有效预防感冒', category: '疾病预防', summary: '勤洗手、常通风、合理增减衣物，是降低呼吸道感染风险的重要方式。', tags: ['感冒', '预防', '卫生'], time: '4 分钟阅读' },
    { id: 3, title: '均衡饮食这样搭配', category: '饮食营养', summary: '每天保证蛋白质、蔬菜、主食和优质脂肪的均衡摄入，帮助维持身体状态。', tags: ['饮食', '营养', '健康'], time: '6 分钟阅读' },
    { id: 4, title: '压力管理与睡眠质量', category: '心理健康', summary: '通过规律作息、冥想放松和适度运动，改善紧张情绪与睡眠问题。', tags: ['睡眠', '压力', '情绪'], time: '5 分钟阅读' },
    { id: 5, title: '久坐人群的日常保健', category: '养生', summary: '每隔一小时起身活动，缓解肩颈疲劳，减少久坐带来的身体负担。', tags: ['久坐', '肩颈', '拉伸'], time: '3 分钟阅读' },
    { id: 6, title: '夏季饮食注意事项', category: '饮食营养', summary: '夏季注意饮食卫生和补水，避免过量生冷刺激，减少肠胃不适。', tags: ['夏季', '肠胃', '补水'], time: '4 分钟阅读' },
]

const HealthTipsPage = () => {
    const [keyword, setKeyword] = useState('')
    const [activeCategory, setActiveCategory] = useState<TipCategory>('全部')
    const [healthReminders, setHealthReminders] = useState<HealthReminder[]>([])
    const [weather, setWeather] = useState<WeatherInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState('北京')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchHealthReminders = async () => {
            setLoading(true)
            try {
                const res = await getHealthReminders(location)
                if (res.data.code === 200 && res.data.data) {
                    setHealthReminders(res.data.data.reminders)
                    setWeather(res.data.data.weather)
                    if (res.data.data.location) {
                        setLocation(res.data.data.location)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch health reminders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchHealthReminders()
    }, [location])

    const filteredArticles = useMemo(() => {
        return healthArticles.filter((article) => {
            const matchCategory = activeCategory === '全部' || article.category === activeCategory
            const matchKeyword = !keyword.trim() || article.title.includes(keyword.trim()) || article.summary.includes(keyword.trim())
            return matchCategory && matchKeyword
        })
    }, [activeCategory, keyword])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <HomePage />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="flex flex-col gap-5">
                            <div>
                                <div className="text-2xl font-bold text-slate-800 sm:text-3xl">健康科普资讯</div>
                                <div className="mt-2 text-sm text-slate-500 sm:text-base">精选健康知识，帮助你形成更好的生活习惯</div>
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
                                        className="cursor-pointer rounded-full px-3 py-1 text-sm leading-6 sm:text-base"
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </Tag>
                                ))}
                            </div>

                            <div className="overflow-hidden">
                                <Table
                                    dataSource={filteredArticles}
                                    rowKey="id"
                                    pagination={{ pageSize: 4, size: 'small' }}
                                    scroll={{ x: 900 }}
                                    columns={[
                                        { title: '标题', dataIndex: 'title', key: 'title', className: 'font-semibold text-slate-800', width: 180 },
                                        { title: '分类', dataIndex: 'category', key: 'category', width: 120, render: (category: string) => <Tag color="blue">{category}</Tag> },
                                        { title: '简介', dataIndex: 'summary', key: 'summary', className: 'text-slate-600', ellipsis: true, width: 320 },
                                        { title: '标签', dataIndex: 'tags', key: 'tags', width: 220, render: (tags: string[]) => <div className="flex flex-wrap gap-1">{tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div> },
                                        { title: '阅读时间', dataIndex: 'time', key: 'time', className: 'text-slate-500', width: 120 },
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col gap-4">
                        <Card className="rounded-xl border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <div className="text-base font-semibold text-slate-800">当前地点</div>
                            <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-slate-600">
                                {loading ? <Skeleton active paragraph={{ rows: 1 }} title={false} /> : <div>定位城市：{location}</div>}
                            </div>
                        </Card>

                        <Card className="rounded-xl border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <div className="text-base font-semibold text-slate-800">今日天气</div>
                            <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-slate-600">
                                {loading ? (
                                    <Skeleton active paragraph={{ rows: 3 }} title={false} />
                                ) : weather ? (
                                    <div className="space-y-1">
                                        <div>天气：{weather.text}</div>
                                        <div>温度：{weather.temp}</div>
                                        <div>湿度：{weather.humidity}</div>
                                        <div>风向：{weather.windDir} / {weather.windSpeed}</div>
                                    </div>
                                ) : (
                                    <div>暂无天气数据</div>
                                )}
                            </div>
                        </Card>

                        <Card className="rounded-xl border-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                            <div className="text-base font-semibold text-slate-800">健康提醒</div>
                            <div className="mt-2 space-y-2">
                                {healthReminders.length > 0 ? (
                                    healthReminders.map((reminder, index) => (
                                        <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-100 p-3 text-sm text-slate-600">
                                            <span className="text-base">{iconMap[reminder.icon] || '📌'}</span>
                                            <span>{reminder.content}</span>
                                        </div>
                                    ))
                                ) : loading ? (
                                    <Skeleton active paragraph={{ rows: 4 }} title={false} />
                                ) : (
                                    <div className="text-sm text-slate-400">暂无健康提醒</div>
                                )}
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
