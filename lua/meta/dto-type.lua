--- @meta DTO

--- @class DTO
DTO = {}

--- @alias RuleType 'isOptional' | 'notEmpty' | 'isInt' | 'isNumber' DTO配置规则

--- 生成DTO字段长度或者数字大小
---
--- @param msg string 消息提示
--- @param min number | nil  最小值
--- @param max number | nil 最大值
--- @return SetTblFn
function DTO.limit(msg, min, max) end

--- 生成DTO
---
--- @param key RuleType 规则类型
--- @param msg string | true 消息提示
--- @return SetTblFn
function DTO.rule(key, msg) end

--- @class DtoField
--- @field key string
--- @field type FieldType
--- @field comment string

--- 生成DTO字段信息
---
--- @param field BaseField 字段基础信息
--- @param ... SetTblFn 字段规则函数
--- @return DtoField
function DTO.new(field, type, comment, ...) end
