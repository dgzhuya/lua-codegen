import { existsSync } from 'fs'
import { exec } from 'shelljs'
import { resolve } from 'path'

const args = process.argv.slice(2)

if (args[0]) {
	const [type, val] = args[0].split('=')
	if (type == 'name') {
		const path = resolve(__dirname, '..', val)
		if (existsSync(path)) {
			exec(`rm -rf ${path}`, (code, _, err) => {
				if (code === 0) {
					console.log(`>>>清理模块 ${val} 完成`)
				} else {
					console.log(err)
				}
			})
		} else {
			console.log('>>>文件不存在')
		}
	}
}
