import { join } from 'path'
import { getApiDir } from '@/config'
import { existsSync, mkdirSync } from 'fs'
import { GenApi } from '@/code/nest'
import { ApiServiceField, DtoField, EntityField } from '@/types'

export function genApiCode(
	name: string,
	dto: DtoField[],
	entity: EntityField[],
	apiService: ApiServiceField[]
) {
	const basePath = join(getApiDir(), name)
	if (!existsSync(basePath)) {
		mkdirSync(basePath)
	}
	const api = new GenApi(basePath, name)
	api.genModule()
	api.genDto(dto)
	api.genEntity(entity)
	api.genApiService(apiService)
}
