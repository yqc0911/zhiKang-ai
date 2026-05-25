// 二次封装 axios
import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 10000,
})

export default request