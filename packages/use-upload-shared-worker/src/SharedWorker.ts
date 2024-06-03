export class SharedWorker {
  public innerWorker: Worker | null = null

  get worker() {
    return this.innerWorker!;
  }

  public createWorker(workerCode: string) {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob), {
      type: 'module'
    });
  }

  // postMessage<T>(message: T) {
  //   return new Promise((resolve) => {
  //     this.worker!.onmessage = (event) => {
  //       resolve(event.data);
  //     };
  //     this.worker!.postMessage(message);
  //   });
  // }

  // terminate() {
  //   this.worker!.terminate();
  // }
}
