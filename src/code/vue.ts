import { getSqliteFile, getWebDir } from '../config'
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
import Database from 'better-sqlite3'

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

	#findIdByKey(key: string, select: Database.Statement) {
		const result = select.get(key) as { id: number | bigint }
		return result ? result.id : undefined
	}

	async setDatabase(route: ModuleRoute, isDelete = false) {
		const sqliteFile = getSqliteFile()
		if (!existsSync(sqliteFile)) {
			return
		}
		const db = new Database(sqliteFile)
		const selectStmt = db.prepare(
			`SELECT id FROM w_permission WHERE key = ?`
		)
		const insertStmt = db.prepare(
			`INSERT INTO w_permission (title, key, description, pid) VALUES (@title, @key, @description, @pid)`
		)

		const deleteStmt = db.prepare(`DELETE FROM w_permission WHERE key = ?`)

		const hasPremissionTbl = db
			.prepare(
				`SELECT name FROM sqlite_master WHERE type='table' AND name=?`
			)
			.get('w_permission')
		if (!hasPremissionTbl) {
			return Promise.reject('权限表不存在')
		}
		const pathList = route.path.split('/').filter(p => p)
		const prefixKey =
			pathList.length > 1 ? '#' + pathList[0].replaceAll('-', '_') : ''

		let pid: null | number | bigint = null
		if (prefixKey) {
			const id = this.#findIdByKey(prefixKey, selectStmt)
			if (!id) return Promise.reject(`父级权限${prefixKey}不存在`)
			pid = id
		}
		const key = '#' + pathList.join('_').replaceAll('-', '_')

		let fn: Database.Transaction<() => void>
		if (isDelete) {
			const list = ['@add', '@update', '@delete'].map(k => key + k)
			fn = db.transaction(() => {
				for (const k of list) {
					deleteStmt.run(k)
				}
				deleteStmt.run(key)
			})
		} else {
			const keyId = this.#findIdByKey(key, selectStmt)
			if (keyId) return Promise.reject(`当前权限${key}已存在`)
			const list = [
				{ k: '@add', title: '添加' },
				{ k: '@update', title: '修改' },
				{ k: '@delete', title: '删除' }
			].map(({ k, title }) => ({
				title: title + route.title,
				key: key + k,
				description: title + route.title + '信息'
			}))
			fn = db.transaction(() => {
				const { lastInsertRowid } = insertStmt.run({
					key,
					title: route.title,
					description: `${route.title}页面查看`,
					pid
				})
				for (const item of list) {
					insertStmt.run({ ...item, pid: lastInsertRowid })
				}
			})
		}
		try {
			fn()
		} catch (error) {
			return Promise.reject(error)
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
