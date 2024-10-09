<script setup lang="ts">
import { computed, h, nextTick, ref, useTemplateRef, watch } from 'vue'
import { PLAYERS } from '@/lib/constants'
import { getExpandToCells } from '@/lib/utils'
import Cell from '@/components/Cell.vue'
import gsap from 'gsap'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useConvexMutation, useConvexQuery } from '@convex-vue/core'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { toast, ToastAction } from './ui/toast'

const route = useRoute()
const gameId = route.query.gameId

const { mutate: mutateRestart } = useConvexMutation(api.games.restart)
const { mutate: mutateCell } = useConvexMutation(api.games.addCount)
const { data, suspense }: any = useConvexQuery(api.games.get, {
	id: gameId as Id<'games'>,
})

await suspense()

const ROWS = Number(data.value.grid.rows) || 12
const COLS = Number(data.value.grid.cols) || 6
const ANIMATION_DURATION = 0.5

const updateBoard = useConvexMutation(api.games.updateBoard)

const boardRef = useTemplateRef('board-ref')
const audioRef = useTemplateRef('audio-ref')
const board = computed(() => data.value.board)
const disabled = ref(false)
const shouldUpdate = ref(false)
const player = sessionStorage.getItem('playerId')

async function add(row: number, col: number) {
	if (data.value.turn !== player) return
	if (
		disabled.value ||
		(board.value[row][col].player !== null &&
			board.value[row][col].player !== player)
	)
		return

	board.value[row][col].player = player
	board.value[row][col].count++

	await mutateCell({
		id: gameId as Id<'games'>,
		board: board.value,
		updateTurn: true,
		row,
		col,
	})
}

async function expand(row: number, col: number) {
	const expandTo = getExpandToCells(row, col, ROWS, COLS)

	expandTo.forEach(async cell => {
		board.value[cell.r][cell.c].count++
		board.value[cell.r][cell.c].player = board.value[row][col].player
		board.value[row][col].count--
	})

	if (board.value[row][col].count === 0) board.value[row][col].player = null
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
				shouldUpdate.value = false
				originCell?.classList.add('hide-spheres')
				if (i !== expandTo.length - 1) return
				const audio = new Audio(audioRef.value?.src)
				audio.play()
			},
			onComplete: () => {
				gsap.set(sphere, { x: 0, y: 0 })
				if (i !== expandTo.length - 1) return
				expand(row, col)
				originCell?.classList.remove('hide-spheres')
				disabled.value = false
				shouldUpdate.value = true
			},
		})
	})
}

async function restart() {
	toast({
		title: 'Restart Game?',
		description: 'Are you sure want to restart game?',
		action: h(
			ToastAction,
			{ altText: 'ayo' },
			{
				el: () => 'button',
				default: () =>
					h(
						'button',
						{
							onClick: async () =>
								await mutateRestart({
									id: gameId as Id<'games'>,
									rows: ROWS,
									cols: COLS,
								}),
						},
						'Confirm'
					),
			}
		),
	})
}

watch(shouldUpdate, async newValue => {
	await nextTick()
	if (!newValue) return
	if (data.value.turn !== player) return

	updateBoard.mutate({
		id: gameId as Id<'games'>,
		board: board.value,
	})
})

watch(board, async newBoard => {
	newBoard.forEach((row: any, i: number) => {
		row.forEach((cell: any, j: number) => {
			if (cell.count < cell.max + 1) return
			animateSphereAndExpand(i, j)
		})
	})
})

const turnIndex = computed(() =>
	data.value.players.findIndex(
		(player: any) => player.playerId === data.value.turn
	)
)
</script>

<template>
	<ul ref="board-ref" class="relative px-10 mx-auto">
		<div v-for="(row, i) in board" :key="i" class="flex">
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
	<div
		class="relative group mt-8"
		v-if="
			player ===
			data.players.filter((player: any) => player.creator)[0].playerId
		"
	>
		<div
			class="absolute inset-0 scale-90 bg-gradient-to-r -z-10 from-red-500 to-blue-500 blur group-hover:scale-100 transition-transform"
		></div>
		<Button class="bg-white w-full hover:bg-white" @click="restart">
			Restart
		</Button>
	</div>
	<audio ref="audio-ref" src="/pop.mp3"></audio>
</template>
