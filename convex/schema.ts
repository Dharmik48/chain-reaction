import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
// TODO add unique to code
export default defineSchema({
	games: defineTable({
		board: v.array(
			v.array(
				v.object({
					player: v.null() || v.number(),
					count: v.number(),
					max: v.number(),
				})
			)
		),
		code: v.string(),
		players: v.array(
			v.object({ playerId: v.string(), name: v.string(), creator: v.boolean() })
		),
		playerCount: v.number(),
		status: v.string(),
	}).index('by_code', ['code']),
})
