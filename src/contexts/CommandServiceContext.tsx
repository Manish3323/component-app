import {
  CommandService,
  ComponentId,
  ComponentType,
  Prefix
} from '@tmtsoftware/esw-ts'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export interface CommandServiceProps {
  children: React.ReactNode
}

const CommandServiceContext = createContext<CommandService | undefined>(
  undefined
)

const CommandServiceProvider = (props: CommandServiceProps) => {
  const { children } = props
  const { prefix, componentType } = useParams()
  const [commandService, setCommandService] = useState<CommandService>()
  const { auth } = useAuth()
  useEffect(() => {
    if (prefix && componentType) {
      const compId = new ComponentId(
        Prefix.fromString(prefix),
        componentType as ComponentType
      )
      CommandService(compId, { tokenFactory: () => auth?.token() }).then((a) =>
        setCommandService(a)
      )
    }
  }, [auth, componentType, prefix])

  return (
    <CommandServiceContext.Provider value={commandService}>
      {children}
    </CommandServiceContext.Provider>
  )
}

export const useCommandService = () => {
  return useContext(CommandServiceContext)
}

export default CommandServiceProvider
