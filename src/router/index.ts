import { createMemoryHistory, createRouter } from 'vue-router'
import Game from '@/components/Game.vue'
import SetupForm from '@/components/SetupForm.vue'
import InvitePlayers from '@/InvitePlayers.vue'
import JoinGame from '@/JoinGame.vue'

const routes = [
	{ path: '/', component: SetupForm },
	{ path: '/invite', component: InvitePlayers },
	{ path: '/game', component: Game },
	{ path: '/join', component: JoinGame },
]

const router = createRouter({
	history: createMemoryHistory(),
	routes,
})

export default router
