import SparkMD5 from 'spark-md5'

const generateFileMd5 = (file) => {
  if (!file) throw new Error('file is null')
  const spark = new SparkMD5.ArrayBuffer()
  const reader = new FileReader()
  reader.onload = function (e) {
    const result = e.target?.result
    spark.append(result)
    const hash = spark.end()
    self.postMessage(hash)
  }
  reader.onerror = function (err) {
    throw err
  }

  reader.readAsArrayBuffer(file)
}

self.onmessage = (event) => {
  // 接收到发送过来的files
  generateFileMd5(event.data)
}
