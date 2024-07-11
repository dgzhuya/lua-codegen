import LuaCodeGen from '../src/index'
import { resolve } from 'path'

const isDelete = !!process.argv.slice(2)[0]

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
const webDir =
	'/Users/pinktu/Desktop/develop/wink-project/wink-vue-admin/web/src/modules'
const apiDir =
	'/Users/pinktu/Desktop/develop/wink-project/wink-vue-admin/server/src'

if (isDelete) {
	LuaCodeGen.startRemove(luaPath, { webDir, apiDir })
		.then(list => {
			console.log('list: ', list)
		})
		.catch(err => {
			console.log('run err', err)
		})
} else {
	LuaCodeGen.startGen(luaPath, { webDir, apiDir })
		.then(list => {
			console.log('list: ', list)
		})
		.catch(err => {
			console.log('run err', err)
		})
}
