<script setup lang="ts">
import Spheres from './Spheres.vue'

defineProps<{
	box: { player: null | string; count: number; max: number }
	rows: number
	cols: number
	i: number
	j: number
	borderColor: string
	player: any
}>()
</script>

<template>
	<li
		class="relative h-10 aspect-square cursor-pointer grid place-items-center border"
		:style="{ borderColor }"
		:id="`c${i}-${j}`"
	>
		<div
			v-if="box.player !== null && j !== 0"
			class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
			:style="{
				backgroundColor: player.color,
			}"
			data-x="-40"
			data-y="0"
		></div>
		<div
			v-if="box.player !== null && j !== cols - 1"
			class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
			:style="{
				backgroundColor: player.color,
			}"
			data-x="40"
			data-y="0"
		></div>
		<div
			v-if="box.player !== null && i !== 0"
			class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
			:style="{
				backgroundColor: player.color,
			}"
			data-x="0"
			data-y="-40"
		></div>
		<div
			v-if="box.player !== null && i !== rows - 1"
			class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
			:style="{
				backgroundColor: player.color,
			}"
			data-x="0"
			data-y="40"
		></div>
		<Spheres
			v-if="box.player !== null && box.count < box.max + 1"
			:count="box.count"
			:animate-count="box.max"
			:player="box.player"
			:color="player.color"
		/>
	</li>
</template>
