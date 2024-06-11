import { writeFile } from 'fs/promises'
import { format, resolveConfig, resolveConfigFile } from 'prettier'

export const writeFormatFile = async (
	filePath: string,
	content: string,
	isJson = false
) => {
	const file = await resolveConfigFile(filePath)
	const config = file ? await resolveConfig(file) : {}
	const formatText = await format(content, {
		...config,
		parser: isJson ? 'json' : 'typescript'
	})
	writeFile(filePath, formatText)
}
