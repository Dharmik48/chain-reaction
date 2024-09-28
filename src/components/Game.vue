<script setup lang="ts">
import { ref, watch } from 'vue'
import Spheres from './Spheres.vue'
import { PLAYERS } from '@/lib/constants'
import { cn, generateBoard } from '@/lib/utils'
import { Cell } from '@/types'

const PLAYERS_COUNT = 2
const ROWS = 7
const COLS = 7

let turn = ref(0)
const board = ref<Cell[][]>(generateBoard(ROWS, COLS))

function add(row: number, col: number) {
	if (
		board.value[row][col].player !== null &&
		board.value[row][col].player !== turn.value
	)
		return null

	board.value[row][col].player = turn.value
	board.value[row][col].count++
	nextPlayer()
}

function expand(row: number, col: number) {
	const expandTo = [
		{ r: row - 1, c: col },
		{ r: row + 1, c: col },
		{ r: row, c: col + 1 },
		{ r: row, c: col - 1 },
	]

	expandTo.forEach(cell => {
		if (cell.r < 0 || cell.c < 0 || cell.r >= ROWS || cell.c >= COLS) return

		board.value[cell.r][cell.c].count++
		board.value[cell.r][cell.c].player = board.value[row][col].player
	})
	board.value[row][col].count = 0
	board.value[row][col].player = null
}

function nextPlayer() {
	if (turn.value === PLAYERS_COUNT - 1) turn.value = 0
	else turn.value++
}

watch(board.value, (oldBoard, newBoard) => {
	newBoard.forEach((row, i) => {
		row.forEach((cell, j) => {
			if (!(newBoard[i][j].count === newBoard[i][j].max + 1)) return
			expand(i, j)
			// board.value[i][j].count = 0
			// board.value[i][j].player = null
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
				:class="
					cn('h-10 aspect-square cursor-pointer grid place-items-center border')
				"
				@click="add(i, j)"
				:style="{ borderColor: PLAYERS[turn].color }"
			>
				<Spheres
					:count="box.count"
					:animate-count="box.max"
					:player="box.player"
				/>
			</li>
		</div>
	</ul>
</template>
