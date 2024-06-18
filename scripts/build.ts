import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import {
	readFileSync,
	readdirSync,
	statSync,
	cpSync,
	writeFileSync,
	existsSync
} from 'fs'
import { join } from 'path'
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
const outdir = join(rootPath, 'dist')
build({
	entryPoints: getTSFile(join(rootPath, 'src')),
	outdir,
	format: 'cjs',
	tsconfig: join(rootPath, 'tsconfig.json'),
	plugins: [dtsPlugin()],
	platform: 'node'
})
	.then(() => {
		console.log('>>>build success')
		const dts = join(rootPath, 'pkg/lua_codegen.d.ts')
		if (existsSync(dts)) {
			cpSync(dts, join(outdir, 'lua_codegen.d.ts'))
		}
		const bgWasm = join(rootPath, 'pkg/lua_codegen_bg.wasm')
		if (existsSync(bgWasm)) {
			cpSync(bgWasm, join(outdir, 'lua_codegen_bg.wasm'))
		}
		const jsFile = join(rootPath, 'pkg/lua_codegen.js')
		if (existsSync(jsFile)) {
			let content = readFileSync(jsFile, 'utf-8').replaceAll(
				'require(`@/libs',
				'require(`./libs'
			)
			content.replace(
				"require('path').join(__dirname, 'lua_codegen_bg.wasm')",
				"require('./lua_codegen_bg.wasm')"
			)
			writeFileSync(join(outdir, 'lua_codegen.js'), content)
		}
		const indexFile = join(outdir, 'index.js')
		if (existsSync(jsFile)) {
			const content = readFileSync(indexFile, 'utf-8').replace(
				'require("../pkg/lua_codegen")',
				'require("./lua_codegen")'
			)
			writeFileSync(indexFile, content)
		}
		console.log('>>>set file success')
	})
	.catch(err => {
		console.log('>>>build error start')
		console.log(err)
		console.log('>>>end')
	})
