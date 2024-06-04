<template>
  <ConfigProvider>
    <div class="upload-container">
      <UploadDragger :max-count="1" v-model:file-list="fileList" :before-upload="beforeUpload" @remove="onRemove">
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </UploadDragger>
      <div>
        <Button type="primary" @click="handleUpload" :disabled="fileList.length === 0" :loading="uploading"
          style="margin-top: 16px;">
          {{ uploading ? 'uploading' : 'start uploading' }}
        </Button>
        <Button type="primary" @click="handleMerge" :loading="mergeLoading" :disabled="fileList.length === 0"
          style="margin-top: 16px; margin-left: 16px;">
          merge chunks
        </Button>
      </div>
      <div>
        <Button type="primary" @click="handleAbort" style="margin-top: 16px;">
          abort request
        </Button>
        <Button type="primary" @click="handleRestart" style="margin-top: 16px;margin-left: 16px">
          restart request
        </Button>
        <Button type="primary" @click="clearChunk" style="margin-top: 16px;margin-left: 16px">
          clear upload task
        </Button>
        <Button type="primary" @click="clearAllCache" style="margin-top: 16px;margin-left: 16px">
          clear cache
        </Button>
      </div>
      <UploadList :list="chunkList" />
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { UploadDragger, UploadFile, ConfigProvider, UploadProps, message, Button } from 'ant-design-vue';
import { useMerge, useUpload } from 'vue-use-upload';
import { mergeFile } from '@/api/upload';
import UploadList from './components/list.vue'
import { BASE_URL } from '@/api/request';
import { FileReaderWorker } from 'use-upload-shared-worker';
import { ref } from 'vue';

const uploading = ref(false)
const fileList = ref<UploadFile[]>([])
const onRemove: UploadProps['onRemove'] = (file: UploadFile) => {
  const index = fileList.value.indexOf(file)
  fileList.value.splice(index, 1)
}
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadFile) => {
  fileList.value = [file]
  return false
}

const { start: startUpload, abort: abortUploadRequest, chunkList, clearTask } = useUpload(
  (data) => {
    const formData = new FormData()
    formData.append('file', data.blob)
    formData.append('index', `${data.index}`)
    formData.append('filename', data.filename)
    formData.append('hash', data.hash)
    return {
      method: 'post',
      url: `${BASE_URL}/upload`,
      body: formData,
    }
  },
  {
    fileReader: () => (new FileReaderWorker()).worker,
  },
  {
    onSuccess() {
      message.success('upload success')
    },
    onAbort() {
      message.warn('abort uploading')
    },
    onFinally() {
      uploading.value = false
    },
  })

const handleUpload =
  () => {
    uploading.value = true
    startUpload(fileList.value[0].originFileObj!)
  }

const mergeLoading = ref(false)
const [mergeUploadJob] = useMerge(hash => mergeFile({ hash, filename: fileList.value[0].name }), {
  fileReader: () => new FileReaderWorker().worker
}, {
  onSuccess() {
    message.success('merge success')
  },
  onFinally() {
    mergeLoading.value = false
  },
})
function handleMerge() {
  mergeLoading.value = true
  mergeUploadJob(fileList.value[0].originFileObj!)
}

function handleAbort() {
  abortUploadRequest()
  mergeLoading.value = false
}

function handleRestart() {
  startUpload(fileList.value[0].originFileObj!)
}

function clearChunk() {
  clearTask()
}

function clearAllCache() {
  localStorage.clear()
}
</script>

<style scoped>
.upload-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}
</style>
