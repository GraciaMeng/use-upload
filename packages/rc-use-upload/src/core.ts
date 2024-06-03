import type { ServiceRequestConfig, UploadStorageInfo } from './type'
import { UploadStatus } from './type'
import { getStorage, setStorage } from './utils'

export const getStorageOffset = (storageKey: string) => {
  const storageInfo = getStorage<UploadStorageInfo>(storageKey)
  const currentTime = new Date().getTime()
  return storageInfo.offset && currentTime <= +storageInfo.endTime! ? +storageInfo.offset : 0
}

// 缓存上传信息至localStorage
export const cacheUploadInfo = (
  storageKey: string,
  offset: number,
  chunkSize: number,
  cacheTime: number,
) => {
  const storageInfo = getStorage<UploadStorageInfo>(storageKey)
  let endTime = Number(storageInfo.endTime)
  const currentTime = new Date().getTime()
  if (!Object.keys(storageInfo).length || currentTime <= endTime) {
    endTime = currentTime + cacheTime
  }
  const info: UploadStorageInfo = {
    offset: offset + chunkSize,
    endTime,
  }
  setStorage(storageKey, info)
}

// 创建请求
export const setupUploadRequest = (options: ServiceRequestConfig, abortSignal: AbortSignal) => {
  return fetch(options.url, {
    method: options.method,
    body: options.body,
    headers: {
      ...options.headers,
    },
    signal: abortSignal,
  }).then((res) => {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  })
}

interface mapUploadChunkItem {
  offset: number
  chunk: Blob
}
// 创建文件切片
export const mapFileChunks = <T>(
  file: File,
  chunkSize: number,
  generator: (item: mapUploadChunkItem, index: number) => T,
): T[] => {
  const fileChunks: T[] = []
  let index = 0
  let currentSize = 0
  while (currentSize < file.size!) {
    // 如果最后一个超过限制
    const isMoreThanSize = currentSize + chunkSize > file.size!
    const item = generator(
      { offset: currentSize, chunk: file.slice(currentSize, isMoreThanSize ? file.size : currentSize + chunkSize) },
      index,
    )
    fileChunks.push(item)
    index++
    currentSize += chunkSize
  }
  return fileChunks
}

// 转换中断后的进度状态
export const processAbortStatus = (status: UploadStatus) => {
  return status === UploadStatus.LOADING ? UploadStatus.FAIL : status
}
