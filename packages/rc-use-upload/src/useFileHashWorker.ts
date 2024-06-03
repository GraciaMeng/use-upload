import { useEffect, useRef, useState } from 'react'
import type { AwaitFunctionResult } from './type'
import useLatest from './useLatest'

interface FileHashReaderResult {
  hash: string
  file: File
}

export function useFileHashWorker(
  createWorker: () => Worker,
  options?: Omit<AwaitFunctionResult<FileHashReaderResult>, 'onFinally'>,
) {
  const onSuccess = useLatest(options?.onSuccess)
  const onError = useLatest(options?.onError)
  const [hash, setHash] = useState('')
  const worker = useRef<Worker | null>(null)

  // 获取文件hash
  const generate = async (file: File) => {
    worker.current = createWorker()
    worker.current!.postMessage(file)
    worker.current!.addEventListener('message', (res) => {
      setHash(res.data as string)
      onSuccess.current?.({
        hash: res.data as string,
        file,
      })
    })
    worker.current!.onerror = (err) => {
      onError.current?.(err)
      throw err
    }
  }

  useEffect(() => {
    return () => {
      worker.current?.terminate()
    }
  }, [worker])

  return [generate, { hash }] as const
}
