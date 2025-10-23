import axios from 'axios'
import { getAccessRefreshToken } from './session'

//const BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;
let BASE_URL = 'http://localhost:3001/api'
if (process.env.NODE_ENV === 'production') {
  BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`
}

class AxiosInterceptor {
  constructor(instanceConfig = {}) {
    // Initialize Axios instance with provided configuration
    this.axiosInstance = axios.create({
      ...instanceConfig,
    })

    // Add request interceptor

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const tokens = await getAccessRefreshToken()
        if (tokens) {
          const { accessToken } = tokens
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    /*
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
let isRefreshing = false

        console.log('Response error:', error.response.data)
        console.log(error.response.status)
        console.log(originalRequest._retry)
        if (error.response.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return axiosInstance(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            console.log('retrying')
            const tokens = await getAccessRefreshToken()
            const response = await this.axiosInstancea.post(
              '/api/users/refresh/',
              {
                refreshToken: tokens.refreshToken,
              }
            ) // Your refresh token endpoint
            const newAccessToken = response.data.data.accessToken
            const newRefreshToken = response.data.data.refreshToken
            await createSession({ newAccessToken, newRefreshToken })

            this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`

            processQueue(null, newAccessToken)
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError, null)
            // Handle refresh token expiry or other refresh errors (e.g., redirect to login)
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }
        return Promise.reject(error)
      }
    )
*/
    // Bind instance methods for convenience
    this.get = this.axiosInstance.get.bind(this.axiosInstance)
    this.post = this.axiosInstance.post.bind(this.axiosInstance)
    this.put = this.axiosInstance.put.bind(this.axiosInstance)
    this.delete = this.axiosInstance.delete.bind(this.axiosInstance)
  }
}

export const axiosClient = new AxiosInterceptor({
  baseURL: BASE_URL,
})
