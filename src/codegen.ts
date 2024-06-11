import { renderTemplate } from '@biuxiu/template'
import { join } from 'path'
import { writeFormatFile } from './util'
import { existsSync, mkdirSync } from 'fs'

export const genDtoCode = async (path = '', moduleName = '') => {
	const dtoPath = join(path, 'dto')
	if (!existsSync(dtoPath)) {
		mkdirSync(dtoPath)
	}
	const createDtoPath = join(dtoPath, `create-${moduleName}.dto.ts`)
	const createDtoStr = await renderTemplate('create-dto', {
		name: moduleName,
		content: 'name:string'
	})
	writeFormatFile(createDtoPath, createDtoStr)
}
