import { resolve } from 'path'
import { platform } from 'os'
import { spawn } from 'child_process'

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
	const bin = resolve(__dirname, '../lua/bin', getPathName())
	return new Promise<ArrayBuffer>((resolve, reject) => {
		const binaryData: Uint8Array[] = []
		const child = spawn(bin, ['-s', '-o', '-', filePath])
		child.stdout.on('data', data => {
			binaryData.push(data)
		})
		child.on('close', code => {
			if (code !== 0) {
				reject(`子进程退出,code=${code}`)
			} else {
				resolve(Buffer.concat(binaryData))
			}
		})
		child.on('error', err => {
			reject(err.toString())
		})
	})
}
