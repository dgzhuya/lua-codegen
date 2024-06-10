import { exec } from 'shelljs'
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

export function compileToByte(filePath: string) {
	const bin = resolve(__dirname, '../bin', getPathName())
	return new Promise<ArrayBuffer>((resolve, reject) => {
		exec(
			`${bin} -s -o - ${filePath}`,
			{ silent: true, encoding: 'buffer' },
			(code, out, err) => {
				if (code === 0) {
					resolve(out as any as Buffer)
				} else {
					reject(err.toString())
				}
			}
		)
	})
}
