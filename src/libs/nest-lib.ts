import { GenApi } from '@/code/nest'
import { isReverse } from '@/config'
import { ApiServiceField, DtoField, EntityField } from '@/types'

export function genApiCode(
	name: string,
	dto: DtoField[],
	entity: EntityField[],
	apiService: ApiServiceField[]
) {
	const api = new GenApi(name)
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
