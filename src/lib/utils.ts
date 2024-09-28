import { Cell } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function generateBoard(x: number, y: number): Cell[][] {
	return [...Array(x).keys()].map((row, i) =>
		[...Array(y).keys()].map((col, j) => {
			let max = 3
			if (i === 0 || i === y - 1 || j === 0 || j === x - 1) max = 2
			if (
				(i === 0 && j === 0) ||
				(i === 0 && j === x - 1) ||
				(i === y - 1 && j === 0) ||
				(i === y - 1 && j === x - 1)
			)
				max = 1
			return { player: null, count: 0, max }
		})
	)
}
