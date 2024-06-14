import { join } from 'path'
import { getApiDir } from '@/config'
import { existsSync, mkdirSync } from 'fs'
import { GenApi } from '@/code/nest'
import { DTOSchema } from '@/types'

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
