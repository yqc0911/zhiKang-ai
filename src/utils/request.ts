import request from './servers'

export interface LoginParams {
  username: string
  password: string
}

export const login = (data: LoginParams) => {
  return request.post('/api/login', data)
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

export default request
