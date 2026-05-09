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
  ]

  const activeTab = useMemo(() => {
    const current = menuItems.find((item) => item.path === location.pathname)
    return current?.key ?? 'home'
  }, [location.pathname])

  return (
    <header className="page-fade-in sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex h-18 w-5/6 items-center justify-between gap-6 py-2">
        <div className="flex items-center gap-10">
          <button
            className="text-2xl font-semibold tracking-[0.12em] text-blue-700 transition-all duration-300 hover:-translate-y-[1px] hover:text-blue-600"
            onClick={() => navigate('/')}
          >
            HealthAI
          </button>

          <nav>
            <ul className="flex items-center gap-3 text-sm font-medium">
              {menuItems.map((item) => {
                const active = activeTab === item.key
                return (
                  <li key={item.key}>
                    <button
                      className={`rounded-full px-4 py-2 transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200'
                          : 'text-slate-700 hover:-translate-y-[1px] hover:bg-slate-100 hover:text-blue-600'
                      }`}
                      onClick={() => {
                        if (item.path) navigate(item.path)
                      }}
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
            className="rounded-full border border-slate-200 bg-white/70 px-5 py-2.5 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-blue-200 hover:text-blue-600"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-[1px] hover:from-blue-500 hover:to-cyan-400"
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