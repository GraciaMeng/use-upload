<template>
  <div class="upload-list">
    <List item-layout="horizontal" :dataSource="list">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta :title="item.chunkName">
            <template #description>
              <Progress :percent="item.status === 'wait' ? 0 : 100" :status="computeStatus(item.status)" />
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </div>
</template>

<script setup lang="ts">
import { List, ListItem, ListItemMeta, Progress, ProgressProps } from 'ant-design-vue';
import { UploadChunkInfo, UploadFileStatus } from 'vue-use-upload';
defineProps<{
  list: UploadChunkInfo[]
}>()

const computeStatus = (status: UploadFileStatus): ProgressProps['status'] => {
  const isWait = status === 'wait'
  if (isWait || status === 'loading') return 'normal'
  if (status === 'success') return 'success'
  return 'exception'
}
</script>

<style scoped>
.upload-list {
  width: 100%;
}
</style>
