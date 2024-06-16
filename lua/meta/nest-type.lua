--- @meta NestJs

--- @class NestJs
NestJs = {}

--- @alias RuleFn fun(tbl: table)

--- 生成限制规则
---
--- @param msg string 消息提示
--- @param min number | nil  最小值
--- @param max number | nil 最大值
--- @return RuleFn
function NestJs.createLimitRule(msg, min, max) end

--- @alias SimpleRuleType 'isOptional' | 'notEmpty' | 'isInt' | 'isNumber'

--- 生成简单规则
---
--- @param key SimpleRuleType 规则类型
--- @param msg string | true 消息提示
--- @return RuleFn
function NestJs.createSimpleRule(key, msg) end

--- @class DtoField
--- @field key string
--- @field type FieldType

--- 生成DTO字段信息
---
--- @param key string 字段名
--- @param type FieldType 字段类型
--- @param ... RuleFn 字段规则函数
--- @return DtoField
function NestJs.creteDtoField(key, type, ...) end

--- 创建后端代码
---
--- @param name string 模块名
--- @param dto  DtoField[]  dto数据结构
function NestJs.genApiCode(name, dto) end
