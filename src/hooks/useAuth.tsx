import { AuthContext } from '@tmtsoftware/esw-ts'
import type { AuthContextType } from '@tmtsoftware/esw-ts'
import { useContext } from 'react'

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx)
    throw new Error('useAuth must be inside a AuthContextProvider with a value')
  return ctx
}

export const useUsername = (): string | undefined => {
  const { auth } = useAuth()
  return auth?.tokenParsed()?.preferred_username
}
