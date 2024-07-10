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
import { exec } from 'shelljs'

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
const outDir = join(rootPath, 'dist')
build({
	entryPoints: getTSFile(join(rootPath, 'src')),
	outdir: outDir,
	format: 'esm',
	tsconfig: join(rootPath, 'tsconfig.json'),
	plugins: [dtsPlugin()],
	platform: 'node'
})
	.then(() => {
		console.log('>>>build success')
		exec(
			'wasm-pack build -d dist/pkg --release',
			{
				cwd: rootPath
			},
			code => {
				if (code === 0) {
					const distPkg = join(outDir, 'pkg')
					const dts = join(distPkg, 'lua_codegen.d.ts')
					if (existsSync(dts)) {
						cpSync(dts, join(outDir, 'lua_codegen.d.ts'))
					}
					const bgWasm = join(distPkg, 'lua_codegen_bg.wasm')
					if (existsSync(bgWasm)) {
						cpSync(bgWasm, join(outDir, 'lua_codegen_bg.wasm'))
					}
					const jsFile = join(distPkg, 'lua_codegen.js')
					if (existsSync(jsFile)) {
						cpSync(jsFile, join(outDir, 'lua_codegen.js'))
					}
					const bgJsFile = join(distPkg, 'lua_codegen_bg.js')
					if (existsSync(bgJsFile)) {
						let content = readFileSync(
							bgJsFile,
							'utf-8'
						).replaceAll('@libs', './libs')
						writeFileSync(
							join(outDir, 'lua_codegen_bg.js'),
							content
						)
					}
					const indexFile = join(outDir, 'index.js')
					if (existsSync(jsFile)) {
						let content = readFileSync(indexFile, 'utf-8')
						content = content.replace(
							'import { run } from "../pkg/lua_codegen";\n',
							''
						)
						content = content.replace(
							'run(new Uint8Array(data), filePath);',
							'const { run } = await import("./lua_codegen");\n\t\t\trun(new Uint8Array(data), filePath);'
						)
						writeFileSync(indexFile, content)
					}
					console.log('>>>set file success')
					exec(`rm -rf ${distPkg}`)
					console.log('>>>clear dist pkg')
				} else {
					console.log('>>>build wasm error')
				}
			}
		)
	})
	.catch(err => {
		console.log('>>>build error start')
		console.log(err)
		console.log('>>>end')
	})
