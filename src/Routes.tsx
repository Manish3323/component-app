import { LoadingOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import React, { useEffect } from 'react'
import { Route, Routes as RouterRoutes } from 'react-router-dom'
import { Component, ComponentList } from './components/Main'
import { useAuth } from './hooks/useAuth'
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE === 'true'

const RedirectToLogin = () => {
  const { login } = useAuth()

  useEffect(login, [login])

  return <Result icon={<LoadingOutlined />} />
}

export const Routes = ({ loggedIn }: { loggedIn: boolean }): JSX.Element => {
  console.log(!AUTH_MODE, loggedIn)
  return !AUTH_MODE || loggedIn ? (
    <RouterRoutes>
      <Route path={'/'} element={<ComponentList />} />
      <Route path={'/:componentType/:prefix/'} element={<Component />} />
    </RouterRoutes>
  ) : (
    <RedirectToLogin />
  )
}
