import { startRun } from '../src/index'
import { resolve } from 'path'

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
startRun(luaPath, {
	apiDir: '/Users/pinktu/Desktop/develop/wink-project/wink-vue-admin/packages/api/src'
})
