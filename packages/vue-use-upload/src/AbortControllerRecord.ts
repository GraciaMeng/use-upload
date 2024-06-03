class AbortControllerRecord {
  private record: Record<number, AbortController | null>

  constructor() {
    this.record = {}
  }

  execute() {
    Object.values(this.record)
      .filter(Boolean)
      .forEach((controller) => {
        controller!.abort()
      })
  }

  set(controller: AbortController, id: number) {
    this.record[id] = controller
  }

  remove(id: number) {
    this.record[id] = null
  }

  reset() {
    this.record = {}
  }
}

export default AbortControllerRecord
