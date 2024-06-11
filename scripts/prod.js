const { runLua } = require('../dist')
const { resolve } = require('path')

const luaPath = resolve(__dirname, 'lua/test.lua')
runLua(luaPath)
