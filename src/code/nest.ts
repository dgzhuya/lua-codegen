import xiu from '@/render'
import { join } from 'path'
import { reFromatFile, writeFormatFile } from '@/util'
import { existsSync, mkdirSync } from 'fs'
import { ApiServiceField, DtoField, EntityField } from '@/types'
import { DTOFromat } from '@/format/dto'
import { EntityFormat } from '@/format/entity'
import { ApiFormat } from '@/format/api'
import { ServiceFormat } from '@/format/service'
import { getApiDir } from '@/config'
import { Project, SyntaxKind } from 'ts-morph'
import { exec } from 'shelljs'

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

	constructor(name: string, path?: string) {
		this.#path = path || name
		let basePath = ''
		const apiDir = getApiDir()
		if (this.#path.includes('/')) {
			const basePaths = this.#path.split('/')
			for (let i = 0; i < basePaths.length; i++) {
				const curPath = basePaths[i]
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

		this.#name = name
		this.#moduleDir = basePath
	}

	remove() {
		if (existsSync(this.#moduleDir)) {
			exec(`rm -rf ${this.#moduleDir}`)
		}
		this.editAppModule(true)
	}

	editAppModule(isDelete = false) {
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
						console.log('text: ', text)
						const newText = text.replace(
							new RegExp(`,\\s*${moudleName}`),
							''
						)
						console.log('newText: ', newText)
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
				await source.save()
				await reFromatFile(appModuleFile)
			}
		})
		runEditTask()
	}

	async genModule() {
		const modulePath = join(this.#moduleDir, `${this.#name}.module.ts`)
		const moduleStr = await xiu.render('module', { name: this.#name })
		writeFormatFile(modulePath, moduleStr)
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
		xiu.render('controller', {
			name: this.#name,
			importInfo: apiImport,
			content: apiContent
		}).then(controllerStr => {
			writeFormatFile(controllerPath, controllerStr)
		})
		const [serviceImport, serviceContent] = new ServiceFormat(
			this.#name,
			apiService
		).format()
		xiu.render('service', {
			name: this.#name,
			content: serviceContent,
			importInfo: serviceImport
		}).then(serviceStr => {
			writeFormatFile(servicePath, serviceStr)
		})
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
		writeFormatFile(entityPath, entityStr)
	}

	async genDto(dto: DtoField[]) {
		const dtoPath = join(this.#moduleDir, 'dto')
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
