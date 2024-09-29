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

export function getExpandToCells(
	row: number,
	col: number,
	rows: number,
	cols: number
) {
	const all = [
		{ r: row - 1, c: col },
		{ r: row + 1, c: col },
		{ r: row, c: col + 1 },
		{ r: row, c: col - 1 },
	]

	return all.filter(
		cell => !(cell.r < 0 || cell.c < 0 || cell.r >= rows || cell.c >= cols)
	)
}

export function getXY(index: number) {
	const xy = { x: 0, y: 0 }

	switch (index) {
		case 0:
			xy.x = -40
			break
		case 1:
			xy.x = 40
			break
		case 2:
			xy.y = 40
			break
		case 1:
			xy.y = -40
			break
	}

	return xy
}
