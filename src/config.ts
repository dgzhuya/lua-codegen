import { resolve } from 'path'

const CodegenConfig = {
	webDir: resolve(__dirname, '..'),
	apiDir: resolve(__dirname, '..'),
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
}

export const setReverse = (reverse: boolean) =>
	(CodegenConfig.reverse = reverse)

export const getWebDir = () => CodegenConfig.webDir
export const getApiDir = () => CodegenConfig.apiDir
export const isReverse = () => CodegenConfig.reverse
