import { join } from 'path'
import { getApiDir } from './config'
import { existsSync, mkdirSync } from 'fs'
import { GenApi } from './codegen'
import { DTOSchema } from './types'

export function genApiCode(name: string, dto: DTOSchema[]) {
	const basePath = join(getApiDir(), name)
	if (!existsSync(basePath)) {
		mkdirSync(basePath)
	}
	const api = new GenApi(basePath, name)
	api.genModule()
	api.genDto(dto)
	api.genEntity()
	api.genService()
	api.genController()
}

export function genWebCode(name: string, val: any) {
	console.log('name=', name, ',value=', val)
}

export function printToNode(info: any) {
	console.log(info)
}
