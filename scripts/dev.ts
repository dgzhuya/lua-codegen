import { runLua } from '../src/index'
import { resolve } from 'path'
import { setBasePath } from '@biuxiu/template'

const basePath = resolve(__dirname, '..')
setBasePath(basePath)

const luaPath = resolve(__dirname, 'lua/test.lua')
runLua(luaPath)
