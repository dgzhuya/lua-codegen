import { resolve } from 'path'
import { platform } from 'os'

const getPathName = () => {
	switch (platform()) {
		case 'win32':
			return 'win/luac.exe'
		case 'linux':
			return 'linux/luac'
		case 'darwin':
			return 'mac/luac'
		default:
			throw Error('不支持的操作系统')
	}
}

export const getCompilerPath = () => {
	return resolve(__dirname, getPathName())
}
