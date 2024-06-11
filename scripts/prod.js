const { runLua } = require('../build')
const { resolve } = require('path')

const luaPath = resolve(__dirname, 'lua/test.lua')
runLua(luaPath)
