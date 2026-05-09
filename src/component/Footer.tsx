

import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()

    return (
        <div className="w-full bg-[#1f2937] pt-12 pb-6">
            <div className="w-5/6 flex text-[#9ca3af] justify-evenly mx-auto flex-wrap gap-8">
                <div className="ml-[-5rem] max-w-xs">
                    智能健康助手，专业医疗服务
                </div>
                <div>
                    <div className="leading-6">
                        <button className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/')}>
                            首页
                        </button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/health-ai')}>
                            AI问诊
                        </button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/symptom-self-check')}>
                            症状自查
                        </button>
                    </div>
                </div>
                <div>
                    <div className="leading-6">
                        <button className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/help-center')}>
                            帮助中心
                        </button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/privacy-policy')}>
                            隐私政策
                        </button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/contact-us')}>
                            联系我们
                        </button>
                    </div>
                </div>
                <div>
                    <div className="leading-6">
                        电话：400-123-4567
                    </div>

                    <div className="leading-6">
                        邮箱：info@healthai.com
                    </div>

                    <div className="leading-6">
                        地址：北京市朝阳区健康路123号
                    </div>
                </div>
            </div>
            <div className="w-5/6 border-t border-t-[#374151] mt-8 pt-6 text-center text-[#9ca3af] mx-auto">
                © 2023 HealthAI. All rights reserved.
            </div>
        </div>
    )
}

export default Footer