import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'

async function bootStrap() {
  const app = createApp(App)

  app.mount('#app')
}

bootStrap()
