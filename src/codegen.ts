import xiu from './render'
import { join } from 'path'
import { writeFormatFile } from './util'
import { existsSync, mkdirSync } from 'fs'

export class GenApi {
	#path: string
	#name: string
	constructor(path: string, name: string) {
		this.#name = name
		this.#path = path
	}

	gen() {
		this.#genDto()
		this.#genEntity()
		this.#genController()
		this.#genMoudle()
		this.#genService()
	}

	async #genService() {
		const servicePath = join(this.#path, `${this.#name}.service.ts`)
		const serviceStr = await xiu.render('service', { name: this.#name })
		writeFormatFile(servicePath, serviceStr)
	}

	async #genMoudle() {
		const modulePath = join(this.#path, `${this.#name}.module.ts`)
		const moduleStr = await xiu.render('module', { name: this.#name })
		writeFormatFile(modulePath, moduleStr)
	}

	async #genController() {
		const controllerPath = join(this.#path, `${this.#name}.controller.ts`)
		const controllerStr = await xiu.render('controller', {
			name: this.#name
		})
		writeFormatFile(controllerPath, controllerStr)
	}

	async #genEntity() {
		const entityDir = join(this.#path, 'entities')
		if (!existsSync(entityDir)) {
			mkdirSync(entityDir)
		}
		const entityPath = join(entityDir, `${this.#name}.entity.ts`)
		const entityStr = await xiu.render('entity', {
			name: this.#name
		})
		writeFormatFile(entityPath, entityStr)
	}

	async #genDto() {
		const dtoPath = join(this.#path, 'dto')
		if (!existsSync(dtoPath)) {
			mkdirSync(dtoPath)
		}
		const createDtoPath = join(dtoPath, `create-${this.#name}.dto.ts`)
		const updateDtoPath = join(dtoPath, `update-${this.#name}.dto.ts`)
		const createDtoStr = await xiu.render('create-dto', {
			importInfo:
				"import { IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator'\n",
			name: this.#name,
			content: 'name:string'
		})
		const updateDtoStr = await xiu.render('update-dto', {
			name: this.#name
		})
		writeFormatFile(createDtoPath, createDtoStr)
		writeFormatFile(updateDtoPath, updateDtoStr)
	}
}
