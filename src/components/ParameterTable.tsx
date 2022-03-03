import type { CurrentState } from '@tmtsoftware/esw-ts'
import { Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import { formatParameters } from './ParamFormatter'

export const HeaderTitle = ({ title }: { title: string }): JSX.Element => (
  <Typography.Title level={5} style={{ marginBottom: 0 }}>
    {title}
  </Typography.Title>
)

type ParameterDataType = {
  parameter: string
  unit: string
  values: JSX.Element
}

const columns: ColumnsType<ParameterDataType> = [
  {
    title: <HeaderTitle title='Parameter' />,
    dataIndex: 'parameter',
    key: 'parameter',
    width: '12rem'
  },
  {
    title: <HeaderTitle title='Values' />,
    dataIndex: 'values',
    key: 'values',
    // eslint-disable-next-line react/display-name
    render: (values: string): JSX.Element => (
      <Typography.Paragraph
        ellipsis={{ expandable: true, rows: 20, tooltip: true }}>
        {values}
      </Typography.Paragraph>
    )
  },
  {
    title: <HeaderTitle title='Unit' />,
    dataIndex: 'unit',
    key: 'unit',
    width: '12rem'
  }
]

const createDataSource = (currentState: CurrentState): ParameterDataType[] => {
  return currentState.paramSet.map((parameter) => ({
    parameter: parameter.keyName,
    unit: parameter.units.name,
    values: formatParameters(parameter, currentState)
  }))
}

export const ParameterTable = ({
  currentState
}: {
  currentState: CurrentState
}): JSX.Element => (
  <div style={{ marginTop: '0.5rem', height: '100%', overflowY: 'scroll' }}>
    <Table
      title={() => `StateName : ${currentState.stateName}`}
      rowKey={(row) => row.parameter}
      pagination={false}
      columns={columns}
      dataSource={createDataSource(currentState)}
      bordered
    />
  </div>
)
