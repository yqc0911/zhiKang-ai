import { Button, Card, Input, message } from 'antd'
import HomePage from '../component/HomePage'

const ContactUsPage = () => {
    const handleSubmit = () => {
        message.success('留言已提交，我们会尽快联系你')
    }

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-4">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <Card className="h-full rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="space-y-4 text-slate-700 leading-7">
                            <div className="text-3xl font-bold text-slate-800">联系信息</div>
                            <div>客服电话：400-123-4567</div>
                            <div>客服邮箱：info@healthai.com</div>
                            <div>公司地址：北京市朝阳区健康路123号</div>
                            <div>工作时间：周一至周五 9:00 - 18:00</div>
                        </div>
                    </Card>

                    <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                        <div className="h-full flex flex-col gap-4">
                            <div className="text-3xl font-bold text-slate-800">在线留言</div>
                            <Input placeholder="你的姓名" size="large" />
                            <Input placeholder="你的邮箱" size="large" />
                            <Input.TextArea placeholder="请输入你的问题或建议" rows={8} />
                            <div className="mt-auto">
                                <Button type="primary" size="large" block onClick={handleSubmit}>
                                    提交留言
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ContactUsPage
