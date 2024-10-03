<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import router from '@/router'
import { cn } from '@/lib/utils'
import { useConvexMutation } from '@convex-vue/core'
import { api } from '../convex/_generated/api'
import { useToast } from '@/components/ui/toast'
import { toast } from '@/components/ui/toast'
import ShortUniqueId from 'short-unique-id'

const addPlayer = useConvexMutation(api.games.addPlayer)
const { randomUUID } = new ShortUniqueId()

const formSchema = toTypedSchema(
	z.object({
		name: z.string().max(20, 'Cannot be more than 20 characters'),
		code: z.string().length(5, 'Invalid code'),
	})
)

const { handleSubmit } = useForm({
	validationSchema: formSchema,
})

const onSubmit = handleSubmit(async values => {
	const { code, name } = values
	const playerId = randomUUID()

	const game: any = await addPlayer.mutate({ code, player: { playerId, name } })

	if (game.error)
		return toast({
			title: game.error || 'Something went wrong',
			variant: 'destructive',
		})
})
</script>

<template>
	<form class="space-y-6" @submit="onSubmit">
		<FormField v-slot="{ componentField }" name="name">
			<FormItem>
				<FormLabel>Name</FormLabel>
				<FormControl>
					<Input type="text" v-bind="componentField" />
				</FormControl>
				<FormMessage />
			</FormItem>
		</FormField>
		<FormField v-slot="{ componentField }" name="code">
			<FormItem>
				<FormLabel>Game Code</FormLabel>
				<FormControl>
					<Input type="text" v-bind="componentField" />
				</FormControl>
				<FormDescription> Enter the unique 5 digit game code. </FormDescription>
				<FormMessage />
			</FormItem>
		</FormField>
		<div class="relative group">
			<div
				class="absolute inset-0 scale-90 bg-gradient-to-r -z-10 from-red-500 to-blue-500 blur group-hover:scale-100 transition-transform"
			></div>
			<Button type="submit" class="bg-white w-full hover:bg-white">
				Join Game
			</Button>
		</div>
	</form>
</template>
