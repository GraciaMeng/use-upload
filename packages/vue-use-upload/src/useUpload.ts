import { reactive, ref } from 'vue'
import { useFileHashWorker } from './useFileHashWorker'
import { UploadStatus } from './type'
import type { GetFetchConfigType, RelationWorker, UploadChunkInfo, UseUploadOptions } from './type'
import { removeStorage } from './utils'
import {
  cacheUploadInfo,
  getStorageOffset,
  mapFileChunks,
  processAbortStatus,
  setupUploadRequest,
} from './core'
import AbortControllerRecord from './AbortControllerRecord'

const abortControllerRecord = new AbortControllerRecord()
export function useUpload(
  getFetchConfig: GetFetchConfigType,
  relationWorkers: RelationWorker,
  options?: UseUploadOptions,
) {
  // 分片大小
  const CHUNK_SIZE = options?.chunkSize ?? 1024 * 1024 * 2
  // 线程数量
  const MAX_QUEUE_NUM = options?.queueNum ?? 5
  // 可缓存时间
  const CACHE_TIME = options?.cacheTime ?? 1000 * 60 * 60
  // 缓存前缀
  const STORAGE_PREFIX = `${options?.prefix ?? 'upload'}-`
  // 是否缓存上传进度
  const useCache = options?.useCache ?? true
  // 错误重试次数
  const retryNum = options?.retryNum ?? 3

  const onSuccess = options?.onSuccess
  const onError = options?.onError
  const onFinally = options?.onFinally

  const chunkList = ref<UploadChunkInfo[]>([])

  const onAbort = options?.onAbort
  const isAbort = ref(false)
  // 中断所有请求
  const abortUploadRequest = () => {
    isAbort.value = true
    abortControllerRecord.execute()
    // 刷新为中断状态
    chunkList.value.forEach((item) => {
      item.status = processAbortStatus(item.status)
    })
    onAbort?.()
  }

  // 更新对应索引的chunk的上传状态
  const updateChunkStatus = (position: number, status: UploadStatus) => {
    chunkList.value[position].status = status
  }

  // 创建上传任务
  const createUploadTask = (
    chunkInfo: UploadChunkInfo,
    hash: string,
    filename: string,
    index: number,
  ) => {
    const fetchOptions = getFetchConfig({
      blob: chunkInfo.chunk,
      index: chunkInfo.index,
      filename,
      hash,
    })
    const controller = new AbortController()
    abortControllerRecord.set(controller, chunkInfo.index)
    return setupUploadRequest(fetchOptions, controller.signal).then(() => {
      updateChunkStatus(index, UploadStatus.SUCCESS)
      if (useCache) {
        cacheUploadInfo(`${STORAGE_PREFIX}${hash}`, chunkInfo.offset, CHUNK_SIZE, CACHE_TIME)
      }
      abortControllerRecord.remove(index)
    })
  }

  const finishQueue = (hash: string) => {
    abortControllerRecord.reset()
    removeStorage(`${STORAGE_PREFIX}${hash}`)
  }

  // 重试次数记录
  const retryNumRecord = reactive<Record<number, number>>({})

  // 当线程池满了 || 剩余任务数小于线程池容量时
  const waitTaskPool = async (pool: Promise<any>[], remainingTask: number) => {
    if (pool.length === MAX_QUEUE_NUM || remainingTask < MAX_QUEUE_NUM) {
      // 每当并发池跑完一个任务，就再塞入一个任务
      await Promise.race(pool)
    }
  }

  // 推入上传队列
  const queueUploadJob = async (jobs: UploadChunkInfo[], hash: string, filename: string) => {
    const pool: Promise<any>[] = []
    let finishedNum = 0
    const stack = jobs.map((_, index) => index).reverse()
    // 中断立马停止
    while (finishedNum !== jobs.length && !isAbort.value) {
      const chunkIndex = stack.pop()!
      const chunkItem = jobs[chunkIndex]
      if (chunkItem.status === UploadStatus.SUCCESS) {
        finishedNum += 1
        continue
      }
      updateChunkStatus(chunkIndex, UploadStatus.LOADING)
      const task = createUploadTask(chunkItem, hash, filename, chunkIndex)
        .then(() => {
          finishedNum += 1
          if (finishedNum === jobs.length) {
            finishQueue(hash)
            onSuccess?.()
          }
        })
        .catch(() => {
          const chunkRetryNum = (retryNumRecord[chunkIndex] || 0) + 1
          updateChunkStatus(chunkIndex, UploadStatus.FAIL)
          if (chunkRetryNum >= retryNum) {
            onError?.(new Error('exceeded retry request.'))
            onFinally?.()
            throw new Error('exceeded retry request.')
          }
          // 重试重新入栈
          stack.push(chunkIndex)
          retryNumRecord[chunkIndex] = chunkRetryNum
        })
        .finally(() => {
          const taskIndex = pool.findIndex((t) => t === task)
          pool.splice(taskIndex, 1)
          if (finishedNum === jobs.length) {
            onFinally?.()
          }
        })
      pool.push(task)
      await waitTaskPool(pool, jobs.length - finishedNum)
    }
  }

  const uploadAfterHash = (hash: string, file: File) => {
    const storageOffset = getStorageOffset(`${STORAGE_PREFIX}${hash}`)
    // 创建上传切片
    const jobs = mapFileChunks<UploadChunkInfo>(file, CHUNK_SIZE, (data, index) => {
      return {
        ...data,
        index,
        status: data.offset < storageOffset ? UploadStatus.SUCCESS : UploadStatus.WAIT,
        chunkName: `${hash}-${index}`,
      }
    })
    chunkList.value = jobs
    queueUploadJob(jobs, hash, file.name)
  }

  const [generate] = useFileHashWorker(relationWorkers.fileReader, {
    onSuccess({ hash, file }) {
      uploadAfterHash(hash, file)
    },
    onError(err) {
      onError?.(err)
      onFinally?.()
      throw err
    },
  })

  // 开始上传
  const startUpload = async (file: File) => {
    isAbort.value = false
    generate(file)
  }

  // 清空分片任务
  const clearTask = () => {
    chunkList.value = []
  }

  return {
    chunkList,
    clearTask,
    isAbort,
    start: startUpload,
    abort: abortUploadRequest,
  }
}
