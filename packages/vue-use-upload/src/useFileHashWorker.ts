import { onUnmounted, ref, toRaw } from 'vue'
import type { AwaitFunctionResult } from './type'

interface FileHashReaderResult {
  hash: string
  file: File
}

export function useFileHashWorker(
  createWorker: () => Worker,
  options?: Omit<AwaitFunctionResult<FileHashReaderResult>, 'onFinally'>,
) {
  const hash = ref('')
  let worker: Worker | null = null

  // 获取文件hash
  const generate = async (file: File) => {
    worker = createWorker()
    worker.postMessage(toRaw(file))

    worker.addEventListener('message', (res) => {
      hash.value = res.data
      if (options.onSuccess) {
        options.onSuccess({
          hash: res.data,
          file,
        })
      }
    })

    worker.onerror = (err) => {
      if (options.onError) {
        options.onError(err)
      }
      throw err
    }
  }

  onUnmounted(() => {
    if (worker) {
      worker.terminate()
    }
  })

  return [generate, { hash }] as const
}
