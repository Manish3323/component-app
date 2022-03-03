import { AuthContextProvider, setAppName } from '@tmtsoftware/esw-ts'
import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { AppConfig } from './config/AppConfig'
import './index.css'
import 'antd/dist/antd.css'

setAppName(AppConfig.applicationName)

render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
