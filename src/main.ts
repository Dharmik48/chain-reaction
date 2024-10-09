import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import router from './router'

import { createConvexVue } from '@convex-vue/core'

const convexVue = createConvexVue({
	convexUrl: import.meta.env.VITE_CONVEX_URL,
})

createApp(App).use(convexVue).use(router).mount('#app')
