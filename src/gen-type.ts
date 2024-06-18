import { join, resolve } from 'path'
import { writeFormatFile } from './util'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

export const genLuaTypes = async (path: string) => {
	const types = ['base', 'nest', 'vue']
	const vscodePath = join(path, '.vscode')
	if (!existsSync(vscodePath)) {
		mkdirSync(vscodePath)
	}
	const moveList = types.map(t => ({
		writePath: join(vscodePath, `${t}-type.lua`),
		readPath: resolve(__dirname, `../sources/${t}-type.txt`)
	}))
	moveList.forEach(m => {
		readFile(m.readPath, 'utf-8').then(content => {
			writeFile(m.writePath, content)
		})
	})
	const settingPath = join(vscodePath, 'settings.json')
	if (existsSync(settingPath)) {
		const content = await readFile(settingPath, 'utf-8')
		if (content.length > 0) {
			const settionObj = JSON.parse(content)
			settionObj['Lua.workspace.library'] = types.map(
				t => `./${t}-type.lua`
			)
			writeFormatFile(settingPath, JSON.stringify(settionObj), true)
		}
	} else {
		writeFormatFile(
			settingPath,
			JSON.stringify({
				'Lua.workspace.library': types.map(t => `./${t}-type.lua`)
			}),
			true
		)
	}
}
