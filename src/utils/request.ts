import CryptoJS from 'crypto-js'
import request from './servers'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  name: string
  phone: string
  password: string
}

const md5 = (value: string) => CryptoJS.MD5(value).toString()

export const login = (data: LoginParams) => {
  return request.post('/api/login', {
    username: data.username,
    password: md5(data.password),
  })
}

export const register = (data: RegisterParams) => {
  return request.request({
    method: 'post',
    url: '/api/register',
    data: {
      name: data.name,
      phone: data.phone,
      password: md5(data.password),
    },
    validateStatus: (status) => status < 500,
  })
}

export const getToken = () => localStorage.getItem('token')

export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const clearToken = () => {
  localStorage.removeItem('token')
}

export const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number }
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch {
    return false
  }
}

export interface HealthReminder {
  content: string
  icon: string
}

export interface WeatherInfo {
  temp: string
  text: string
  humidity: string
  windDir: string
  windSpeed: string
  precip: string
}

export interface HealthRemindersResponse {
  code: number
  message: string
  data: {
    weather: WeatherInfo
    reminders: HealthReminder[]
    location?: string
    clientIp?: string
  }
}

export const getHealthReminders = (location?: string) => {
  return request.get<HealthRemindersResponse>('/api/health-reminders', { params: { location } })
}

export interface FeatureCard {
  key: string
  title: string
  description: string
  image: string
  icon: string
  tags: string[]
  path: string
  accent: string
}

export interface FeaturesResponse {
  code: number
  message: string
  data: FeatureCard[]
}

export const getFeatures = () => {
  return request.get<FeaturesResponse>('/api/features')
}

export interface ProductItem {
  id: number
  name: string
  category: string
  description: string
  originalPrice: string
  discountedPrice: string
  finalPrice: string
  discountLabel: string
  isHotPromotion: boolean
  image: string
  tags: string[]
  score: string
}

export interface ProductsResponse {
  code: number
  message: string
  data: ProductItem[]
}

export interface ProductResponse {
  code: number
  message: string
  data: ProductItem | null
}

export interface CategoriesResponse {
  code: number
  message: string
  data: string[]
}

export const getProducts = (category?: string) => {
  return request.get<ProductsResponse>('/api/shop/products', {
    params: { category },
  })
}

export const getShopCategories = () => {
  return request.get<CategoriesResponse>('/api/shop/categories')
}

export const getProductById = (id: number) => {
  return request.get<ProductResponse>(`/api/shop/products/${id}`)
}

export default request
