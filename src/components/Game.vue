<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { PLAYERS } from '@/lib/constants'
import { getExpandToCells } from '@/lib/utils'
import Cell from '@/components/Cell.vue'
import gsap from 'gsap'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useConvexMutation, useConvexQuery } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

const route = useRoute()
const gameId = route.query.gameId

const { mutate: mutateTurn } = useConvexMutation(api.games.nextPlayer)
const { data, suspense }: any = useConvexQuery(api.games.get, {
	id: gameId as Id<'games'>,
})

await suspense()

const ROWS = Number(data.value.grid.rows) || 12
const COLS = Number(data.value.grid.cols) || 6
const ANIMATION_DURATION = 0.5

const updateBoard = useConvexMutation(api.games.updateBoard)

const boardRef = useTemplateRef('board-ref')
// let board = data.value.board
const disabled = ref(false)
const player = sessionStorage.getItem('playerId')

async function add(row: number, col: number) {
	if (data.value.turn !== player) return
	if (
		// disabled.value ||
		data.value.board[row][col].player !== null &&
		data.value.board[row][col].player !== player
	)
		return

	data.value.board[row][col].player = player
	data.value.board[row][col].count++
	// if (data.value.board[row][col].count > data.value.board[row][col].max)
	// 	await animateSphereAndExpand(row, col)

	await updateBoard.mutate({
		id: gameId as Id<'games'>,
		board: data.value.board,
		updateTurn: true,
	})
	// await nextPlayer()
}

async function expand(row: number, col: number) {
	if (data.value.board[row][col].count === 0) return
	if (data.value.board[row][col].count < data.value.board[row][col].max) return
	const expandTo = getExpandToCells(row, col, ROWS, COLS)
	console.log(expandTo.length, data.value.board[row][col].count)

	expandTo.forEach(async cell => {
		data.value.board[cell.r][cell.c].count++
		data.value.board[cell.r][cell.c].player = data.value.board[row][col].player
		// if (
		// 	data.value.board[cell.r][cell.c].count >
		// 	data.value.board[cell.r][cell.c].max
		// )
		// 	await animateSphereAndExpand(cell.r, cell.c)
		data.value.board[row][col].count--
	})

	if (data.value.board[row][col].count === 0)
		data.value.board[row][col].player = null
}

// async function nextPlayer() {
// 	// if (turn.value === PLAYERS_COUNT - 1) turn.value = 0
// 	// else turn.value++
// 	await mutateTurn({ id: gameId as Id<'games'> })
// }

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
				originCell?.classList.remove('hide-spheres')
				disabled.value = false

				if (data.value.turn !== player) return

				expand(row, col)
				updateBoard.mutate({
					id: gameId as Id<'games'>,
					board: data.value.board,
				})
			},
		})
	})
}

watch(data, newData => {
	newData.board.forEach((row: any, i: number) => {
		row.forEach((_cell: any, j: number) => {
			// console.log(newData.board[i][j].count, newData.board[i][j].max + 1)

			if (newData.board[i][j].count < newData.board[i][j].max + 1) return
			animateSphereAndExpand(i, j)
		})
	})
})

// watch(board, async newBoard => {
// 	console.log(newBoard)

// 	newBoard.forEach((row: any, i: number) => {
// 		row.forEach((_cell: any, j: number) => {
// 			if (newBoard[i][j].count < newBoard[i][j].max + 1) return
// 			animateSphereAndExpand(i, j)
// 		})
// 	})
// })

const turnIndex = computed(() =>
	data.value.players.findIndex(
		(player: any) => player.playerId === data.value.turn
	)
)
</script>

<template>
	<ul ref="board-ref" class="relative px-10 mx-auto">
		<div v-for="(row, i) in data.board" :key="i" class="flex">
			<Cell
				v-for="(box, j) in row"
				:key="`${i},${j}`"
				@click="add(i, j)"
				:box="box"
				:i="i"
				:j="j"
				:rows="ROWS"
				:cols="COLS"
				:borderColor="PLAYERS[turnIndex].color"
				:player="
					data.players[
						data.players.findIndex((p: any) => p.playerId === box.player)
					]
				"
			/>
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
