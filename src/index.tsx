import { AuthContextProvider, setAppName } from '@tmtsoftware/esw-ts'
import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { AppConfig } from './config/AppConfig'
import './index.css'
import 'antd/dist/antd.css'

setAppName(AppConfig.applicationName)
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE === 'true'
render(
  <React.StrictMode>
    {!AUTH_MODE ? (
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
  document.getElementById('root')
)
