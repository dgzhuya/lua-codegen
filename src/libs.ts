import { setTask } from './task'
import { RenderNest } from './code/nest'
import { isReverse } from './config'
import {
	ApiServiceField,
	DtoField,
	EntityField,
	FieldSchema,
	ModuleConfig,
	ModuleRoute
} from './types'

export function renderNestCode(
	config: { name: string; path?: string },
	entity: EntityField[],
	dto: DtoField[],
	apiService: ApiServiceField[]
) {
	setTask(async () => {
		const nest = new RenderNest(config.name, config.path)
		if (isReverse()) {
			await Promise.all([nest.remove(), nest.editAppModule(true)])
		} else {
			await Promise.all([
				nest.editAppModule(),
				nest.genModule(),
				nest.genDto(dto),
				nest.genEntity(entity),
				nest.genApiService(apiService)
			])
		}
	})
}

export function renderVueCode(
	config: ModuleConfig,
	route: ModuleRoute,
	fields: FieldSchema[],
	api: ApiServiceField[]
) {
	console.log(config)
	console.log(route)
	console.log(fields)
	console.log(api)
}

export function printToNode(info: any) {
	console.log(info)
}
