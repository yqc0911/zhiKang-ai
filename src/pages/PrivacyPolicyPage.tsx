import { Button, Card } from 'antd'
import HomePage from '../component/HomePage'

const PrivacyPolicyPage = () => {
    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-4">
                <Card className="mx-auto h-full max-w-5xl overflow-auto rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                    <div className="max-w-4xl mx-auto space-y-6 text-slate-700 leading-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">1. 我们收集的信息</h2>
                            <p>我们仅在提供服务所必需的范围内收集基础使用信息、咨询内容和设备信息。</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">2. 信息的使用方式</h2>
                            <p>收集的信息用于提供健康咨询、优化服务体验、生成统计分析以及改进产品功能。</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">3. 信息保护</h2>
                            <p>我们采取合理的安全措施保护你的个人信息，防止未经授权的访问、披露或篡改。</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">4. 第三方共享</h2>
                            <p>未经你的授权，我们不会将你的个人信息出售或共享给无关第三方。</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">5. 你的权利</h2>
                            <p>你可以申请查看、修改或删除你的个人信息，也可以通过联系我们获取进一步帮助。</p>
                        </section>
                    </div>
                </Card>
            </div>

            <div className="bg-white border-t border-slate-200 p-4 flex-none">
                <div className="max-w-5xl mx-auto flex justify-end">
                    <Button type="primary" onClick={() => window.history.back()}>
                        返回上一页
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage
