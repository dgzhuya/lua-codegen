import xiu from '@/render'
import { join } from 'path'
import { writeFormatFile } from '@/util'
import { existsSync, mkdirSync } from 'fs'
import { ApiService, DtoField, EntityField } from '@/types'
import { DTOFromat } from '@/format/dto'
import { EntityFormat } from '@/format/entity'
import { ApiFormat } from '@/format/api'
import { ServiceFormat } from '@/format/service'

export class GenApi {
	#path: string
	#name: string
	constructor(path: string, name: string) {
		this.#name = name
		this.#path = path
	}

	async genModule() {
		const modulePath = join(this.#path, `${this.#name}.module.ts`)
		const moduleStr = await xiu.render('module', { name: this.#name })
		writeFormatFile(modulePath, moduleStr)
	}

	async genApiService(apiService: ApiService[]) {
		const controllerPath = join(this.#path, `${this.#name}.controller.ts`)
		const servicePath = join(this.#path, `${this.#name}.service.ts`)
		const [apiImport, apiContent] = new ApiFormat(
			this.#name,
			apiService
		).format()
		xiu.render('controller', {
			name: this.#name,
			importInfo: apiImport,
			content: apiContent
		}).then(controllerStr => {
			writeFormatFile(controllerPath, controllerStr)
		})
		const [_, serviceContent] = new ServiceFormat(
			this.#name,
			apiService
		).format()
		xiu.render('service', {
			name: this.#name,
			content: serviceContent
		}).then(serviceStr => {
			writeFormatFile(servicePath, serviceStr)
		})
	}

	async genEntity(entity: EntityField[]) {
		const entityDir = join(this.#path, 'entities')
		if (!existsSync(entityDir)) {
			mkdirSync(entityDir)
		}
		const entityPath = join(entityDir, `${this.#name}.entity.ts`)
		const [importInfo, content] = new EntityFormat(entity).format()
		const entityStr = await xiu.render('entity', {
			name: this.#name,
			importInfo,
			content
		})
		writeFormatFile(entityPath, entityStr)
	}

	async genDto(dto: DtoField[]) {
		const dtoPath = join(this.#path, 'dto')
		if (!existsSync(dtoPath)) {
			mkdirSync(dtoPath)
		}
		const createDtoPath = join(dtoPath, `create-${this.#name}.dto.ts`)
		const updateDtoPath = join(dtoPath, `update-${this.#name}.dto.ts`)
		const [importInfo, content] = new DTOFromat(dto).format()
		const createDtoStr = await xiu.render('create-dto', {
			importInfo,
			name: this.#name,
			content
		})
		const updateDtoStr = await xiu.render('update-dto', {
			name: this.#name
		})
		writeFormatFile(createDtoPath, createDtoStr)
		writeFormatFile(updateDtoPath, updateDtoStr)
	}
}
