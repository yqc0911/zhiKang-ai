import { Button, Card, Form, Input, message } from 'antd'
import { ArrowLeftOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { register, setToken } from '../utils/request'

interface RegisterFormValues {
    phone: string
    password: string
    confirmPassword: string
}

const RegisterPage = () => {
    const navigate = useNavigate()

    const handleRegister = async (values: RegisterFormValues) => {
        try {
            const res = await register({
                name: values.phone,
                phone: values.phone,
                password: values.password,
            })

            if (res?.status === 409 || res?.data?.code === 409) {
                message.error('该手机号已注册，请直接去登录')
                return
            }

            const token = res?.data?.token || res?.data?.data?.token
            if (token) {
                setToken(token)
                message.success('注册成功')
                navigate('/')
                return
            }

            message.error('注册失败，请重试')
        } catch {
            message.error('注册失败，请检查网络或后端服务')
        }
    }

    return (
        <div className="flex h-[100svh] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50">
            <div className="mx-auto flex h-full w-full max-w-6xl items-stretch px-3 py-3 sm:px-4 sm:py-4 md:py-6">
                <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[0.95fr_1.05fr]">
                    <div className="hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-8 text-white md:flex md:flex-col md:justify-between">
                        <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-sm lg:tracking-[0.35em]">Join HealthAI</div>
                            <h2 className="mt-4 text-3xl font-bold leading-tight lg:mt-6 lg:text-4xl">创建账号，开启更智能的健康管理</h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/85 lg:mt-5 lg:text-base lg:leading-8">
                                注册后你可以使用 AI 问诊、症状自查和健康科普等能力，建立属于你的健康档案。
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur lg:p-5">
                            <div className="text-sm text-white/75">注册后可获得</div>
                            <div className="mt-2 space-y-2 text-sm text-white/90 lg:mt-3 lg:text-base">
                                <div>个性化健康建议</div>
                                <div>历史咨询记录保存</div>
                                <div>健康资讯持续更新</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 items-center justify-center px-3 py-4 sm:px-4 md:px-8 lg:px-10">
                        <Card className="w-full max-w-md rounded-3xl border-slate-200/80 shadow-none md:shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <button type="button" className="mb-4 text-slate-600 transition-colors hover:text-blue-600" onClick={() => navigate('/')}>
                                <ArrowLeftOutlined />
                            </button>

                            <div className="mb-4">
                                <div className="text-2xl font-bold text-slate-800 sm:text-3xl">创建账号</div>
                                <div className="mt-1.5 text-sm text-slate-500 sm:mt-2 sm:text-base">请完成手机号验证后注册</div>
                            </div>

                            <Form<RegisterFormValues> layout="vertical" requiredMark={false} onFinish={handleRegister} className="space-y-0">
                                <Form.Item
                                    name="phone"
                                    className="mb-3 sm:mb-4"
                                    validateTrigger="onBlur"
                                    rules={[
                                        { required: true, message: '请输入手机号' },
                                        { len: 11, message: '手机号必须为 11 位数字' },
                                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        maxLength={11}
                                        inputMode="numeric"
                                        placeholder="请输入手机号"
                                        prefix={<PhoneOutlined className="text-slate-400" />}
                                        onChange={(event) => {
                                            event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11)
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    className="mb-3 sm:mb-4"
                                    validateTrigger="onBlur"
                                    rules={[
                                        { required: true, message: '请输入密码' },
                                        { min: 6, message: '密码长度不能少于 6 位' },
                                        { max: 20, message: '密码长度不能超过 20 位' },
                                        {
                                            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*._-]{6,20}$/, 
                                            message: '密码需包含字母和数字，长度 6-20 位',
                                        },
                                    ]}
                                >
                                    <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined className="text-slate-400" />} />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    className="mb-4 sm:mb-5"
                                    dependencies={['password']}
                                    validateTrigger="onBlur"
                                    rules={[
                                        { required: true, message: '请确认密码' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const password = getFieldValue('password')
                                                if (!value || password === value) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(new Error('两次输入的密码不一致'))
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password size="large" placeholder="确认密码" prefix={<LockOutlined className="text-slate-400" />} />
                                </Form.Item>

                                <Form.Item className="mb-3 sm:mb-4">
                                    <Button type="primary" htmlType="submit" size="large" block className="h-10 rounded-xl text-sm sm:h-11 sm:text-base">
                                        注册
                                    </Button>
                                </Form.Item>

                                <div className="text-center text-sm text-slate-500">
                                    已有账号？
                                    <button type="button" className="ml-1 text-blue-600 hover:text-blue-500" onClick={() => navigate('/login')}>
                                        去登录
                                    </button>
                                </div>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
