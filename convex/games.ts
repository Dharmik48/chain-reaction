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
			players: [args.player],
			board,
			playerCount: args.playersCount,
			code: uniqueCode,
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

		await ctx.db.patch(game._id, { players: [...game.players, args.player] })

		return game
	},
})
