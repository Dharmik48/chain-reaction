<script setup lang="ts">
import { h } from 'vue'
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
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from '@/components/ui/number-field'
import { Input } from './ui/input'

const formSchema = toTypedSchema(
	z.object({
		players: z.number().min(2, 'Min 2 players').max(8, 'Max 8 players'),
		rows: z.number(),
		cols: z.number(),
	})
)

const { handleSubmit, setFieldValue } = useForm({
	validationSchema: formSchema,
	initialValues: {
		players: 2,
		rows: 10,
		cols: 10,
	},
})

const onSubmit = handleSubmit(values => {
	console.log(values)
})
</script>

<template>
	<form class="space-y-6" @submit="onSubmit">
		<FormField v-slot="{ value }" name="players">
			<FormItem>
				<FormLabel>Players</FormLabel>
				<NumberField
					class="gap-2"
					:min="0"
					:model-value="value"
					@update:model-value="
						v => {
							if (v) {
								setFieldValue('players', v)
							} else {
								setFieldValue('players', undefined)
							}
						}
					"
				>
					<NumberFieldContent>
						<NumberFieldDecrement />
						<FormControl>
							<NumberFieldInput />
						</FormControl>
						<NumberFieldIncrement />
					</NumberFieldContent>
				</NumberField>
				<FormDescription>Upto 8 players</FormDescription>
				<FormMessage />
			</FormItem>
			<div class="flex items-end gap-6">
				<FormField v-slot="{ componentField }" name="rows">
					<FormItem>
						<FormLabel>Grid Size</FormLabel>
						<FormControl>
							<Input type="number" placeholder="Rows" v-bind="componentField" />
						</FormControl>
						<FormDescription> Rows </FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
				<span class="self-center">x</span>
				<FormField v-slot="{ componentField }" name="cols">
					<FormItem>
						<FormControl>
							<Input type="number" placeholder="Cols" v-bind="componentField" />
						</FormControl>
						<FormDescription> Columns </FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
			</div>
		</FormField>
		<div class="relative group">
			<div
				class="absolute inset-0 scale-90 bg-gradient-to-r -z-10 from-red-500 to-blue-500 blur group-hover:scale-100 transition-transform"
			></div>
			<Button type="submit" class="bg-white w-full hover:bg-white">
				Start
			</Button>
		</div>
	</form>
</template>
