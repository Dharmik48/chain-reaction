<script setup lang="ts">
import { onWatcherCleanup, ref, watch } from 'vue'
import Spheres from './Spheres.vue'

const MAX_ROW = 3
const MAX_COL = 3
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
	// if (board.value[row][col].count === board.value[row][col].max)
	// 	return expand(row, col)
	board.value[row][col].count++
}

function expand(row: number, col: number) {
	const expandTo = [
		{ r: row - 1, c: col },
		{ r: row + 1, c: col },
		{ r: row, c: col + 1 },
		{ r: row, c: col - 1 },
	]

	expandTo.forEach(cell => {
		if (cell.r < 0 || cell.c < 0 || cell.r > MAX_ROW || cell.c > MAX_COL) return

		board.value[cell.r][cell.c].count++
	})
	board.value[row][col].count = 0
}

watch(board.value, (oldBoard, newBoard) => {
	newBoard.forEach((row, i) => {
		row.forEach((cell, j) => {
			if (!(newBoard[i][j].count === newBoard[i][j].max + 1)) return
			expand(i, j)
			board.value[i][j].count = 0
		})
	})
})
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
