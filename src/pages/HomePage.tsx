// 首页设计
const HomePage = () => {
  return (
    <>
      {/* 导航栏 */}
      <div className="headerBox w-5/6  h-[45px] flex mx-auto justify-between bg-white">
        {/* 菜单 */}
        <div className="menuBox flex justify-center items-center ">
          <div className="logoBox">
            <p className="ml-3 text-blue-700 font-medium cursor-pointer cursor-pointer text-2xl">HealthAI</p>
          </div>
          <ul className="list-none p-0 m-0 space-y-2 flex font-medium">
            <li className="ml-6 mb-0 cursor-pointer hover:text-[#2563EB] transition-colors duration-300">首页</li>
            <li className="ml-6 mb-0 cursor-pointer hover:text-[#2563EB] transition-colors duration-300">AI问诊</li>
            <li className="ml-6 mb-0 cursor-pointer hover:text-[#2563EB] transition-colors duration-300">症状自查</li>
            <li className="ml-6 mb-0 cursor-pointer hover:text-[#2563EB] transition-colors duration-300">健康科普</li>
          </ul>
        </div>
        {/* 登录按钮 */}

        <ul className="list-none p-0 m-0 space-y-2 flex justify-center items-center">
          <li className="ml-6 mb-0 cursor-pointer bg-gray-300 px-6 py-2 rounded-3xl">Login</li>
          <li className="ml-6 mb-0 mr-5 cursor-pointer">Sign up</li>
        </ul>

      </div>
    </>
  )
}

export default HomePage