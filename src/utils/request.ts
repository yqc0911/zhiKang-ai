import request from './servers'

export interface LoginParams {
  username: string
  password: string
}

export const login = (data: LoginParams) => {
  return request.post('/api/login', data)
}

export default request
