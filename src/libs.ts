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
			await nest.editAppModule()
			await Promise.all([
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
		if (isReverse()) {
			vue.editDir(true)
			vue.setDatabase(route, true)
		} else {
			await vue.editDir()
			await Promise.all([
				vue.setDatabase(route),
				vue.genTsFile(fields, api),
				vue.genRoute(route),
				vue.genVueForm(config, fields),
				vue.genVueTable(config, fields)
			])
		}
	})
}

export function printToNode(info: any) {
	console.log(info)
}
