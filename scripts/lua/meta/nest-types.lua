--- @meta nodejs

--- @class NestJs
NestJs = {}

--- 打印输出
function logger(...) end

--- 生成限制规则
---
--- @param max number|false 最大值
--- @param min number|false  最小值
--- @param msg string 消息提示
--- @return table
function NestJs.createLimitRule(max, min, msg) end

--- 生成简单规则
---
---@param key 'isOptional'|'notEmpty'|'isInt'|'isNumber' 规则类型
---@param msg string|true 消息提示
function NestJs.createSimpleRule(key, msg) end

--- @class DTORule

--- 生成DTO校验规则
---
---@param ... function 生成规则函数
---@return DTORule
function NestJs.createDtoRule(...) end

---@class DTOSchema
---@field key string
---@field type 'string' | 'number' | 'bool'
---@field rule DTORule

--- 生成DTO字段信息
---
---@param key string 字段名
---@param type 'string' | 'number' | 'bool' 字段类型
---@param rule DTORule 字段规则
---@return DTOSchema
function NestJs.creteDtoField(key, type, rule) end

--- 创建后端代码
---
--- @param name string 模块名
--- @param dto  DTOSchema[]  dto数据结构
function NestJs.genApiCode(name, dto) end
