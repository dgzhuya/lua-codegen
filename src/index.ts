import { compileToByte } from './compile'
import { existsSync } from 'fs'
import { run } from '../pkg/lua_codegen'
import { genLuaTypes } from './gen-type'
import { ConfigType, setConfig, setReverse } from './config'
import { runTask } from './task'
import { ModuleRoute } from './types'

function startRun(isDelete: boolean) {
	return async function (filePath: string, config?: ConfigType) {
		if (config) setConfig(config)
		setReverse(isDelete)
		if (existsSync(filePath)) {
			try {
				const data = await compileToByte(filePath)
				run(new Uint8Array(data), filePath)
				return (await runTask()).filter(c => !!c) as ModuleRoute[]
			} catch (error) {
				return Promise.reject(error)
			}
		} else {
			return Promise.reject(`${filePath}文件存在`)
		}
	}
}

export default {
	startGen: startRun(false),
	startRemove: startRun(true),
	genLuaTypes
}
