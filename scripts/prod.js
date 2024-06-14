const { runLua } = require('../dist')
const { resolve } = require('path')

const luaPath = resolve(__dirname, '../lua/tests/gen_api.lua')
runLua(luaPath)
