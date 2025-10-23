import { axiosClient } from '../lib/axiosClient'
import { createSession } from '../lib/session'

export async function signIn({ email, password }) {
  const response = await axiosClient.post('/users/login', { email, password })
  const { accessToken, refreshToken } = response.data.data
  await createSession({ accessToken, refreshToken })
}

export async function signUp({ email, displayName, password, confirmPassword }) {
  // Sign up the user and log them in
  const response = await axiosClient.post('/users/register', {
    email,
    displayName,
    password,
    confirmPassword,
  })
  const { accessToken, refreshToken } = response.data.data
  await createSession({ accessToken, refreshToken })
}

export async function getCurrentUser() {
  try {
    const response = await axiosClient.get('/users/me')
    return response.data.data
  } catch (error) {
    return null
  }
}
