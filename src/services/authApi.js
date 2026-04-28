// services/authApi.js
import api from './api'

export const loginUser = (data) =>
  api.post('/api/users/login', data)

export const registerUser = (data) =>
  api.post('/users', data);