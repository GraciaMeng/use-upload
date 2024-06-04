import type { UploadFile, UploadProps } from 'antd'
import { Button, Upload, message } from 'antd'
import { useMerge, useUpload } from 'rc-use-upload'
import { FileReaderWorker } from 'use-upload-shared-worker'
import UploadList from './List'
import { mergeFile } from '@/api/upload'
import { BASE_URL } from '@/api/request'
import { useCallback, useState } from 'react'

const UploadComponent = () => {
  const [uploading, setUploading] = useState(false)

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { start: startUpload, abort: abortUploadRequest, chunkList, clearTask } = useUpload(
    (data) => {
      const formData = new FormData()
      formData.append('file', data.blob)
      formData.append('index', `${data.index}`)
      formData.append('filename', data.filename)
      formData.append('hash', data.hash)
      return {
        method: 'post',
        url: `${BASE_URL}/upload`,
        body: formData,
      }
    },
    {
      fileReader: () => new FileReaderWorker().worker,
    },
    {
      onSuccess() {
        message.success('upload success')
      },
      onAbort() {
        message.info('abort uploading')
      },
      onFinally() {
        setUploading(false)
      },
    })

  const handleUpload = useCallback(
    () => {
      setUploading(true)
      startUpload(fileList[0] as unknown as File)
    },
    [fileList, startUpload],
  )

  const [mergeLoading, setMergeLoading] = useState(false)
  const [mergeUploadJob] = useMerge(hash => mergeFile({ hash, filename: fileList[0].name }), {
    fileReader: () => new FileReaderWorker().worker,
  }, {
    onSuccess() {
      message.success('merge success')
    },
    onFinally() {
      setMergeLoading(false)
    },
  })
  function handleMerge() {
    setMergeLoading(true)
    mergeUploadJob(fileList[0] as unknown as File)
  }

  function handleAbort() {
    abortUploadRequest()
    setMergeLoading(false)
  }

  function handleRestart() {
    startUpload(fileList[0] as unknown as File)
  }

  function clearChunk() {
    clearTask()
  }

  function clearAllCache() {
    localStorage.clear()
  }

  const props: UploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([file])
      return false
    },
    fileList,
    maxCount: 1,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
      <Upload.Dragger {...props}>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </Upload.Dragger>
      <div>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{
            marginTop: 16,
          }}
        >
          {uploading ? 'uploading' : 'start uploading'}
        </Button>
        <Button
          type="primary"
          onClick={handleMerge}
          loading={mergeLoading}
          disabled={fileList.length === 0}
          style={{
            marginTop: 16,
            marginLeft: 16,
          }}
        >
          merge chunks
        </Button>
      </div>
      <div>
        <Button
          type="primary"
          onClick={handleAbort}
          style={{
            marginTop: 16,
          }}
        >
          abort request
        </Button>
        <Button
          type="primary"
          onClick={handleRestart}
          style={{
            marginTop: 16,
            marginLeft: 16,
          }}
        >
          restart request
        </Button>
        <Button
          type="primary"
          onClick={clearChunk}
          style={{
            marginTop: 16,
            marginLeft: 16,
          }}
        >
          clear upload task
        </Button>
        <Button
          type="primary"
          onClick={clearAllCache}
          style={{
            marginTop: 16,
            marginLeft: 16,
          }}
        >
          clear cache
        </Button>
      </div>
      <UploadList list={chunkList} />
    </div>
  )
}

export default UploadComponent
