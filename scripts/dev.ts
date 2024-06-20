import { startGen, startRemove } from '../src/index'
import { resolve } from 'path'

const isDelete = !!process.argv.slice(2)[0]

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
if (isDelete) {
	startRemove(luaPath)
} else {
	startGen(luaPath)
}
