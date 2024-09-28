<script lang="ts" setup>
import { PLAYERS } from '@/lib/constants'
import { cn } from '@/lib/utils'

defineProps<{
	count: number
	animateCount: number
	player: null | number
}>()
</script>

<template>
	<div
		v-if="count === 1"
		:class="cn('h-4 w-4 rounded-full', animateCount === 1 && 'animate-spin')"
		:style="{backgroundColor: PLAYERS[player!].color}"
	></div>
	<div
		v-else-if="count === 2"
		:class="`flex ${animateCount === 2 && 'animate-spin'}`"
	>
		<div
			class="h-4 w-4 rounded-full translate-x-1"
			:style="{backgroundColor: PLAYERS[player!].color}"
		></div>
		<div
			class="h-4 w-4 rounded-full -translate-x-1"
			:style="{backgroundColor: PLAYERS[player!].color}"
		></div>
	</div>
	<div
		v-else-if="count === 3"
		:class="`flex flex-col items-center ${
			animateCount === 3 && 'animate-spin'
		}`"
	>
		<div
			class="h-4 w-4 rounded-full translate-y-1 shadow"
			:style="{backgroundColor: PLAYERS[player!].color}"
		></div>
		<div class="flex -translate-y-1">
			<div
				class="h-4 w-4 rounded-full translate-x-1 shadow-md"
				:style="{backgroundColor: PLAYERS[player!].color}"
			></div>
			<div
				class="h-4 w-4 rounded-full -translate-x-1 shadow-md"
				:style="{backgroundColor: PLAYERS[player!].color}"
			></div>
		</div>
	</div>
</template>
