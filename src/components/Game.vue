<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import Spheres from './Spheres.vue'
import { PLAYERS } from '@/lib/constants'
import { cn, generateBoard, getExpandToCells, getXY } from '@/lib/utils'
import { Cell } from '@/types'
import gsap from 'gsap'

const PLAYERS_COUNT = 2
const ROWS = 7
const COLS = 7

let turn = ref(0)
const boardRef = useTemplateRef('board-ref')
const board = ref<Cell[][]>(generateBoard(ROWS, COLS))
const movingSpheres = ref<{ x: number; y: number }[]>([])

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
	const expandTo = getExpandToCells(row, col, ROWS, COLS)

	expandTo.forEach(cell => {
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

function animateSphereAndExpand(row: number, col: number) {
	const expandTo = getExpandToCells(row, col, ROWS, COLS)

	const originCell = boardRef.value?.querySelector(`#c${row}-${col}`)
	const spheresToAnimate = originCell?.querySelectorAll('.moving-sphere')

	spheresToAnimate?.forEach((sphere, i) =>
		gsap.to(sphere, {
			duration: 1,
			x: `+=${Number(sphere.dataset.x)}`,
			y: `+=${Number(sphere.dataset.y)}`,
			onComplete: () => {
				if (i !== expandTo.length - 1) return
				expand(row, col)
			},
		})
	)

	// expandTo.forEach((cell, i) => {
	// 	const destinationCell = boardRef.value
	// 		?.querySelector(`#c${cell.r}-${cell.c}`)
	// 		?.getBoundingClientRect()

	// 	if (!destinationCell || !originCell) return

	// 	const sphere = { x: 0, y: 0 }
	// 	movingSpheres.value.push(sphere)

	// 	const { x, y } = getXY(i)
	// 	console.log(x, y)

	// 	gsap.to(sphere, {
	// 		duration: 1,
	// 		x: `+=${x}px`,
	// 		y: `+=${y}px`,
	// 	})

	// 	// board.value[cell.r][cell.c].count++
	// 	// board.value[cell.r][cell.c].player = board.value[row][col].player
	// })
}

watch(board.value, (oldBoard, newBoard) => {
	newBoard.forEach((row, i) => {
		row.forEach((cell, j) => {
			if (!(newBoard[i][j].count === newBoard[i][j].max + 1)) return
			animateSphereAndExpand(i, j)
		})
	})
})
</script>

<template>
	<h1>Game</h1>
	<ul ref="board-ref" class="relative">
		<div v-for="(row, i) in board" :key="i" class="flex">
			<li
				v-for="(box, j) in row"
				:key="`i,j`"
				class="relative h-10 aspect-square cursor-pointer grid place-items-center border"
				@click="add(i, j)"
				:style="{ borderColor: PLAYERS[turn].color }"
				:id="`c${i}-${j}`"
			>
				<div
					v-if="box.player !== null"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="-40"
					data-y="0"
				></div>
				<div
					v-if="box.player !== null"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="40"
					data-y="0"
				></div>
				<div
					v-if="box.player !== null"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="0"
					data-y="-40"
				></div>
				<div
					v-if="box.player !== null"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="0"
					data-y="40"
				></div>
				<Spheres
					:count="box.count"
					:animate-count="box.max"
					:player="box.player"
				/>
			</li>
		</div>
		<!-- <div
			v-for="(div, index) in movingSpheres"
			:key="index"
			class="absolute h-10 aspect-square cursor-pointer grid place-items-center"
			:style="{ left: div.x + 'px', top: div.y + 'px' }"
		>
			<div class="h-4 w-4 rounded-full bg-white"></div>
		</div> -->
	</ul>
</template>
