<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import Spheres from './Spheres.vue'
import { PLAYERS } from '@/lib/constants'
import { generateBoard, getExpandToCells } from '@/lib/utils'
import { Cell } from '@/types'
import gsap from 'gsap'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'

const route = useRoute()

const PLAYERS_COUNT = Number(route.query.players) || 2
const ROWS = Number(route.query.rows) || 12
const COLS = Number(route.query.cols) || 6
const ANIMATION_DURATION = 0.5

let turn = ref(0)
const boardRef = useTemplateRef('board-ref')
const board = ref<Cell[][]>(generateBoard(ROWS, COLS))
const disabled = ref(false)

function add(row: number, col: number) {
	if (
		disabled.value ||
		(board.value[row][col].player !== null &&
			board.value[row][col].player !== turn.value)
	)
		return

	board.value[row][col].player = turn.value
	board.value[row][col].count++
	nextPlayer()
}

function expand(row: number, col: number) {
	const expandTo = getExpandToCells(row, col, ROWS, COLS)

	expandTo.forEach(cell => {
		board.value[cell.r][cell.c].count++
		board.value[cell.r][cell.c].player = board.value[row][col].player
		board.value[row][col].count--
	})
	if (board.value[row][col].count === 0) board.value[row][col].player = null
}

function nextPlayer() {
	if (turn.value === PLAYERS_COUNT - 1) turn.value = 0
	else turn.value++
}

async function animateSphereAndExpand(row: number, col: number) {
	disabled.value = true
	const expandTo = getExpandToCells(row, col, ROWS, COLS)

	await nextTick()

	const originCell = boardRef.value?.querySelector(`#c${row}-${col}`)
	const spheresToAnimate: any = originCell?.querySelectorAll('.moving-sphere')

	spheresToAnimate?.forEach((sphere: any, i: number) => {
		gsap.to(sphere, {
			duration: ANIMATION_DURATION,
			x: `+=${Number(sphere.dataset.x)}`,
			y: `+=${Number(sphere.dataset.y)}`,
			onStart: () => {
				originCell?.classList.add('hide-spheres')
			},
			onComplete: () => {
				gsap.set(sphere, { x: 0, y: 0 })
				if (i !== expandTo.length - 1) return
				expand(row, col)
				originCell?.classList.remove('hide-spheres')
				disabled.value = false
			},
		})
	})
}

watch(board.value, (_oldBoard, newBoard) => {
	newBoard.forEach((row, i) => {
		row.forEach((_cell, j) => {
			if (newBoard[i][j].count < newBoard[i][j].max + 1) return
			animateSphereAndExpand(i, j)
		})
	})
})
</script>

<template>
	<ul ref="board-ref" class="relative px-10 mx-auto">
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
					v-if="box.player !== null && j !== 0"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="-40"
					data-y="0"
				></div>
				<div
					v-if="box.player !== null && j !== COLS - 1"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="40"
					data-y="0"
				></div>
				<div
					v-if="box.player !== null && i !== 0"
					class="h-4 w-4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 moving-sphere"
					:style="{backgroundColor: PLAYERS[box.player!].color}"
					data-x="0"
					data-y="-40"
				></div>
				<div
					v-if="box.player !== null && i !== ROWS - 1"
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
	</ul>
	<RouterLink class="mt-12" to="/"
		><div class="relative group">
			<div
				class="absolute inset-0 scale-90 bg-gradient-to-r -z-10 from-red-500 to-blue-500 blur group-hover:scale-100 transition-transform"
			></div>
			<Button class="bg-white w-full hover:bg-white"> Restart </Button>
		</div></RouterLink
	>
</template>
