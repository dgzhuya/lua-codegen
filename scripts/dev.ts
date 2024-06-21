import LuaCodeGen from '../src/index'
import { resolve } from 'path'

const isDelete = !!process.argv.slice(2)[0]

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
if (isDelete) {
	LuaCodeGen.startRemove(luaPath).catch(err => {
		console.log('run err', err)
	})
} else {
	LuaCodeGen.startGen(luaPath).catch(err => {
		console.log('run err', err)
	})
}
