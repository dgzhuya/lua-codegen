import { compileToByte } from './compile'
import { existsSync } from 'fs'
import { run } from '../pkg/lua_codegen'
import { genLuaTypes } from './gen-type'
import { ConfigType, setConfig } from './config'

async function startRun(filePath: string, config?: ConfigType) {
	if (config) setConfig(config)

	if (existsSync(filePath)) {
		try {
			const data = await compileToByte(filePath)
			run(new Uint8Array(data), filePath)
		} catch (error) {
			console.error(error)
		}
	} else {
		console.error(`${filePath}文件存在`)
	}
}

export { startRun, genLuaTypes }
