export const enum UploadStatus {
  WAIT = 'wait',
  LOADING = 'loading',
  SUCCESS = 'success',
  FAIL = 'fail',
  ABORT = 'abort',
}

export type UploadFileStatus = `${UploadStatus}`

export interface UploadChunkInfo {
  index: number
  status: UploadStatus
  chunkName: string
  offset: number
  chunk: Blob
}

export interface UploadStorageInfo {
  endTime?: number
  offset?: number
}

export interface UploadChunkParams {
  blob: Blob
  filename: string
  index: number
  hash: string
}

export interface ServiceRequestConfig {
  url: string | URL
  body?: BodyInit
  headers?: HeadersInit
  method?: string
}

export type GetFetchConfigType = (params: UploadChunkParams) => ServiceRequestConfig

export interface AwaitFunctionResult<R> {
  onSuccess?: (result: R) => void
  onError?: (err) => void
  onFinally?: () => void
}

export interface RelationWorker {
  fileReader: () => Worker
}

export interface UseUploadOptions extends AwaitFunctionResult<void> {
  chunkSize?: number
  queueNum?: number
  cacheTime?: number
  prefix?: string
  useCache?: boolean
  retryNum?: number
  onAbort?: () => void
}
