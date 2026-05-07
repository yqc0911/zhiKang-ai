import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import HealthAIPage from '../pages/HealthAIPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
    },
    {
        path: '/health-ai',
        element: <HealthAIPage />,
    },
])

export default router
