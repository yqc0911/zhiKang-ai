

const Footer = () => {
    return (
        <div className="w-full h-58 bg-[#1f2937] pt-12" >
            <div className="w-5/6 flex text-[#9ca3af] justify-evenly mx-auto flex-wrap">
                <div className="ml-[-5rem]">
                    智能健康助手，专业医疗服务
                </div>
                <div>
                    <div className="leading-6">
                        <button className="cursor-pointer">首页</button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer">AI问诊</button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer">症状自查</button>
                    </div>
                </div>
                <div>
                    <div className="leading-6">
                        <button className="cursor-pointer">帮助中心</button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer">隐私政策</button>
                    </div>

                    <div className="leading-6">
                        <button className="cursor-pointer">联系我们</button>
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
            {/* 分割线 */}
            <div className="w-full border-t border-t-[#374151] mt-[2rem] pt-[2rem] text-center mb-[1rem]">
                © 2023 HealthAI. All rights reserved.
            </div>
            </div>
        </div>
    )
}

export default Footer