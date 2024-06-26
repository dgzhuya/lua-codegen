import xiu from '../render'
import { join } from 'path'
import { writeFormatFile } from '../util'
import { existsSync, mkdirSync, statSync } from 'fs'
import { ApiServiceField, DtoField, EntityField } from '../types'
import { DTOFromat } from '../format/dto'
import { EntityFormat } from '../format/entity'
import { ApiFormat } from '../format/api'
import { ServiceFormat } from '../format/service'
import { getApiDir } from '../config'
import { Project, SyntaxKind } from 'ts-morph'
import { readdir, rmdir, unlink } from 'fs/promises'

const editFileQueue: (() => Promise<void>)[] = []
let isRunning = false
const runEditTask = async () => {
	if (!isRunning) {
		isRunning = true
		while (editFileQueue.length > 0) {
			const fn = editFileQueue.shift()
			if (fn) await fn()
		}
		isRunning = false
	}
}

export class RenderNest {
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
		const apiDir = getApiDir()
		this.#name = name
		this.#moduleDir = join(apiDir, this.#path)
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

	async remove() {
		if (existsSync(this.#moduleDir)) {
			await this.#deleteDir(this.#moduleDir)
		}
	}

	async editAppModule(isDelete = false) {
		if (!isDelete) {
			let basePath = ''
			const apiDir = getApiDir()
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
		editFileQueue.push(async () => {
			const moudleName = `${this.#name[0].toUpperCase() + this.#name.slice(1)}Module`
			const appModuleFile = join(getApiDir(), 'app.module.ts')
			if (existsSync(appModuleFile)) {
				const source = new Project().addSourceFileAtPath(appModuleFile)

				const moduleImport = source.getImportDeclaration(
					`./${this.#path}/${this.#name}.module`
				)
				const appModuleClass = source.getClassOrThrow('AppModule')
				const importsArray = appModuleClass
					.getDecoratorOrThrow('Module')
					.getArguments()[0]
					.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
					.getPropertyOrThrow('imports')
					.getFirstChildByKindOrThrow(
						SyntaxKind.ArrayLiteralExpression
					)
				const consumerStatement = appModuleClass
					.getMethodOrThrow('configure')
					.getStatements()[0]
				if (isDelete) {
					if (moduleImport) {
						moduleImport.remove()
					}
					importsArray.getElements().forEach((ele, index) => {
						if (ele.getText() === moudleName) {
							importsArray.removeElement(index)
						}
					})
					const text = consumerStatement.getText()
					if (text.includes(moudleName)) {
						const newText = text.replace(
							new RegExp(`,\\s*${moudleName}`),
							''
						)
						consumerStatement.replaceWithText(newText)
					}
				} else {
					if (!moduleImport) {
						source.addImportDeclaration({
							namedImports: [moudleName],
							moduleSpecifier: `./${this.#path}/${this.#name}.module`
						})
					}
					let hasModule = false
					importsArray.getElements().forEach(ele => {
						if (ele.getText() === moudleName) {
							hasModule = true
						}
					})
					if (!hasModule) {
						importsArray.addElement(moudleName)
					}
					const text = consumerStatement.getText()
					if (!text.includes(moudleName)) {
						const newText = text.replace(
							/\.forRoutes\(([^)]+)\)/,
							`.forRoutes($1, ${moudleName})`
						)
						consumerStatement.replaceWithText(newText)
					}
				}
				await writeFormatFile(appModuleFile, source.getFullText())
			}
		})
		await runEditTask()
	}

	async genModule() {
		const modulePath = join(this.#moduleDir, `${this.#name}.module.ts`)
		const moduleStr = await xiu.render('module', { name: this.#name })
		await writeFormatFile(modulePath, moduleStr)
	}

	async genApiService(apiService: ApiServiceField[]) {
		const controllerPath = join(
			this.#moduleDir,
			`${this.#name}.controller.ts`
		)
		const servicePath = join(this.#moduleDir, `${this.#name}.service.ts`)
		const [apiImport, apiContent] = new ApiFormat(
			this.#name,
			apiService
		).format()
		const [serviceImport, serviceContent] = new ServiceFormat(
			this.#name,
			apiService
		).format()
		const [controllerStr, serviceStr] = await Promise.all([
			xiu.render('controller', {
				name: this.#name,
				importInfo: apiImport,
				content: apiContent
			}),
			xiu.render('service', {
				name: this.#name,
				content: serviceContent,
				importInfo: serviceImport
			})
		])
		await Promise.all([
			writeFormatFile(controllerPath, controllerStr),
			writeFormatFile(servicePath, serviceStr)
		])
	}

	async genEntity(entity: EntityField[]) {
		const entityDir = join(this.#moduleDir, 'entities')
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
		await writeFormatFile(entityPath, entityStr)
	}

	async genDto(dto: DtoField[]) {
		const dtoPath = join(this.#moduleDir, 'dto')
		if (!existsSync(dtoPath)) {
			mkdirSync(dtoPath)
		}
		const createDtoPath = join(dtoPath, `create-${this.#name}.dto.ts`)
		const updateDtoPath = join(dtoPath, `update-${this.#name}.dto.ts`)
		const [importInfo, content] = new DTOFromat(dto).format()
		const [createDtoStr, updateDtoStr] = await Promise.all([
			xiu.render('create-dto', { importInfo, name: this.#name, content }),
			xiu.render('update-dto', { name: this.#name })
		])
		await Promise.all([
			writeFormatFile(createDtoPath, createDtoStr),
			writeFormatFile(updateDtoPath, updateDtoStr)
		])
	}
}
