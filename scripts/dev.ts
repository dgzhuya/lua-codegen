import { runLua } from '../src/index'
import { resolve } from 'path'

const luaPath = resolve(__dirname, 'lua/test.lua')
runLua(luaPath)
