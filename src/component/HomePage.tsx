import { Avatar } from 'antd'
import { LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeAction, setActiveAction] = useState<'login' | 'signup' | null>(null)
  const isLoggedIn = Boolean(localStorage.getItem('token'))

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex w-full flex-col gap-3 px-4 py-3 lg:min-h-18 lg:flex-row lg:items-center lg:justify-between lg:px-12 xl:px-32">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
          <button
            className="cursor-pointer self-start text-2xl font-semibold text-[#4A90FF] transition hover:text-[#3478e0]"
            onClick={() => navigate('/')}
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
                      onClick={() => navigate(item.path)}
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
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                onClick={() => navigate('/cart')}
                aria-label="购物车"
              >
                <ShoppingCartOutlined className="text-lg" />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                onClick={() => navigate('/profile')}
                aria-label="个人中心"
              >
                <Avatar size={30} icon={<UserOutlined />} />
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