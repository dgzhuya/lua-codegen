import { getWebDir } from '@/config'
import xiu from '@/render'
import { ApiServiceField, FieldSchema } from '@/types'
import { writeFormatFile } from '@/util'
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
		const apiDir = getWebDir()
		this.#name = name
		this.#moduleDir = join(apiDir, this.#path)
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
			update: apiMathods.includes('update'),
			requestImport: apiMathods.some(k =>
				['all', 'delete', 'update', 'add'].includes(k)
			)
		})
		await writeFormatFile(filePath, source)
	}
}
