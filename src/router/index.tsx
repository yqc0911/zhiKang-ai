import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import HealthAIPage from '../pages/HealthAIPage'
import HealthTipsPage from '../pages/HealthTipsPage'
import SymptomSelfCheckPage from '../pages/SymptomSelfCheckPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
    },
    {
        path: '/health-ai',
        element: <HealthAIPage />,
    },
    {
        path: '/symptom-self-check',
        element: <SymptomSelfCheckPage />,
    },
    {
        path: '/health-tips',
        element: <HealthTipsPage />,
    },
])

export default router
