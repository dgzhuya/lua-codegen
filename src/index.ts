import { compileToByte } from './compile'
import { existsSync } from 'fs'
import { run } from '../pkg/lua_codegen'
import { genLuaTypes } from './gen-type'
import { ConfigType, setConfig, setReverse } from './config'

async function startRun(
	filePath: string,
	isDelete: boolean,
	config?: ConfigType
) {
	if (config) setConfig(config)
	setReverse(isDelete)

	if (existsSync(filePath)) {
		try {
			const data = await compileToByte(filePath)
			run(new Uint8Array(data), filePath)
		} catch (error) {
			return Promise.reject(error)
		}
	} else {
		return Promise.reject(`${filePath}文件存在`)
	}
}

const startGen = (filePath: string, config?: ConfigType) => {
	return startRun(filePath, false, config)
}

const startRemove = (filePath: string, config?: ConfigType) => {
	return startRun(filePath, true, config)
}

export { startGen, startRemove, genLuaTypes }
