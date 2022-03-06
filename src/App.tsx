import { LoadingOutlined } from '@ant-design/icons'
import { loadGlobalConfig, LocationService } from '@tmtsoftware/esw-ts'
import { Button, Result, Space } from 'antd'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppConfig } from './config/AppConfig'
import AdminServiceContext from './contexts/AdminServiceContext'
import { LocationServiceProvider } from './contexts/LocationServiceContext'
import { useAuth } from './hooks/useAuth'
import { useQuery } from './hooks/useQuery'
import { Routes } from './Routes'

const basename =
  import.meta.env.PROD === 'production' ? `/${AppConfig.applicationName}` : ''

const Logout = () => {
  const { logout, auth } = useAuth()
  return (
    <Space
      style={{
        width: '100%',
        paddingTop: '40px',
        paddingLeft: '40px',
        justifyContent: 'start'
      }}>
      <Button onClick={logout}>
        Logout {auth?.tokenParsed()?.preferred_username}
      </Button>
    </Space>
  )
}

const App = (): JSX.Element => {
  const { data: initialised, error } = useQuery(() =>
    loadGlobalConfig().then(() => true)
  )
  const locationService = LocationService()
  if (error) return <div> Failed to load global config </div>
  if (!initialised) return <Result icon={<LoadingOutlined />} />

  return initialised ? (
    <LocationServiceProvider locationService={locationService}>
      <AdminServiceContext>
        <Router basename={basename}>
          <AuthRoutes />
        </Router>
      </AdminServiceContext>
    </LocationServiceProvider>
  ) : (
    <div>Loading....</div>
  )
}

const AuthRoutes = () => {
  const { auth } = useAuth()
  return (
    <>
      {auth?.isAuthenticated() && <Logout />}
      <Routes loggedIn={auth?.isAuthenticated() ?? false} />
    </>
  )
}

export default App
