import React, { memo } from 'react'
import type { ProgressProps } from 'antd'
import { List, Progress } from 'antd'
import type { UploadChunkInfo, UploadFileStatus } from 'rc-use-upload'

interface StatusProps {
  status: UploadFileStatus
}
const UploadStatusProgress: React.FC<StatusProps> = memo((props: StatusProps) => {
  const isWait = props.status === 'wait'
  let progressStatus: ProgressProps['status']
  if (isWait || props.status === 'loading')
    progressStatus = 'normal'

  else if (props.status === 'success')
    progressStatus = 'success'

  else
    progressStatus = 'exception'

  return (
    <Progress percent={isWait ? 0 : 100} status={progressStatus} />
  )
})

const UploadItem: React.FC<UploadChunkInfo> = memo(
  (props: UploadChunkInfo) => {
    const { index, status, chunkName } = props

    return (
      <List.Item key={index}>
        <List.Item.Meta
          title={chunkName}
          description={<UploadStatusProgress status={status} />}
        />
        {chunkName}
      </List.Item>
    )
  },
)

interface Props {
  list: UploadChunkInfo[]
}
const UploadList: React.FC<Props> = (props: Props) => {
  return (
    <div style={{ width: '100%'}}>
      <List itemLayout="horizontal" dataSource={props.list} renderItem={item => <UploadItem {...item} />} />
    </div>
  )
}

export default memo(UploadList)
