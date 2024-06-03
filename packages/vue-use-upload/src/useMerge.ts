import type { AwaitFunctionResult, RelationWorker } from './type'
import { useFileHashWorker } from './useFileHashWorker'

export function useMerge<T>(
  service: (hash: string) => Promise<T>,
  relationWorkers: RelationWorker,
  options?: AwaitFunctionResult<T>,
) {
  const mergeWithHash = (hash: string) => {
    service(hash)
      .then(options?.onSuccess)
      .catch(options?.onError)
      .finally(options?.onFinally)
  }

  const [generate] = useFileHashWorker(relationWorkers.fileReader, {
    onSuccess({ hash }) {
      mergeWithHash(hash)
    },
    onError(err) {
      options?.onError?.(err)
      options?.onFinally?.()
      throw err
    },
  })

  const merge = (file: File) => {
    generate(file)
  }

  return [merge, mergeWithHash] as const
}
