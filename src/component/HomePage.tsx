import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: 'home', label: '首页', path: '/' },
    { key: 'ai', label: 'AI问诊', path: '/health-ai' },
    { key: 'symptoms', label: '症状自查', path: '/symptom-self-check' },
    { key: 'health', label: '健康科普', path: '/health-tips' },
    { key: 'profile', label: '个人档案', path: '/profile' },
  ]

  const activeTab = useMemo(() => {
    const current = menuItems.find((item) => item.path === location.pathname)
    return current?.key ?? 'home'
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-18 w-full items-center justify-between gap-6 px-6 py-2 md:px-32">
        <div className="flex items-center gap-10">
          <button
            className="cursor-pointer text-2xl font-semibold text-[#0d9488] transition hover:text-[#0b8077] "
            onClick={() => navigate('/')}
          >
            ZhiKangAI
          </button>

          <nav aria-label="主导航" className='ml-51'>
            <ul className="flex flex-wrap items-center gap-3 text-sm font-medium">
              {menuItems.map((item) => {
                const active = activeTab === item.key
                return (
                  <li key={item.key}>
                    <button
                      className={`cursor-pointer rounded-full px-4 py-2 transition-all ${
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

        <div className="flex items-center gap-3 text-sm font-medium">
          <button
            className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="rounded-full bg-blue-600 px-5 py-2.5 text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            onClick={() => navigate('/register')}
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  )
}

export default HomePage