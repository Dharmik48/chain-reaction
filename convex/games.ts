import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import ShortUniqueId from 'short-unique-id'

function generateBoard(x: number, y: number) {
	return [...Array(x).keys()].map((_row, i) =>
		[...Array(y).keys()].map((_col, j) => {
			let max = 3
			if (i === 0 || i === x - 1 || j === 0 || j === y - 1) max = 2
			if (
				(i === 0 && j === 0) ||
				(i === 0 && j === y - 1) ||
				(i === x - 1 && j === 0) ||
				(i === x - 1 && j === y - 1)
			)
				max = 1
			return { player: null, count: 0, max }
		})
	)
}

const PLAYERS = [
	{ id: 0, color: 'red' },
	{ id: 1, color: 'green' },
	{ id: 2, color: 'blue' },
	{ id: 3, color: 'yellow' },
	{ id: 4, color: 'purple' },
	{ id: 5, color: 'cyan' },
	{ id: 6, color: 'orange' },
	{ id: 7, color: 'white' },
]

export const get = query({
	args: {
		id: v.id('games'),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }
		return game
	},
})

export const create = mutation({
	args: {
		playersCount: v.number(),
		rows: v.number(),
		cols: v.number(),
		player: v.object({ playerId: v.string(), name: v.string() }),
	},
	handler: async (ctx, args) => {
		const board = generateBoard(args.rows, args.cols)
		const { randomUUID } = new ShortUniqueId({ length: 5 })
		const uniqueCode = randomUUID()

		const game = ctx.db.insert('games', {
			players: [{ ...args.player, creator: true, color: 'red' }],
			board,
			playerCount: args.playersCount,
			code: uniqueCode,
			status: 'waiting',
			grid: { rows: args.rows, cols: args.cols },
			turn: args.player.playerId,
		})

		return game
	},
})

export const addPlayer = mutation({
	args: {
		code: v.string(),
		player: v.object({ playerId: v.string(), name: v.string() }),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db
			.query('games')
			.withIndex('by_code', q => q.eq('code', args.code))
			.unique()

		if (!game) return { error: 'Game not found' }

		if (game.players.length === game.playerCount)
			return { error: 'Game is already full!' }

		const color = PLAYERS[game.players.length].color

		await ctx.db.patch(game._id, {
			players: [...game.players, { ...args.player, creator: false, color }],
		})

		return game
	},
})

export const remove = mutation({
	args: {
		id: v.id('games'),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)

		return true
	},
})

export const removePlayer = mutation({
	args: {
		id: v.id('games'),
		playerId: v.string(),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }

		const playersAfterRemoving = game.players.filter(
			player => player.playerId !== args.playerId
		)

		await ctx.db.patch(game._id, {
			players: playersAfterRemoving,
		})

		return game
	},
})

export const updateStatus = mutation({
	args: {
		id: v.id('games'),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }

		await ctx.db.patch(game._id, {
			status: args.status,
		})

		return game
	},
})

export const updateBoard = mutation({
	args: {
		id: v.id('games'),
		board: v.array(
			v.array(
				v.object({
					player: v.union(v.null(), v.string()),
					count: v.number(),
					max: v.number(),
				})
			)
		),
		updateTurn: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		// console.log(args.board[0])

		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }

		const turn = game.players.findIndex(player => player.playerId === game.turn)
		const playerCount = game.playerCount
		let nextTurn

		if (turn === playerCount - 1) nextTurn = 0
		else nextTurn = turn + 1

		if (!args.updateTurn) {
			await ctx.db.patch(game._id, {
				board: args.board,
			})
		} else {
			await ctx.db.patch(game._id, {
				board: args.board,
				turn: game.players[nextTurn].playerId,
			})
		}

		return game
	},
})
export const addCount = mutation({
	args: {
		id: v.id('games'),
		board: v.array(
			v.array(
				v.object({
					player: v.union(v.null(), v.string()),
					count: v.number(),
					max: v.number(),
				})
			)
		),
		updateTurn: v.optional(v.boolean()),
		row: v.number(),
		col: v.number(),
	},
	handler: async (ctx, args) => {
		// console.log(args.board[0])

		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }

		const turn = game.players.findIndex(player => player.playerId === game.turn)
		const playerCount = game.playerCount
		let nextTurn

		if (turn === playerCount - 1) nextTurn = 0
		else nextTurn = turn + 1

		const board = game.board
		board[args.row][args.col].count++
		board[args.row][args.col].player = game.turn

		if (!args.updateTurn) {
			await ctx.db.patch(game._id, {
				board: board,
			})
		} else {
			await ctx.db.patch(game._id, {
				board,
				turn: game.players[nextTurn].playerId,
			})
		}

		return game
	},
})

export const nextPlayer = mutation({
	args: {
		id: v.id('games'),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }

		const turn = game.players.findIndex(player => player.playerId === game.turn)
		const playerCount = game.playerCount
		let nextTurn

		if (turn === playerCount - 1) nextTurn = 0
		else nextTurn = turn + 1

		await ctx.db.patch(args.id, { turn: game.players[nextTurn].playerId })

		return true
	},
})

export const restart = mutation({
	args: {
		id: v.id('games'),
		rows: v.number(),
		cols: v.number(),
	},
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.id)

		if (!game) return { error: 'Game not found' }

		const board = generateBoard(args.rows, args.cols)

		await ctx.db.patch(args.id, { board, turn: game.players[0].playerId })
	},
})
