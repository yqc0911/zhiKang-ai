import { Button, Card, Checkbox, Input } from 'antd'
import { ArrowLeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HomePage from '../component/HomePage'

const LoginPage = () => {
    const navigate = useNavigate()

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50 flex flex-col">
            <div className="flex-none">
                <HomePage />
            </div>

            <div className="flex-1 overflow-hidden px-4 py-6">
                <div className="mx-auto grid h-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
                    <div className="hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-10 text-white md:flex md:flex-col md:justify-between">
                        <div>
                            <div className="text-sm uppercase tracking-[0.35em] text-white/75">HealthAI</div>
                            <h2 className="mt-6 text-4xl font-bold leading-tight">欢迎回到智能健康服务平台</h2>
                            <p className="mt-5 max-w-md text-base leading-8 text-white/85">
                                登录后可继续你的问诊记录、症状自查结果与健康档案，获得更连续的健康服务体验。
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur">
                            <div className="text-sm text-white/75">平台能力</div>
                            <div className="mt-3 space-y-2 text-white/90">
                                <div>AI 在线问诊</div>
                                <div>症状自查分析</div>
                                <div>健康科普资讯</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center px-4 py-8 md:px-10">
                        <Card className="w-full max-w-md rounded-3xl border-slate-200/80 shadow-none md:shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <button className="mb-5 text-slate-600 transition-colors hover:text-blue-600" onClick={() => navigate('/')}>
                                <ArrowLeftOutlined />
                            </button>

                            <div className="mb-8">
                                <div className="text-3xl font-bold text-slate-800">欢迎登录</div>
                                <div className="mt-2 text-slate-500">登录后可查看问诊记录与健康档案</div>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    size="large"
                                    placeholder="请输入手机号或用户名"
                                    prefix={<UserOutlined className="text-slate-400" />}
                                />
                                <Input.Password
                                    size="large"
                                    placeholder="请输入密码"
                                    prefix={<LockOutlined className="text-slate-400" />}
                                />

                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <Checkbox>记住我</Checkbox>
                                    <button className="text-blue-600 hover:text-blue-500">忘记密码？</button>
                                </div>

                                <Button type="primary" size="large" block className="h-11 rounded-xl">
                                    登录
                                </Button>

                                <div className="text-center text-sm text-slate-500">
                                    还没有账号？
                                    <button className="ml-1 text-blue-600 hover:text-blue-500" onClick={() => navigate('/register')}>
                                        去注册
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

export default LoginPage
