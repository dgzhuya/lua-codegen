import { runLua } from '../src/index'
import { resolve } from 'path'

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
runLua(luaPath)
