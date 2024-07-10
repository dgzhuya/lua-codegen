import { resolve } from 'path'

const CodegenConfig = {
	webDir: resolve(__dirname, '..'),
	apiDir: resolve(__dirname, '..'),
	sqliteFile: resolve(__dirname, '..', 'admin.db'),
	reverse: false
}

export type ConfigType = Omit<Partial<typeof CodegenConfig>, 'reverse'>

export function setConfig(config: ConfigType) {
	if (config.webDir) {
		CodegenConfig.webDir = config.webDir
	}
	if (config.apiDir) {
		CodegenConfig.apiDir = config.apiDir
	}
	if (config.sqliteFile) {
		CodegenConfig.sqliteFile = config.sqliteFile
	}
}

export const setReverse = (reverse: boolean) =>
	(CodegenConfig.reverse = reverse)

export const getWebDir = () => CodegenConfig.webDir
export const getApiDir = () => CodegenConfig.apiDir
export const getSqliteFile = () => CodegenConfig.sqliteFile
export const isReverse = () => CodegenConfig.reverse
