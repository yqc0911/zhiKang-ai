import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 首页设计
const HomePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')

  const menuItems = [
    { key: 'home', label: '首页' },
    { key: 'ai', label: 'AI问诊', path: '/health-ai' },
    { key: 'symptoms', label: '症状自查', path: '/symptom-self-check' },
    { key: 'health', label: '健康科普', path: '/health-tips' },
  ]

  return (
    <>
      {/* 导航栏 */}
      <div className="headerBox h-[45px] flex mx-auto justify-between bg-white mt-[10px]">
        {/* 菜单 */}
        <div className="menuBox flex justify-center items-center ">
          <div className="logoBox">
            <p className="ml-3 text-blue-700 font-medium cursor-pointer cursor-pointer text-2xl">HealthAI</p>
          </div>
          <ul className="list-none p-0 m-0 space-y-2 flex font-medium">
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={`ml-6 mb-0 cursor-pointer transition-colors duration-300 ${
                  activeTab === item.key ? 'text-[#2563EB]' : 'text-black hover:text-[#2563EB]'
                }`}
                onClick={() => {
                  setActiveTab(item.key)
                  if (item.path) {
                    navigate(item.path)
                  }
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        {/* 登录按钮 */}

        <ul className="list-none p-0 m-0 space-y-2 flex justify-center items-center">
          <li className="ml-6 mb-0 cursor-pointer bg-gray-200 px-6 py-2 rounded-3xl">Login</li>
          <li className="ml-6 mb-0 mr-5 cursor-pointer">Sign up</li>
        </ul>

      </div>
    </>
  )
}

export default HomePage