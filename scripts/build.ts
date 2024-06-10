import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { cwd } from 'process'

const rootPath = cwd()

export const getTSFile = (path: string) => {
	const entrys: string[] = []
	const fileList = readdirSync(path)
	for (const file of fileList) {
		const fullPath = join(path, file)
		if (statSync(fullPath).isDirectory()) {
			if (file !== 'bin') entrys.push(...getTSFile(fullPath))
		} else {
			if (/\^*.ts$/.test(file) && file !== 'lua_codegen.d.ts') {
				entrys.push(fullPath)
			}
		}
	}
	return entrys
}

build({
	entryPoints: getTSFile(join(rootPath, 'src')),
	outdir: join(rootPath, 'dist'),
	format: 'cjs',
	tsconfig: join(rootPath, 'tsconfig.json'),
	plugins: [dtsPlugin()],
	platform: 'node'
})
	.then(() => {
		console.log('>>>build success')
		const banner = `require('module-alias/register');require('module-alias').addAliases({'@dist': require('path').resolve(__dirname)});\n`
		const path = resolve(rootPath, 'dist/index.js')
		const content = readFileSync(path, 'utf-8')
		writeFileSync(path, banner + content)
		console.log('>>>add banner success')
	})
	.catch(err => {
		console.log('err: ', err)
	})
