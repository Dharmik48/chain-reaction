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
import { Switch } from './components/ui/switch'
import { AlertCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRoute } from 'vue-router'
import { useConvexQuery } from '@convex-vue/core'
import { api } from '../convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'
import { cn } from './lib/utils'
import { PLAYERS } from './lib/constants'
import { ref } from 'vue'
import ShortUniqueId from 'short-unique-id'

const route = useRoute()

const { randomUUID } = new ShortUniqueId()

const error = ref('')
const { gameId } = route.query

const { data, isLoading, suspense }: any = useConvexQuery(api.games.get, {
	id: gameId as Id<'games'>,
})
await suspense()

if (data.value.error) error.value = data.value.error
</script>

<template>
	<div class="space-y-4" v-if="!gameId || error">
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

	<Card class="w-full" v-else>
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
		<CardFooter>
			<div class="relative group w-full">
				<Button
					type="submit"
					class="relative z-10 bg-white w-full hover:bg-white"
				>
					Start Game
				</Button>
				<div
					class="absolute inset-0 scale-90 bg-gradient-to-r from-red-500 to-blue-500 blur group-hover:scale-100 transition-transform"
				></div>
			</div>
		</CardFooter>
	</Card>
</template>
