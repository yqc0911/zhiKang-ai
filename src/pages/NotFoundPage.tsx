import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，你访问的页面不存在。"
        extra={
          <Button type="primary" size="large" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
