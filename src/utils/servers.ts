// 二次封装 axios
import axios, { AxiosHeaders } from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
})

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers = config.headers ?? new AxiosHeaders()
            config.headers.set('Authorization', `Bearer ${token}`)
        }

        return config
    },
    (error) => Promise.reject(error),
)

request.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status

        if (status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            window.dispatchEvent(new Event('auth:expired'))
        }

        return Promise.reject(error)
    },
)

export default request