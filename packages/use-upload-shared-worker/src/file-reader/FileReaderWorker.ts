import { SharedWorker } from "../SharedWorker";

export class FileReaderWorker extends SharedWorker {
  constructor() {
    super()
    this.innerWorker = this.createWorker(`file-reader.bundle.js`)
  }
}
