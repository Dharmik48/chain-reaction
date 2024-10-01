import { createMemoryHistory, createRouter } from 'vue-router'
import Game from '@/components/Game.vue'
import SetupForm from '@/components/SetupForm.vue'

const routes = [
	{ path: '/', component: SetupForm },
	{ path: '/game', component: Game },
]

const router = createRouter({
	history: createMemoryHistory(),
	routes,
})

export default router
