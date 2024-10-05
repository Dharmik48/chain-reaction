<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRoute, useRouter } from 'vue-router'
import { useConvexMutation, useConvexQuery } from '@convex-vue/core'
import { api } from '../convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'
import { PLAYERS } from './lib/constants'
import { ref, watch } from 'vue'
import { toast } from '@/components/ui/toast'
// TODO add waiting for admin to start game
// TODO add leave game button
const route = useRoute()
const router = useRouter()

const error = ref('')
const { gameId } = route.query

const removeGame = useConvexMutation(api.games.remove)
const removePlayer = useConvexMutation(api.games.removePlayer)
const updateStatus = useConvexMutation(api.games.updateStatus)
const { data, suspense }: any = useConvexQuery(api.games.get, {
	id: gameId as Id<'games'>,
})
await suspense()

if (data.value.error) error.value = data.value.error

const currentPlayer = sessionStorage.getItem('playerId')

const startGame = async () => {
	if (data.value.players.length !== data.value.playerCount)
		return toast({ title: 'Not enough players!', variant: 'destructive' })

	await updateStatus.mutate({
		id: gameId as Id<'games'>,
		status: 'ongoing',
	})
}

const deleteGame = async () => {
	await removeGame.mutate({ id: gameId as Id<'games'> })
	sessionStorage.clear()
	router.push('/')
}

const leaveGame = async () => {
	await removePlayer.mutate({
		id: gameId as Id<'games'>,
		playerId: currentPlayer!,
	})
	sessionStorage.clear()
	router.push('/')
}

watch(data, newData => {
	if (newData.error) {
		toast({ title: 'Game cancelled.' })
		sessionStorage.clear()
		router.push('/')
	}

	if (newData.status === 'ongoing')
		router.push({ path: '/game', query: { gameId } })
})
</script>

<template>
	<div class="space-y-4 w-full" v-if="!gameId || error">
		<Alert variant="destructive">
			<AlertCircle class="w-4 h-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>
				{{ error ? error : 'Game id not found, create or join a game.' }}
			</AlertDescription>
		</Alert>
		<div class="relative group w-full">
			<RouterLink to="/">
				<Button type="submit" class="bg-white w-full hover:bg-white">
					Go Home
				</Button>
			</RouterLink>
			<div
				class="absolute inset-0 scale-90 bg-gradient-to-r from-red-500 to-blue-500 blur group-hover:scale-100 -z-10 transition-transform"
			></div>
		</div>
	</div>

	<Card class="min-w-80" v-else-if="data.players">
		<CardHeader>
			<CardTitle>Invite Players</CardTitle>
			<CardDescription
				>You can invite
				<span>{{ data.playerCount }}</span> players.</CardDescription
			>
			<div class="flex items-center space-x-4 rounded-md border p-4">
				<div class="flex-1 space-y-1">
					<p class="text-sm font-medium leading-none">
						Game Code: <span class="font-bold">{{ data.code }}</span>
					</p>
				</div>
			</div>
		</CardHeader>
		<CardContent class="grid gap-4">
			<div>
				<div
					v-for="(player, index) in data.players"
					:key="index"
					class="mb-4 flex items-center gap-2 pb-4 last:mb-0 last:pb-0"
				>
					<span
						class="flex h-3 w-3 rounded-full"
						:style="{ backgroundColor: PLAYERS[index].color }"
					/>
					<p class="text-sm font-medium leading-none">{{ player.name }}</p>
				</div>
			</div>
		</CardContent>

		<CardFooter
			v-if="
				currentPlayer ===
				data.players.find((player: any) => player.creator).playerId
			"
		>
			<div class="flex gap-4 w-full">
				<div class="relative group w-full">
					<Button
						@click="startGame"
						class="relative z-10 bg-white w-full hover:bg-white"
					>
						Start Game
					</Button>
					<div
						class="absolute inset-0 scale-90 bg-gradient-to-r from-red-500 to-blue-500 blur group-hover:scale-100 transition-transform"
					></div>
				</div>
				<div class="relative group w-full">
					<Button
						variant="destructive"
						@click="deleteGame"
						class="relative z-10 w-full"
					>
						Cancel
					</Button>
					<div
						class="absolute inset-0 scale-90 bg-red-500 blur group-hover:scale-100 transition-transform"
					></div>
				</div>
			</div>
		</CardFooter>
		<CardFooter v-else>
			<div class="flex gap-8 w-full flex-col">
				<div class="flex gap-2">
					<Loader2 class="animate-spin" />
					<p>Waiting for THE CREATOR to start the game</p>
				</div>
				<div class="relative group w-full">
					<Button
						variant="destructive"
						@click="leaveGame"
						class="relative z-10 w-full"
					>
						Leave Game
					</Button>
					<div
						class="absolute inset-0 scale-90 bg-red-500 blur group-hover:scale-100 transition-transform"
					></div>
				</div>
			</div>
		</CardFooter>
	</Card>
</template>
