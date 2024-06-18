import { readFile, writeFile } from 'fs/promises'
import { format, resolveConfig, resolveConfigFile } from 'prettier'

export const reFromatFile = async (filePath: string) => {
	const content = await readFile(filePath, 'utf-8')
	await writeFormatFile(filePath, content)
}

export const writeFormatFile = async (
	filePath: string,
	content: string,
	isJson = false
) => {
	try {
		const file = await resolveConfigFile(filePath)
		const config = file ? await resolveConfig(file) : {}
		const formatText = await format(content, {
			...config,
			parser: isJson ? 'json' : 'typescript'
		})
		await writeFile(filePath, formatText)
	} catch (error) {
		console.log(error)
	}
}
