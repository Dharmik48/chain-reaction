<script setup lang="ts">
import { ref } from 'vue'
import Spheres from './Spheres.vue'

const board = ref([
	[
		{ player: null, count: 0, max: 1 },
		{ player: null, count: 0, max: 2 },
		{ player: null, count: 0, max: 2 },
		{ player: null, count: 0, max: 1 },
	],
	[
		{ player: null, count: 0, max: 2 },
		{ player: null, count: 0, max: 3 },
		{ player: null, count: 0, max: 3 },
		{ player: null, count: 0, max: 2 },
	],
	[
		{ player: null, count: 0, max: 2 },
		{ player: null, count: 0, max: 3 },
		{ player: null, count: 0, max: 3 },
		{ player: null, count: 0, max: 2 },
	],
	[
		{ player: null, count: 0, max: 1 },
		{ player: null, count: 0, max: 2 },
		{ player: null, count: 0, max: 2 },
		{ player: null, count: 0, max: 1 },
	],
])

function add(row: number, col: number) {
	board.value[row][col].count++
}
</script>

<template>
	<h1>Game</h1>
	<ul>
		<div v-for="(row, i) in board" :key="i" class="flex">
			<li
				v-for="(box, j) in row"
				:key="`i,j`"
				class="h-10 aspect-square border border-primary cursor-pointer grid place-items-center"
				@click="add(i, j)"
			>
				<Spheres :count="box.count" :animate-count="box.max" />
			</li>
		</div>
	</ul>
</template>
