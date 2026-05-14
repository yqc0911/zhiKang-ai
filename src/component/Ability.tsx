import { Button, Card, Tag } from 'antd'
import { ArrowRightOutlined, HeartOutlined, ReadOutlined, RobotOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface AbilityProps {
    titleContent?: string
}

const featureCards = [
    {
        key: 'health-ai',
        title: 'AI 智能问诊',
        description: '多轮对话与症状分析，帮助你快速获取初步健康建议。',
        image: 'https://picsum.photos/seed/health-ai/900/600',
        icon: <RobotOutlined />,
        tags: ['智能对话', '症状分析', '快速响应'],
        path: '/health-ai',
        accent: 'from-blue-600 to-cyan-500',
    },
    {
        key: 'symptom-self-check',
        title: '症状自查',
        description: '通过症状标签快速筛查风险，并给出进一步处理建议。',
        image: 'https://picsum.photos/seed/symptom-check/900/600',
        icon: <SearchOutlined />,
        tags: ['风险识别', '标签筛选', '自查建议'],
        path: '/symptom-self-check',
        accent: 'from-emerald-500 to-teal-500',
    },
    {
        key: 'health-records',
        title: '健康档案',
        description: '集中管理你的健康数据，让问诊与记录更连续。',
        image: 'https://picsum.photos/seed/health-records/900/600',
        icon: <HeartOutlined />,
        tags: ['档案管理', '长期追踪', '健康画像'],
        path: '/login',
        accent: 'from-rose-500 to-pink-500',
    },
    {
        key: 'health-tips',
        title: '健康科普',
        description: '精选权威健康知识，持续更新日常保健内容。',
        image: 'https://picsum.photos/seed/health-tips/900/600',
        icon: <ReadOutlined />,
        tags: ['科普内容', '生活方式', '权威建议'],
        path: '/health-tips',
        accent: 'from-violet-500 to-indigo-500',
    },
]

const Ability = ({ titleContent = '核心功能' }: AbilityProps) => {
    const navigate = useNavigate()

    return (
        <section className="mx-auto mt-10">
            <div className="text-center text-2xl font-semibold tracking-[0.28em] text-slate-800">{titleContent}</div>
            <div className="mt-3 text-center text-sm text-slate-500">围绕问诊、自查、档案和科普，构建完整的健康服务闭环</div>

            <div className="abilityBox mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featureCards.map((card, index) => (
                    <Card
                        key={card.key}
                        hoverable
                        className="group overflow-hidden rounded-3xl border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
                        style={{ animationDelay: `${index * 90}ms` }}
                        cover={
                            <div className="relative h-[180px] overflow-hidden">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    draggable={false}
                                    alt={card.title}
                                    src={card.image}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70`} />
                                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur-sm">
                                            {card.icon}
                                        </div>
                                        <Tag className="border-0 bg-white/15 px-3 py-1 text-white">FEATURE</Tag>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-semibold leading-tight">{card.title}</div>
                                        <div className="mt-2 text-sm leading-6 text-white/85">{card.description}</div>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {card.tags.map((tag) => (
                                    <Tag key={tag} className="rounded-full border-slate-200 px-3 py-1 text-slate-600">
                                        {tag}
                                    </Tag>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                block
                                size="large"
                                className="h-11 rounded-xl bg-slate-900 transition-all duration-300 hover:bg-blue-600"
                                onClick={() => navigate(card.path)}
                            >
                                立即体验
                                <ArrowRightOutlined />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}

export default Ability
