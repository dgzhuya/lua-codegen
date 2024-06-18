import { resolve } from 'path'

const CodegenConfig = {
	webDir: resolve(__dirname, '..'),
	apiDir: resolve(__dirname, '..'),
	reverse: false
}

export type ConfigType = Partial<typeof CodegenConfig>

export function setConfig(config: ConfigType) {
	if (config.webDir) {
		CodegenConfig.webDir = config.webDir
	}
	if (config.apiDir) {
		CodegenConfig.apiDir = config.apiDir
	}
	if (config.reverse !== undefined) {
		CodegenConfig.reverse = config.reverse
	}
}

export const getWebDir = () => CodegenConfig.webDir
export const getApiDir = () => CodegenConfig.apiDir
export const isReverse = () => CodegenConfig.reverse
