import { Card } from 'antd'

const { Meta } = Card

interface AbilityProps {
    titleContent?: string
}

const featureCards = [
    {
        title: 'AI 智能问诊',
        description: '多轮对话与症状分析',
        image: 'https://images.unsplash.com/photo-1580281657527-47b9c1b9a8f5?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: '症状自查',
        description: '快速定位潜在风险',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: '健康档案',
        description: '沉淀你的健康数据',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1d7f4aa?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: '健康科普',
        description: '精选内容持续更新',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    },
]

const Ability = ({ titleContent = '核心功能' }: AbilityProps) => {
    return (
        <div className="mx-auto mt-10">
            <div className="text-center text-2xl font-semibold tracking-[0.28em] text-slate-800">
                {titleContent}
            </div>
            <div className="abilityBox mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featureCards.map((card, index) => (
                    <Card
                        key={card.title}
                        className="card-hover-lift animate-fade-up overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_16px_40px_rgba(15,23,42,0.06)] hover:border-blue-200"
                        hoverable
                        style={{ animationDelay: `${index * 90}ms` }}
                        cover={
                            <img
                                className="h-[132px] w-full object-cover transition-transform duration-500 hover:scale-105"
                                draggable={false}
                                alt={card.title}
                                src={card.image}
                            />
                        }
                    >
                        <Meta title={card.title} description={card.description} />
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Ability