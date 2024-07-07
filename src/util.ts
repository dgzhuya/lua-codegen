import { writeFile } from 'fs/promises'
import {
	BuiltInParserName,
	LiteralUnion,
	format,
	resolveConfig,
	resolveConfigFile
} from 'prettier'

export const writeFormatFile = async (
	filePath: string,
	content: string,
	parser: LiteralUnion<BuiltInParserName> = 'typescript'
) => {
	try {
		const file = await resolveConfigFile(filePath)
		const config = file ? await resolveConfig(file) : {}
		const formatText = await format(content, {
			...config,
			parser
		})
		await writeFile(filePath, formatText)
	} catch (error) {
		return Promise.reject(error)
	}
}
