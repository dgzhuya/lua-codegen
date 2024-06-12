import render from './render'
import { join } from 'path'
import { writeFormatFile } from './util'
import { existsSync, mkdirSync } from 'fs'

export const genDtoCode = async (path = '', moduleName = '') => {
	const dtoPath = join(path, 'dto')
	if (!existsSync(dtoPath)) {
		mkdirSync(dtoPath)
	}
	const createDtoPath = join(dtoPath, `create-${moduleName}.dto.ts`)
	const createDtoStr = await render.render('create-dto', {
		import_info:
			"import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator'\n",
		name: moduleName,
		content: 'name:string'
	})
	const updateDtoPath = join(dtoPath, `update-${moduleName}.dto.ts`)
	const updateDtoStr = await render.render('update-dto', {
		name: moduleName
	})
	writeFormatFile(createDtoPath, createDtoStr)
	writeFormatFile(updateDtoPath, updateDtoStr)
}
