import xiu from './render'
import { join } from 'path'
import { writeFormatFile } from './util'
import { existsSync, mkdirSync } from 'fs'

export const genDtoCode = async (path = '', moduleName = '') => {
	const dtoPath = join(path, 'dto')
	if (!existsSync(dtoPath)) {
		mkdirSync(dtoPath)
	}
	const createDtoPath = join(dtoPath, `create-${moduleName}.dto.ts`)
	const updateDtoPath = join(dtoPath, `update-${moduleName}.dto.ts`)
	const createDtoStr = await xiu.render('create-dto', {
		importInfo:
			"import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator'\n",
		name: moduleName,
		content: 'name:string'
	})
	const updateDtoStr = await xiu.render('update-dto', {
		name: moduleName
	})
	writeFormatFile(createDtoPath, createDtoStr)
	writeFormatFile(updateDtoPath, updateDtoStr)
}

export const genEntity = async (path = '', moduleName = '') => {
	const entityDir = join(path, 'entities')
	if (!existsSync(entityDir)) {
		mkdirSync(entityDir)
	}
	const entityPath = join(entityDir, `${moduleName}.entity.ts`)
	const entityStr = await xiu.render('entity', {
		name: moduleName
	})
	writeFormatFile(entityPath, entityStr)
}
