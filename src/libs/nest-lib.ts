import { setTask } from '../task'
import { RenderNest } from '../code/nest'
import { isReverse } from '../config'
import { ApiServiceField, DtoField, EntityField } from '../types'

export function renderNestCode(
	config: { name: string; path?: string },
	entity: EntityField[],
	dto: DtoField[],
	apiService: ApiServiceField[]
) {
	setTask(async () => {
		const api = new RenderNest(config.name, config.path)
		if (isReverse()) {
			await Promise.all([api.remove(), api.editAppModule(true)])
		} else {
			await Promise.all([
				api.editAppModule(),
				api.genModule(),
				api.genDto(dto),
				api.genEntity(entity),
				api.genApiService(apiService)
			])
		}
	})
}
