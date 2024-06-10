import { getCompilerPath } from 'bin'
import { exec } from 'shelljs'

export function compileToByte(filePath: string) {
	const bin = getCompilerPath()
	return new Promise<ArrayBuffer>((resolve, reject) => {
		exec(
			`${bin} -s -o - ${filePath}`,
			{ silent: true, encoding: 'buffer' },
			(code, out, err) => {
				if (code === 0) {
					resolve(out as any as Buffer)
				} else {
					reject(err)
				}
			}
		)
	})
}
