import Ability from '../component/Ability'

import HomePage from '../component/HomePage'
import Footer from '../component/Footer'
import Banner from '../component/Banner'
import { ExportOutlined } from '@ant-design/icons'

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <HomePage />
            <Banner />
            <div className="mx-auto w-5/6 max-w-7xl pt-4">

                <div className="bg-white">
                    <div className="page-fade-in bg-white px-6 pt-8 md:px-10">
                        <Ability />
                    </div>
                </div>

            </div>


            {/* 黑色条块区域 */}
            <div className='w-full h-90 bg-[#213145] my-12'>
                <div className='outerDiv h-full flex gap-64 items-center content-center'>
                    <div className='w-96 h-36'>
                        <p className='text-center text-4xl text-[#89F5E7]'>1M+</p>
                        <p className='text-center my-1 text-[#EAF1FF]'>活跃用户</p>
                        <p className='text-center text-[#EAF1FF]'>全球百万用户的信赖选择</p>
                    </div>

                    <div className='w-96 h-36'>
                        <p className='text-center text-4xl text-[#89F5E7]'>10k+</p>
                        <p className='text-center my-1 text-[#EAF1FF]'>认证医生</p>
                        <p className='text-center text-[#EAF1FF]'>严选三甲医院权威专家</p>
                    </div>

                    <div className='w-96 h-36'>
                        <p className='text-center text-4xl text-[#89F5E7]'>99%</p>
                        <p className='text-center my-1 text-[#EAF1FF]'>诊断准确率</p>
                        <p className='text-center text-[#EAF1FF]'>深度学习驱动的高精准度</p>
                    </div>
                </div>

            </div>

            {/* 健康洞察与资讯 */}
            <div className='mx-auto w-full bg-white'>
                <div className="outDIv mx-auto w-full max-w-7xl px-8 pb-10 pt-16">
                    <div className="title">
                        <p className='mb-5 text-5xl text-[#00685F]'>健康洞察与资讯</p>
                        <div className="inner flex w-full items-center justify-between">
                            <p>为您挑选最前沿的医疗科技与健康管理建议</p>
                            <button className='cursor-pointer text-[#00685F]'>查看全部 <ExportOutlined /> </button>
                        </div>
                    </div>

                    {/* 图片区域 */}
                    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className='h-[19.25rem] rounded-3xl bg-[url()] bg-cover bg-center'></div>
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