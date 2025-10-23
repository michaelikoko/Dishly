'use server'

import { cookies } from 'next/headers'

/* ENCRYPT AND DECRYPT THE ACCESS AND REFRESH TOKENS*/

export async function createSession({ accessToken, refreshToken }) {
  const cookieStore = await cookies()
  const authTokens = JSON.stringify({ accessToken, refreshToken })
  cookieStore.set('auth_tokens', authTokens, {
    httpOnly: true,
    secure: true,
    //expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_tokens')
}

export async function getAccessRefreshToken() {
  // Get the access and refresh tokens from cookies
  const cookieStore = await cookies()
  const authTokensCookie = cookieStore.get('auth_tokens')
  if (!authTokensCookie || authTokensCookie.value.length === 0) {
    return null
  }

  const { accessToken, refreshToken } = JSON.parse(authTokensCookie.value)
  return { accessToken, refreshToken }
}
