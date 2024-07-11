import { getWebDir } from '../config'
import xiu from '../render'
import {
	ApiServiceField,
	FieldSchema,
	ModuleConfig,
	ModuleRoute
} from '../types'
import { writeFormatFile } from '../util'
import { existsSync, mkdirSync, statSync } from 'fs'
import { readdir, rmdir, unlink } from 'fs/promises'
import { join } from 'path'

export class RenderVue {
	#moduleDir: string
	#name: string
	#path: string

	#formatPath(path: string) {
		return path
			.split('/')
			.filter(p => p)
			.join('/')
	}

	constructor(name: string, path?: string) {
		this.#path = path
			? path.endsWith('/')
				? `${this.#formatPath(path)}/${name}`
				: this.#formatPath(path)
			: name
		const webDir = getWebDir()
		this.#name = name
		this.#moduleDir = join(webDir, this.#path)
	}

	async #deleteDir(path: string) {
		const files = await readdir(path)
		for (let i = 0; i < files.length; i++) {
			const filePath = join(path, files[i])
			if (statSync(filePath).isDirectory()) {
				await this.#deleteDir(filePath)
			} else {
				await unlink(filePath)
			}
		}
		await rmdir(path)
	}

	async editDir(isDelete = false) {
		if (isDelete) {
			if (existsSync(this.#moduleDir)) {
				await this.#deleteDir(this.#moduleDir)
			}
		} else {
			let basePath = ''
			const apiDir = getWebDir()
			if (this.#path.includes('/')) {
				const pathArr = this.#path.split('/')
				for (let i = 0; i < pathArr.length; i++) {
					const curPath = pathArr[i]
					if (i === 0) {
						basePath = join(apiDir, curPath)
					} else {
						basePath = join(basePath, curPath)
					}
					if (!existsSync(basePath)) {
						mkdirSync(basePath)
					}
				}
			} else {
				basePath = join(apiDir, this.#path)
				if (!existsSync(basePath)) {
					mkdirSync(basePath)
				}
			}
		}
	}

	async genRoute(route: ModuleRoute) {
		const filePath = join(this.#moduleDir, 'meta.json')
		const source = await xiu.render('route-mata', route)
		await writeFormatFile(filePath, source, 'json')
	}

	async genVueTable({ name, comment }: ModuleConfig, fields: FieldSchema[]) {
		const filePath = join(this.#moduleDir, 'index.vue')
		const source = await xiu.render('index-vue', {
			name,
			comment,
			fields
		})
		await writeFormatFile(filePath, source, 'vue')
	}

	async genVueForm(config: ModuleConfig, fields: FieldSchema[]) {
		const filePath = join(this.#moduleDir, 'form.vue')
		const source = await xiu.render('form-vue', {
			name: config.name,
			comment: config.comment,
			fields: fields.map(f => ({
				...f,
				isNumber: f.type === 'number',
				isString: f.type === 'string'
			}))
		})
		await writeFormatFile(filePath, source, 'vue')
	}

	async genTsFile(fields: FieldSchema[], api: ApiServiceField[]) {
		const apiMathods = api.map(a => a.key)
		const filePath = join(this.#moduleDir, 'fetch-type.ts')
		const source = await xiu.render('fetch-type', {
			name: this.#name,
			filedList: fields,
			add: apiMathods.includes('add'),
			delete: apiMathods.includes('delete'),
			all: apiMathods.includes('all'),
			update: apiMathods.includes('update')
		})
		await writeFormatFile(filePath, source)
	}
}
