import { resolve } from 'path'

const CodegenConfig = {
	webDir: resolve(__dirname, '..'),
	apiDir: resolve(__dirname, '..')
}

export function setConfig(config: { webDir?: string; apiDir?: string }) {
	if (config.webDir) {
		CodegenConfig.webDir = config.webDir
	}
	if (config.apiDir) {
		CodegenConfig.apiDir = config.apiDir
	}
}

export const getWebDir = () => CodegenConfig.webDir
export const getApiDir = () => CodegenConfig.apiDir
