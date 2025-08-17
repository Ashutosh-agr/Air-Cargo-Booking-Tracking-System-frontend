import axios from "axios"
import {logger} from "@/lib/logger"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api",
  timeout: 15000,
  headers: {"Content-Type": "application/json"},
})

api.interceptors.request.use((config) => {
  logger.debug("api:request", {
    url: config.url,
    method: config.method,
    params: config.params,
  })
  return config
})

api.interceptors.response.use(
  (response) => {
    logger.debug("api:response", {
      url: response.config.url,
      status: response.status,
    })
    return response
  },
  (error) => {
    const status = error?.response?.status
    logger.error("api:error", {status, message: error?.message})
    return Promise.reject(error)
  }
)

export default api
