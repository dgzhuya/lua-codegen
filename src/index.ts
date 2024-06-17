import { compileToByte } from './compile'
import { existsSync } from 'fs'
import { run } from '../pkg/lua_codegen'
import { setConfig } from './config'

async function runLua(
	filePath: string,
	config?: { webDir?: string; apiDir?: string }
) {
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

export { runLua }
