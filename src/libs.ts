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
import { RenderVue } from './code/vue'

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

type FieldTuple = [string, FieldSchema['type'], string]

export function renderVueCode(
	config: ModuleConfig,
	route: ModuleRoute,
	fieldList: FieldTuple[],
	api: ApiServiceField[]
) {
	setTask(async () => {
		const fields = fieldList.map(([key, type, comment]) => ({
			key,
			type,
			comment
		}))
		const vue = new RenderVue(config.name, config.path)
		await Promise.all([
			vue.genTsFile(fields, api),
			vue.genRoute(route),
			vue.genVueForm(config, fields)
		])
	})
}

export function printToNode(info: any) {
	console.log(info)
}
