import {
  AdminService,
  ComponentId,
  ComponentType,
  Connection,
  CurrentState,
  Level,
  Prefix
} from '@tmtsoftware/esw-ts'
import { Button, PageHeader, Popconfirm, Select, Space, Typography } from 'antd'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdminService } from '../contexts/AdminServiceContext'
import CommandServiceProvider, {
  useCommandService
} from '../contexts/CommandServiceContext'
import { useLocationService } from '../contexts/LocationServiceContext'
import styles from './Main.module.css'
import { ParameterTable } from './ParameterTable'

const levels: Level[] = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']

export const Component = (): JSX.Element => {
  const { prefix } = useParams()

  return (
    <div className={styles.App}>
      <PageHeader
        style={{ padding: 0, width: '100%' }}
        ghost={false}
        onBack={() => window.history.back()}
        title={prefix}
        extra={<AdminButtons />}>
        <CommandServiceProvider>
          <ListCurrentState />
        </CommandServiceProvider>
      </PageHeader>
    </div>
  )
}

export const ComponentList = (): JSX.Element => {
  const locationService = useLocationService()
  const navigate = useNavigate()
  const [componentConnections, setCompConnections] = React.useState<
    Connection[]
  >([])
  React.useEffect(() => {
    locationService.listByConnectionType('akka').then((l) => {
      setCompConnections(
        l
          .filter(
            (compLocation) =>
              compLocation.connection.componentType === 'Assembly' ||
              compLocation.connection.componentType === 'HCD'
          )
          .map((lo) => lo.connection)
          .sort((a, b) => a.prefix.toJSON().localeCompare(b.prefix.toJSON()))
      )
    })
  })

  const onSelect = (connection: string) => {
    const [prefix, componentType] = connection.split('-')
    navigate(`/${componentType}/${prefix}/`)
  }
  return (
    <div className={styles.App}>
      <Typography.Title level={3}> Component Name </Typography.Title>
      <Select
        showSearch
        placeholder='Select a component'
        optionFilterProp='children'
        onChange={onSelect}>
        {componentConnections.map((con) => {
          const prefix = con.prefix.toJSON()
          return (
            <Select.Option
              key={prefix}
              value={`${prefix}-${con.componentType}`}>
              {prefix}
            </Select.Option>
          )
        })}
      </Select>
    </div>
  )
}

const ListCurrentState = () => {
  const [currentState, setState] = React.useState<CurrentState>()

  const commandService = useCommandService()
  const onState = (currentState: CurrentState) => {
    setState(currentState)
  }

  React.useEffect(() => {
    const subscription = commandService?.subscribeCurrentState(new Set([]))(
      onState
    )
    return () => subscription?.cancel()
  }, [commandService])
  return currentState ? (
    <ParameterTable currentState={currentState} />
  ) : (
    <>No state published by this component yet.</>
  )
}

const AdminButtons = () => {
  const { prefix, componentType } = useParams()
  const adminService = useAdminService()

  const restart = async () => {
    const response =
      prefix &&
      (await adminService
        ?.restart(
          new ComponentId(
            Prefix.fromString(prefix),
            componentType as ComponentType
          )
        )
        .catch((e) => {
          window.alert(`failed to restart, reason: ${e.message}`)
        }))
    if (response === 'Done') window.alert('component restarted')
  }

  return (
    <Space>
      <SetLog adminService={adminService} />
      <Button onClick={restart}> Restart </Button>
      <Shutdown adminService={adminService} />
    </Space>
  )
}

const Shutdown = ({ adminService }: { adminService?: AdminService }) => {
  const { prefix, componentType } = useParams()
  const shutdown = async () => {
    const response =
      prefix &&
      (await adminService
        ?.shutdown(
          new ComponentId(
            Prefix.fromString(prefix),
            componentType as ComponentType
          )
        )
        .catch((e) => {
          window.alert(`failed to restart, reason: ${e.message}`)
        }))
    console.log('killing 2', response)
    if (response === 'Done') window.alert('component restarted')
  }
  return (
    <Popconfirm
      id='shutdown'
      placement='topRight'
      overlayStyle={{ width: '20%' }}
      style={{ paddingLeft: 0 }}
      title={
        <Space direction='horizontal'>
          <Typography.Paragraph>
            Are you sure, you want to shutdown?. Once Shutdown, you will not be
            able to start {prefix} from UI.
          </Typography.Paragraph>
        </Space>
      }
      icon={<></>}
      onConfirm={shutdown}
      okText='Confirm'>
      <Button danger>Shutdown</Button>
    </Popconfirm>
  )
}
const SetLog = ({ adminService }: { adminService?: AdminService }) => {
  const { prefix, componentType } = useParams()
  const [level, setLevel] = React.useState<Level | undefined>()
  const [visible, setVisible] = React.useState(false)
  const [currentLevel, setCurrentLevel] = React.useState<Level | undefined>()

  React.useEffect(() => {
    if (prefix && componentType)
      adminService
        ?.getLogMetadata(
          new ComponentId(
            Prefix.fromString(prefix),
            componentType as ComponentType
          )
        )
        .then((metadata) => {
          setCurrentLevel(metadata.componentLevel)
        })
  }, [adminService, componentType, prefix, visible])

  const logLevel = async () => {
    const response =
      prefix &&
      componentType &&
      level &&
      (await adminService
        ?.setLogLevel(
          new ComponentId(
            Prefix.fromString(prefix),
            componentType as ComponentType
          ),
          level
        )
        .catch((e) => {
          window.alert(`failed to set log level, reason: ${e.message}`)
        }))
    if (response === 'Done') {
      setLevel(undefined)
      window.alert('Log Level Updated.')
    }
  }
  return (
    <Popconfirm
      overlayStyle={{ zIndex: 1 }}
      overlayInnerStyle={{ zIndex: 2 }}
      id='setLogLevel'
      placement='bottom'
      style={{ width: '100px', paddingLeft: 0 }}
      title={
        <Space direction='vertical'>
          <Typography.Text>Current: {currentLevel}</Typography.Text>
          <Typography.Text>
            Set:
            <Select
              style={{ paddingLeft: '8px' }}
              placeholder='Select Level'
              onChange={(e) => setLevel(e)}
              defaultValue={'INFO' as Level}>
              {levels.map((l) => (
                <Select.Option key={l} value={l}>
                  {l}
                </Select.Option>
              ))}
            </Select>
          </Typography.Text>
        </Space>
      }
      icon={<></>}
      onCancel={() => setLevel(undefined)}
      onVisibleChange={(_visible) => {
        if (!_visible) {
          setLevel(undefined)
        }
        setVisible(!visible)
      }}
      onConfirm={logLevel}
      okText='Set'>
      <Button>Log Level</Button>
    </Popconfirm>
  )
}
