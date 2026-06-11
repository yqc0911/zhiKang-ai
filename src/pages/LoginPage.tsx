import { Button, Card, Checkbox, Input, message, Segmented, Spin, QRCode } from 'antd'
import { ArrowLeftOutlined, CheckCircleFilled, LockOutlined, QrcodeOutlined, ScanOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { login, setToken } from '../utils/request'

type LoginMode = 'password' | 'wechat'
type WechatStatus = 'waiting' | 'scanned' | 'success'

const LoginPage = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [mode, setMode] = useState<LoginMode>('password')
    const [wechatStatus, setWechatStatus] = useState<WechatStatus>('waiting')
    const [wechatConfirmLoading, setWechatConfirmLoading] = useState(false)

    const wechatQrValue = useMemo(() => {
        const scene = `healthai-login-${Date.now()}`
        return `https://open.weixin.qq.com/connect/qrconnect?appid=demo-appid&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/wechat/callback')}&response_type=code&scope=snsapi_login&state=${scene}#wechat_redirect`
    }, [])

    const resetWechatFlow = () => {
        setWechatStatus('waiting')
        setWechatConfirmLoading(false)
    }

    const handleLogin = async () => {
        try {
            const res = await login({ username, password })
            const token = res?.data?.token || res?.data?.data?.token

            if (token) {
                setToken(token)
                message.success('登录成功')
                navigate('/')
                return
            }

            message.error('用户名或密码错误')
        } catch (error) {
            console.warn('后端服务不可用，使用 mock 登录')

            if (username === 'admin' && password === '123456') {
                setToken('mock-token-123456')
                message.success('登录成功')
                navigate('/')
                return
            }

            message.error('用户名或密码错误')
            console.error('login error:', error)
        }
    }

    return (
        <div className="flex h-[100svh] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50">
            <div className="mx-auto flex h-full w-full max-w-6xl items-stretch px-3 py-3 sm:px-4 sm:py-4 md:py-6">
                <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
                    <div className="hidden min-h-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-6 text-white md:flex md:flex-col md:justify-between lg:p-8">
                        <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-sm lg:tracking-[0.35em]">HealthAI</div>
                            <h2 className="mt-4 text-3xl font-bold leading-tight lg:mt-6 lg:text-4xl">欢迎回到智能健康服务平台</h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/85 lg:mt-5 lg:text-base lg:leading-8">
                                登录后可继续你的问诊记录、症状自查结果与健康档案，获得更连续的健康服务体验。
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur lg:p-5">
                            <div className="text-sm text-white/75">平台能力</div>
                            <div className="mt-2 space-y-2 text-sm text-white/90 lg:mt-3 lg:text-base">
                                <div>AI 在线问诊</div>
                                <div>症状自查分析</div>
                                <div>健康科普资讯</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 items-center justify-center px-3 py-4 sm:px-4 md:px-8 lg:px-10">
                        <Card className="w-full max-w-md rounded-3xl border-slate-200/80 shadow-none md:my-4 md:shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <button className="mb-4 text-slate-600 transition-colors hover:text-blue-600" onClick={() => navigate('/')}>
                                <ArrowLeftOutlined />
                            </button>

                            <div className="mb-3">
                                <div className="text-2xl font-bold text-slate-800 sm:text-3xl">欢迎登录</div>
                                <div className="mt-1.5 text-sm text-slate-500 sm:mt-2 sm:text-base">登录后可查看问诊记录与健康档案</div>
                            </div>

                            <Segmented
                                block
                                size="middle"
                                value={mode}
                                onChange={(value) => {
                                    const nextMode = value as LoginMode
                                    setMode(nextMode)
                                    if (nextMode === 'wechat') {
                                        resetWechatFlow()
                                    }
                                }}
                                options={[
                                    { label: '账号密码', value: 'password', icon: <UserOutlined /> },
                                    { label: '微信扫码', value: 'wechat', icon: <QrcodeOutlined /> },
                                ]}
                                className="mb-3 w-full"
                            />

                            {mode === 'password' ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-2.5 pb-1 sm:space-y-3">
                                    <Input
                                        size="large"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="请输入手机号或用户名"
                                        prefix={<UserOutlined className="text-slate-400" />}
                                        autoComplete="username"
                                    />
                                    <Input.Password
                                        size="large"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="请输入密码"
                                        prefix={<LockOutlined className="text-slate-400" />}
                                        autoComplete="current-password"
                                    />

                                    <div className="flex items-center justify-between text-sm text-slate-500">
                                        <Checkbox>记住我</Checkbox>
                                        <button type="button" className="text-blue-600 hover:text-blue-500">忘记密码？</button>
                                    </div>

                                    <Button type="primary" size="large" block className="h-10 rounded-xl text-sm sm:h-11 sm:text-base" htmlType="submit">
                                        登录
                                    </Button>

                                    <div className="text-center text-sm text-slate-500">
                                        还没有账号？
                                        <button type="button" className="ml-1 text-blue-600 hover:text-blue-500" onClick={() => navigate('/register')}>
                                            去注册
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3.5 sm:space-y-4">
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                                        <div className="flex items-center justify-between text-xs text-slate-500 sm:text-sm">
                                            <span className="flex items-center gap-2">
                                                <ScanOutlined />
                                                打开微信扫一扫登录
                                            </span>
                                            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-slate-500 shadow-sm sm:px-3 sm:text-xs">模拟登录</span>
                                        </div>

                                        <div className="mt-3 flex justify-center sm:mt-4">
                                            <div className="relative rounded-2xl bg-white p-2.5 shadow-sm sm:p-3">
                                                <QRCode value={wechatQrValue} size={132} />
                                                {wechatStatus !== 'waiting' && (
                                                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/85 backdrop-blur-sm">
                                                        {wechatStatus === 'scanned' ? (
                                                            <div className="text-center text-slate-700">
                                                                <CheckCircleFilled className="text-2xl text-emerald-500 sm:text-3xl" />
                                                                <div className="mt-1.5 text-xs font-medium sm:mt-2 sm:text-sm">已扫描，点击确认按钮完成登录</div>
                                                            </div>
                                                        ) : (
                                                            <Spin size="large" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 text-center text-xs text-slate-500 sm:text-sm">
                                            {wechatStatus === 'waiting' && '请使用微信扫描二维码完成登录'}
                                            {wechatStatus === 'scanned' && '请点击下方按钮模拟微信确认'}
                                            {wechatStatus === 'success' && '登录成功，正在跳转…'}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-700 sm:px-4 sm:py-2.5 sm:text-sm">
                                        当前为模拟微信扫码登录：扫描二维码后，需要手动点击确认按钮，才会写入 token 并跳转。
                                    </div>

                                    {wechatStatus === 'scanned' ? (
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            className="h-10 rounded-xl text-sm sm:h-11 sm:text-base"
                                            loading={wechatConfirmLoading}
                                            onClick={() => {
                                                setWechatConfirmLoading(true)
                                                window.setTimeout(() => {
                                                    setToken('mock-wechat-token-123456')
                                                    message.success('微信扫码登录成功')
                                                    setWechatStatus('success')
                                                    navigate('/')
                                                }, 800)
                                            }}
                                        >
                                            确认微信登录
                                        </Button>
                                    ) : (
                                        <Button type="primary" size="large" block className="h-10 rounded-xl text-sm sm:h-11 sm:text-base" onClick={() => resetWechatFlow()}>
                                            重新生成二维码
                                        </Button>
                                    )}

                                    <Button type="default" size="large" block className="h-10 rounded-xl text-sm sm:h-11 sm:text-base" onClick={() => setMode('password')}>
                                        使用账号密码登录
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
