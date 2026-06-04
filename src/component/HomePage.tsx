import { Avatar, Badge, Modal } from 'antd'
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { getToken, getUserProfile } from '../utils/request'
import { getConsultationGuardState } from '../utils/consultationGuard'

const HomePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeAction, setActiveAction] = useState<'login' | 'signup' | null>(null)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const loadAvatar = async () => {
      if (!getToken()) {
        setAvatarUrl('')
        return
      }

      try {
        const res = await getUserProfile()
        setAvatarUrl(res.data?.data?.avatarUrl || '')
      } catch (error) {
        console.error('获取导航栏头像失败:', error)
      }
    }

    const handleProfileChange = () => {
      void loadAvatar()
    }

    void loadAvatar()
    window.addEventListener('profile:updated', handleProfileChange)
    return () => window.removeEventListener('profile:updated', handleProfileChange)
  }, [])

  const isLoggedIn = Boolean(localStorage.getItem('token'))
  const cartCount = useCartStore((state) => state.cartCount)

  const menuItems = [
    { key: 'home', label: '首页', path: '/' },
    { key: 'ai', label: 'AI问诊', path: '/health-ai' },
    { key: 'symptoms', label: '症状自查', path: '/symptom-self-check' },
    { key: 'health', label: '健康科普', path: '/health-tips' },
    { key: 'profile', label: '个人档案', path: '/profile' },
    { key: 'shop', label: '在线商城', path: '/shop' },
  ]

  const activeTab = useMemo(() => {
    const current = menuItems.find((item) => item.path === location.pathname)
    return current?.key ?? 'home'
  }, [location.pathname])

  const actionButtonClass = (active: boolean, variant: 'login' | 'signup') =>
    `cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-5 sm:py-2.5 ${
      active
        ? variant === 'login'
          ? 'border border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
          : 'bg-blue-700 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-300'
        : variant === 'login'
          ? 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50'
          : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
    }`

  const guardedNavigate = (path: string) => {
    if (location.pathname === '/health-ai' && path !== '/health-ai') {
      const guard = getConsultationGuardState()
      if (guard?.hasConversation()) {
        Modal.confirm({
          title: '是否保存本次 AI 问诊？',
          content: '检测到你已经和 AI 发生了对话，是否将本次对话摘要添加到个人档案中？',
          okText: '保存并离开',
          cancelText: '不保存离开',
          centered: true,
          onOk: async () => {
            await guard.saveCurrentConsultation()
            navigate(path)
          },
          onCancel: () => navigate(path),
        })
        return
      }
    }
    navigate(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex w-full flex-col gap-3 px-4 py-3 lg:min-h-18 lg:flex-row lg:items-center lg:justify-between lg:px-12 xl:px-32">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
          <button
            className="cursor-pointer self-start text-2xl font-semibold text-[#4A90FF] transition hover:text-[#3478e0]"
            onClick={() => guardedNavigate('/')}
          >
            ZhiKangAI
          </button>

          <nav aria-label="主导航" className="w-full overflow-x-auto lg:w-auto lg:overflow-visible">
            <ul className="flex min-w-max items-center gap-2 text-sm font-medium lg:flex-wrap lg:gap-3">
              {menuItems.map((item) => {
                const active = activeTab === item.key
                return (
                  <li key={item.key}>
                    <button
                      className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-2 transition-all sm:px-4 ${
                        active
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                      onClick={() => guardedNavigate(item.path)}
                    >
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4 self-start text-sm font-medium lg:self-auto">
          {isLoggedIn ? (
            <>
              <Badge
                count={cartCount}
                size="small"
                overflowCount={99}
                offset={[-6, 6]}
                showZero={false}
                className="[&_.ant-badge-count]:bg-red-500 [&_.ant-badge-count]:text-[10px] [&_.ant-badge-count]:min-w-[16px] [&_.ant-badge-count]:h-4 [&_.ant-badge-count]:leading-4 [&_.ant-badge-count]:px-1 [&_.ant-badge-count]:rounded-full [&_.ant-badge-count]:shadow-md"
              >
                <button
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-br from-white to-slate-50 text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-[0_14px_40px_rgba(74,144,255,0.18)] active:translate-y-0"
                  onClick={() => guardedNavigate('/cart')}
                  aria-label="购物车"
                >
                  <ShoppingCartOutlined className="text-lg transition-transform duration-200 group-hover:scale-110" />
                </button>
              </Badge>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                onClick={() => guardedNavigate('/profile')}
                aria-label="个人中心"
              >
                <Avatar size={30} src={avatarUrl || null} icon={<UserOutlined />} />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('userInfo')
                  window.history.replaceState(null, '', '/login')
                  window.location.replace('/login')
                }}
                aria-label="退出登录"
              >
                <LogoutOutlined />
              </button>
            </>
          ) : (
            <>
              <button
                className={actionButtonClass(activeAction === 'login', 'login')}
                onClick={() => {
                  setActiveAction('login')
                  navigate('/login')
                }}
              >
                Login
              </button>
              <button
                className={actionButtonClass(activeAction === 'signup', 'signup')}
                onClick={() => {
                  setActiveAction('signup')
                  navigate('/register')
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default HomePage