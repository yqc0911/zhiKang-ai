import { Carousel } from 'antd'

const slides = [
    {
        title: '智能健康管理',
        desc: 'AI 辅助问诊与健康资讯一体化服务',
        bg: 'from-slate-900 via-blue-900 to-cyan-800',
    },
    {
        title: '专业症状自查',
        desc: '快速识别风险，给出更清晰的建议路径',
        bg: 'from-blue-900 via-indigo-900 to-slate-900',
    },
    {
        title: '权威健康科普',
        desc: '精选生活方式建议，打造更健康的日常',
        bg: 'from-cyan-800 via-blue-800 to-slate-900',
    },
    {
        title: '隐私与安全保护',
        desc: '更安心的健康服务体验与数据保护机制',
        bg: 'from-slate-900 via-slate-800 to-blue-900',
    },
]

const Banner = () => {
    return (
        <div className="page-fade-in mt-6 overflow-hidden rounded-[2rem] border border-white/70">
            <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={4000} dots className="banner-carousel animate-shimmer-slow">
                {slides.map((slide) => (
                    <div key={slide.title}>
                        <div className={`h-[360px] bg-gradient-to-br ${slide.bg} text-white`}>
                            <div className="flex h-full items-center px-10 md:px-16">
                                <div className="max-w-2xl">
                                    <div className="mb-4 text-sm uppercase tracking-[0.35em] text-white/70">HealthAI</div>
                                    <h3 className="text-4xl font-bold leading-tight md:text-5xl">{slide.title}</h3>
                                    <p className="mt-5 max-w-xl text-base leading-8 text-white/80 md:text-lg">{slide.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default Banner