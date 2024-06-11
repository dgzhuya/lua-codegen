import { resolve } from 'path'

const CodegenConfig = {
	webDir: resolve(__dirname, '..'),
	apiDir: resolve(__dirname, '..')
}

export function setConfig(webDir: string, apiDir: string) {
	CodegenConfig.webDir = webDir
	CodegenConfig.apiDir = apiDir
}

export const getWebDir = () => CodegenConfig.webDir
export const getApiDir = () => CodegenConfig.apiDir
