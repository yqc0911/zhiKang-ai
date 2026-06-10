import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <Result
        status="404"
        title={<span className="text-5xl sm:text-6xl">404</span>}
        subTitle={<span className="text-sm text-slate-500 sm:text-base">抱歉，你访问的页面不存在。</span>}
        extra={
          <Button type="primary" size="large" className="h-11 rounded-xl px-6" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
