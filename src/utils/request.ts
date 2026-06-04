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

export interface ConsultationSummary {
  id: string
  title: string
  summary: string
  messageCount: number
  archivedAt: string
}

export interface UserProfile {
  userId?: number
  username?: string
  name: string
  gender: string
  birthday: string
  height: string
  weight: string
  avatarUrl: string
  consultationSummaries?: ConsultationSummary[]
}

export interface ProfileResponse {
  code: number
  message: string
  data: UserProfile
}

export const getUserProfile = () => {
  return request.get<ProfileResponse>('/api/profile')
}

export const updateUserProfile = (data: UserProfile) => {
  return request.put<ProfileResponse>('/api/profile', data)
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  image?: string
  bodyPart?: string
  timestamp: number
}

export interface ChatThread {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

export interface ChatHistoryResponse {
  code: number
  message: string
  data: ChatThread[]
}

export const getChatHistory = () => {
  return request.get<ChatHistoryResponse>('/api/chat/history')
}

export interface ConsultationArchiveResponse {
  code: number
  message: string
  data: ConsultationSummary[]
}

export const getConsultationSummaries = () => {
  return request.get<ConsultationArchiveResponse>('/api/profile/consultations')
}

export const saveCurrentConsultationToProfile = (payload: ConsultationSummary) => {
  return request.post('/api/profile/consultations', payload)
}

export const deleteConsultationSummary = (id: string) => {
  return request.delete(`/api/profile/consultations/${id}`)
}

export interface LoginStatsResponse {
  code: number
  message: string
  data: {
    activeDays: number
  }
}

export const getLoginStats = () => {
  return request.get<LoginStatsResponse>('/api/login-stats')
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
