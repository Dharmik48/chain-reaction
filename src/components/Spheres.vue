<script lang="ts" setup>
import { cn } from '@/lib/utils'

defineProps<{
	count: number
	animateCount: number
	player: null | string
	color: string
}>()
</script>

<template>
	<div
		v-if="count === 1 && player !== null"
		:class="
			cn('h-4 w-4 rounded-full sphere', animateCount === 1 && 'animate-spin')
		"
		:style="{ backgroundColor: color }"
	></div>
	<div
		v-else-if="count === 2 && player !== null"
		:class="`flex ${animateCount === 2 && 'animate-spin'}`"
	>
		<div
			class="h-4 w-4 rounded-full translate-x-1 sphere"
			:style="{ backgroundColor: color }"
		></div>
		<div
			class="h-4 w-4 rounded-full -translate-x-1 sphere"
			:style="{ backgroundColor: color }"
		></div>
	</div>
	<div
		v-else-if="count === 3 && player !== null"
		:class="`flex flex-col items-center ${
			animateCount === 3 && 'animate-spin'
		}`"
	>
		<div
			class="h-4 w-4 rounded-full translate-y-1 shadow sphere"
			:style="{ backgroundColor: color }"
		></div>
		<div class="flex -translate-y-1">
			<div
				class="h-4 w-4 rounded-full translate-x-1 shadow-md sphere"
				:style="{ backgroundColor: color }"
			></div>
			<div
				class="h-4 w-4 rounded-full -translate-x-1 shadow-md sphere"
				:style="{ backgroundColor: color }"
			></div>
		</div>
	</div>
</template>
