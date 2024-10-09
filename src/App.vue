<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'

const gameId = sessionStorage.getItem('gameId')
const router = useRouter()

if (gameId)
	router.push({
		path: '/invite',
		query: { gameId: gameId },
	})
</script>

<template>
	<Toaster />
	<main class="min-h-screen p-8 lg:p-12">
		<div class="flex flex-col items-center justify-center h-full mx-auto">
			<div class="flex items-center gap-3">
				<div class="flex flex-col items-center animate-spin">
					<div class="h-4 w-4 rounded-full translate-y-1 bg-red-500"></div>
					<div class="flex -translate-y-1">
						<div class="h-4 w-4 rounded-full translate-x-1 bg-red-500"></div>
						<div class="h-4 w-4 rounded-full -translate-x-1 bg-red-500"></div>
					</div>
				</div>
				<div class="flex animate-spin">
					<div class="h-4 w-4 rounded-full translate-x-1 bg-blue-500"></div>
					<div class="h-4 w-4 rounded-full -translate-x-1 bg-blue-500"></div>
				</div>
				<div class="h-4 w-4 rounded-full bg-red-500 animate-spin"></div>
				<div class="flex animate-spin direction-reverse">
					<div class="h-4 w-4 rounded-full translate-x-1 bg-blue-500"></div>
					<div class="h-4 w-4 rounded-full -translate-x-1 bg-blue-500"></div>
				</div>
				<div class="flex flex-col items-center animate-spin direction-reverse">
					<div class="h-4 w-4 rounded-full translate-y-1 bg-red-500"></div>
					<div class="flex -translate-y-1">
						<div class="h-4 w-4 rounded-full translate-x-1 bg-red-500"></div>
						<div class="h-4 w-4 rounded-full -translate-x-1 bg-red-500"></div>
					</div>
				</div>
			</div>
			<h1
				class="text-3xl md:text-5xl bg-gradient-to-r from-red-500 to-blue-700 bg-clip-text text-transparent my-8 font-sixtyfour text-center"
			>
				Chain Reaction
			</h1>
			<div class="flex items-center gap-3 mb-12">
				<div class="flex flex-col items-center animate-spin">
					<div class="h-4 w-4 rounded-full translate-y-1 bg-red-500"></div>
					<div class="flex -translate-y-1">
						<div class="h-4 w-4 rounded-full translate-x-1 bg-red-500"></div>
						<div class="h-4 w-4 rounded-full -translate-x-1 bg-red-500"></div>
					</div>
				</div>
				<div class="flex animate-spin">
					<div class="h-4 w-4 rounded-full translate-x-1 bg-blue-500"></div>
					<div class="h-4 w-4 rounded-full -translate-x-1 bg-blue-500"></div>
				</div>
				<div class="h-4 w-4 rounded-full bg-red-500 animate-spin"></div>
				<div class="flex animate-spin direction-reverse">
					<div class="h-4 w-4 rounded-full translate-x-1 bg-blue-500"></div>
					<div class="h-4 w-4 rounded-full -translate-x-1 bg-blue-500"></div>
				</div>
				<div class="flex flex-col items-center animate-spin direction-reverse">
					<div class="h-4 w-4 rounded-full translate-y-1 bg-red-500"></div>
					<div class="flex -translate-y-1">
						<div class="h-4 w-4 rounded-full translate-x-1 bg-red-500"></div>
						<div class="h-4 w-4 rounded-full -translate-x-1 bg-red-500"></div>
					</div>
				</div>
			</div>
			<Suspense>
				<RouterView />
			</Suspense>
			<!-- <SetupForm /> -->
			<!-- <Game /> -->
		</div>
	</main>
</template>
