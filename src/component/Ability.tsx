import { Button, Card, Tag } from 'antd'
import { ArrowRightOutlined, HeartOutlined, ReadOutlined, SearchOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeatures, type FeatureCard as FeatureCardType } from '../utils/request'


interface AbilityProps {
    titleContent?: string
}

const iconMap: Record<string, React.ReactNode> = {
    mind: <span className="iconfont icon-mind2 text-2xl leading-none" />,
    search: <SearchOutlined />,
    heart: <HeartOutlined />,
    read: <ReadOutlined />,
    shop: <ShoppingOutlined />,
}

const Ability = ({ titleContent = '核心功能' }: AbilityProps) => {
    const navigate = useNavigate()
    const [featureCards, setFeatureCards] = useState<FeatureCardType[]>([])

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const res = await getFeatures()
                if (res.data.code === 200) {
                    setFeatureCards(res.data.data)
                }
            } catch (error) {
                console.error('Failed to fetch features:', error)
            }
        }
        fetchFeatures()
    }, [])

    return (
        <section className="mx-auto">
            <div className="text-center text-2xl font-semibold tracking-[0.28em] text-slate-800">{titleContent}</div>
            <div className="mt-3 text-center text-sm text-slate-500">集成全球领先AI模型，打造全生命周期健康管理</div>

            <div className="abilityBox mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
                {featureCards.map((card, index) => (
                    <Card
                        key={card.key}
                        hoverable
                        className="group card-hover-lift animate-fade-up cursor-default overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
                        style={{ animationDelay: `${index * 150}ms`, animationDuration: '1s' }}
                        cover={
                            <div className="relative h-[150px] overflow-hidden">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    draggable={false}
                                    alt={card.title}
                                    src={card.image}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70`} />
                                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg backdrop-blur-sm">
                                            {iconMap[card.icon]}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold leading-tight">{card.title}</div>
                                        <div className="mt-1 text-xs leading-5 text-white/85">{card.description}</div>
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
