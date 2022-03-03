import type { Step, StepStatusFailure } from '@tmtsoftware/esw-ts'
import { Alert, Descriptions, Empty, Space, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import globalStyles from '../../../../index.module.css'
import { stepConstants } from '../../sequencerConstants'
import { ParameterTable } from './ParameterTable'
import styles from './sequencerDetails.module.css'

const StepItem = (label: string, item: string) => {
  const [isVisible, setVisible] = useState<boolean>(false)
  return (
    <Descriptions.Item
      style={{ paddingBottom: '1px' }}
      label={
        <Typography.Title
          aria-label={`${label}-Key`}
          type='secondary'
          level={5}>
          {label}
        </Typography.Title>
      }>
      <Tooltip title={isVisible ? item : undefined}>
        <Typography.Text
          aria-label={`${label}-Value`}
          ellipsis={{ onEllipsis: setVisible }}
          style={{ width: '20rem' }}>
          {item}
        </Typography.Text>
      </Tooltip>
    </Descriptions.Item>
  )
}

const getStepFailureMessage = (failure: StepStatusFailure) =>
  failure.message
    ? `Step Failure: ${failure.message}`
    : stepConstants.defaultStepFailureErrorMessage

const StepErrorAlert = ({ message }: { message: string }) => (
  <Alert
    message=''
    description={<Typography.Text type='danger'>{message}</Typography.Text>}
    type='error'
    showIcon
  />
)

export const StepInfo = ({ step }: { step: Step }): JSX.Element => (
  <div className={styles.stepInfo}>
    <Space direction='vertical' size='large'>
      {step.status._type === 'Failure' && (
        <StepErrorAlert message={getStepFailureMessage(step.status)} />
      )}
      <Descriptions column={{ xs: 1, md: 1, lg: 2, xl: 2 }}>
        {StepItem('Command', step.command.commandName)}
        {StepItem('Source', step.command.source.toJSON())}
        {StepItem('Command Type', step.command._type.toString())}
        {StepItem('Obs-Id', step.command.maybeObsId ?? 'NA')}
      </Descriptions>
    </Space>
    <ParameterTable currentState={step.command} />
  </div>
)

export const EmptyStepInfo = (): JSX.Element => (
  <div
    className={globalStyles.centeredFlexElement + ' ' + styles.emptyStepInfo}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
)
