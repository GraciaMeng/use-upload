import * as fs from 'node:fs';
import path from 'node:path';

const resolvePath = (...args: string[]) => path.resolve(__dirname, ...args);
const processSymbolToEscape = (code: string) => {
  const symbolToEscapeReg = /`/g;
  const escapedCode = code.replace(symbolToEscapeReg, '\\`');
  return escapedCode
}

const removeOriginWorkerJs = (filename: string) => {
  const workerPrefix = filename.split('.')[0]
  fs.rmSync(resolvePath(`../dist/${workerPrefix}/${workerPrefix}.worker.d.ts`))
  fs.rmSync(resolvePath(`../dist/${workerPrefix}.bundle.js`))
}

const injectWorkerToModule = () => {
  const reg = /createWorker\("(.*?)"\)/g
  const mainBundlePath = resolvePath('../dist/main.bundle.js')
  let mainCode = fs.readFileSync(mainBundlePath, 'utf-8')
  const matchList = [...mainCode.matchAll(reg)]
  matchList.map(async (match) => {
    if (!match[1]) return
    const filename = match[1]
    const workerJsPath = resolvePath('../dist/', filename)
    const code = fs.readFileSync(workerJsPath, 'utf-8')
    mainCode = mainCode.replace(match[0], `createWorker(\`${processSymbolToEscape(code)}\`)`)
    removeOriginWorkerJs(filename)
  })
  fs.writeFileSync(mainBundlePath, mainCode, {
    encoding: 'utf-8'
  })
}
function runInject() {
  injectWorkerToModule()
}

runInject()
