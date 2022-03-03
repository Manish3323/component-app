import { AdminService } from '@tmtsoftware/esw-ts'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export interface AdminServiceProps {
  children: React.ReactNode
}

const AdminServiceContext = createContext<AdminService | undefined>(undefined)

const AdminServiceProvider = (props: AdminServiceProps) => {
  const { children } = props
  const [adminService, setAdminService] = useState<AdminService>()
  const { auth } = useAuth()

  useEffect(() => {
    AdminService({ tokenFactory: () => auth?.token() }).then((a) =>
      setAdminService(a)
    )
  }, [auth])

  return (
    <AdminServiceContext.Provider value={adminService}>
      {children}
    </AdminServiceContext.Provider>
  )
}

export const useAdminService = () => {
  return useContext(AdminServiceContext)
}

export default AdminServiceProvider
