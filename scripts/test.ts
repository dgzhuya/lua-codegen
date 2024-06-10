import { runLua } from '@/main'
import { resolve } from 'path'

const luaPath = resolve(__dirname, 'lua/test.lua')
runLua(luaPath)
