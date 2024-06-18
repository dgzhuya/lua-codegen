import { startRun } from '../src/index'
import { resolve } from 'path'

const isDelete = !!process.argv.slice(2)[0]

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
startRun(luaPath, {
	reverse: isDelete
})
