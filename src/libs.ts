import { join } from 'path'
import { getApiDir } from './config'
import { existsSync, mkdirSync } from 'fs'
import { genDtoCode } from './codegen'

export function genApiCode(name: string) {
	const basePath = join(getApiDir(), name)
	if (!existsSync(basePath)) {
		mkdirSync(basePath)
	}
	genDtoCode(basePath, name)
}

export function genWebCode(name: string, val: any) {
	console.log('name=', name, ',value=', val)
}

export function printToNode(info: any) {
	console.log(info)
}
