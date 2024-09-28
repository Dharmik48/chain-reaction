<script lang="ts" setup>
defineProps<{ count: number; animateCount: number }>()
</script>

<template>
	<div
		v-if="count === 1"
		:class="`h-4 w-4 bg-primary rounded-full ${
			animateCount === 1 && 'animate-spin'
		}`"
	></div>
	<div
		v-else-if="count === 2"
		:class="`flex ${animateCount === 2 && 'animate-spin'}`"
	>
		<div class="h-4 w-4 bg-primary rounded-full translate-x-1"></div>
		<div class="h-4 w-4 -translate-x-1 bg-primary rounded-full"></div>
	</div>
	<div
		v-else-if="count === 3"
		:class="`flex flex-col items-center ${
			animateCount === 3 && 'animate-spin'
		}`"
	>
		<div class="h-4 w-4 bg-primary rounded-full translate-y-1 shadow"></div>
		<div class="flex -translate-y-1">
			<div
				class="h-4 w-4 bg-primary rounded-full translate-x-1 shadow-md"
			></div>
			<div
				class="h-4 w-4 bg-primary rounded-full -translate-x-1 shadow-md"
			></div>
		</div>
	</div>
</template>
