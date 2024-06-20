import { RenderNest } from '../code/nest'
import { isReverse } from '../config'
import { ApiServiceField, DtoField, EntityField } from '../types'

export function renderNestCode(
	config: { name: string; path?: string },
	entity: EntityField[],
	dto: DtoField[],
	apiService: ApiServiceField[]
) {
	const api = new RenderNest(config.name, config.path)
	if (isReverse()) {
		api.remove()
		return
	}
	api.editAppModule()
	api.genModule()
	api.genDto(dto)
	api.genEntity(entity)
	api.genApiService(apiService)
}
