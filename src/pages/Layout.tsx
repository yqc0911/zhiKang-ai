import Ability from '../component/Ability'

import HomePage from '../component/HomePage'
import Footer from '../component/Footer'
import Banner from '../component/Banner'
import { ExportOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50">
            <HomePage />
            <Banner />
            <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <div className="bg-white">
                    <div className="page-fade-in bg-white px-4 pt-8 sm:px-6 md:px-10">
                        <Ability />
                    </div>
                </div>
            </div>

            {/* 黑色条块区域 */}
            <div className="my-10 w-full bg-[#213145] px-4 py-10 sm:my-12 sm:py-12 lg:py-16">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-8 lg:gap-12">
                    <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:px-4">
                        <p className="text-3xl font-bold text-[#89F5E7] sm:text-4xl">1M+</p>
                        <p className="my-1 text-sm text-[#EAF1FF] sm:text-base">活跃用户</p>
                        <p className="text-sm text-[#EAF1FF]/90 sm:text-base">全球百万用户的信赖选择</p>
                    </div>

                    <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:px-4">
                        <p className="text-3xl font-bold text-[#89F5E7] sm:text-4xl">10k+</p>
                        <p className="my-1 text-sm text-[#EAF1FF] sm:text-base">认证医生</p>
                        <p className="text-sm text-[#EAF1FF]/90 sm:text-base">严选三甲医院权威专家</p>
                    </div>

                    <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:px-4">
                        <p className="text-3xl font-bold text-[#89F5E7] sm:text-4xl">99%</p>
                        <p className="my-1 text-sm text-[#EAF1FF] sm:text-base">诊断准确率</p>
                        <p className="text-sm text-[#EAF1FF]/90 sm:text-base">深度学习驱动的高精准度</p>
                    </div>
                </div>
            </div>

            {/* 健康洞察与资讯 */}
            <div className="mx-auto w-full bg-white">
                <div className="outDIv mx-auto w-full max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
                    <div className="title">
                        <p className="mb-4 text-3xl font-semibold text-[#00685F] sm:text-4xl lg:text-5xl">健康洞察与资讯</p>
                        <div className="inner flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">为您挑选最前沿的医疗科技与健康管理建议</p>
                            <button className="cursor-pointer self-start text-[#00685F] transition hover:text-[#00514a] sm:self-auto" onClick={() => navigate('/health-tips')}>
                                查看全部 <ExportOutlined />
                            </button>
                        </div>
                    </div>

                    {/* 图片区域 */}
                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="h-64 rounded-3xl bg-[url()] bg-cover bg-center sm:h-72 lg:h-[19.25rem]"></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Layout