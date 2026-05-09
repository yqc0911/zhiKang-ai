import { Button, Card, Input } from 'antd'
import { ArrowLeftOutlined, LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HomePage from '../component/HomePage'

const RegisterPage = () => {
    const navigate = useNavigate()

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50 flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-6">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[0.95fr_1.05fr]">
                    <div className="hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-10 text-white md:flex md:flex-col md:justify-between">
                        <div>
                            <div className="text-sm uppercase tracking-[0.35em] text-white/75">Join HealthAI</div>
                            <h2 className="mt-6 text-4xl font-bold leading-tight">创建账号，开启更智能的健康管理</h2>
                            <p className="mt-5 max-w-md text-base leading-8 text-white/85">
                                注册后你可以使用 AI 问诊、症状自查和健康科普等能力，建立属于你的健康档案。
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur">
                            <div className="text-sm text-white/75">注册后可获得</div>
                            <div className="mt-3 space-y-2 text-white/90">
                                <div>个性化健康建议</div>
                                <div>历史咨询记录保存</div>
                                <div>健康资讯持续更新</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-4 py-8 md:px-10">
                        <Card className="w-full max-w-md rounded-3xl border-slate-200/80 shadow-none md:shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <button className="mb-5 text-slate-600 transition-colors hover:text-blue-600" onClick={() => navigate('/')}>
                                <ArrowLeftOutlined />
                            </button>

                            <div className="mb-8">
                                <div className="text-3xl font-bold text-slate-800">创建账号</div>
                                <div className="mt-2 text-slate-500">注册后即可使用 AI 问诊与症状自查</div>
                            </div>

                            <div className="space-y-4">
                                <Input size="large" placeholder="请输入姓名" prefix={<UserOutlined className="text-slate-400" />} />
                                <Input size="large" placeholder="请输入手机号" prefix={<PhoneOutlined className="text-slate-400" />} />
                                <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined className="text-slate-400" />} />
                                <Input.Password size="large" placeholder="确认密码" prefix={<LockOutlined className="text-slate-400" />} />
                                <Button type="primary" size="large" block className="h-11 rounded-xl">
                                    注册
                                </Button>
                                <div className="text-center text-sm text-slate-500">
                                    已有账号？
                                    <button className="ml-1 text-blue-600 hover:text-blue-500" onClick={() => navigate('/login')}>
                                        去登录
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
