--- @meta Nest

--- @class Nest
Nest = {}

--- @alias SetTblFn fun(tbl: table)

--- 生成DTO字段长度或者数字大小
---
--- @param msg string 消息提示
--- @param min number | nil  最小值
--- @param max number | nil 最大值
--- @return SetTblFn
function Nest.limit(msg, min, max) end

--- @alias SimpleRuleType 'isOptional' | 'notEmpty' | 'isInt' | 'isNumber'

--- 生成DTO
---
--- @param key SimpleRuleType 规则类型
--- @param msg string | true 消息提示
--- @return SetTblFn
function Nest.rule(key, msg) end

--- @class DtoField
--- @field key string
--- @field type FieldType

--- 生成DTO字段信息
---
--- @param key string 字段名
--- @param type FieldType 字段类型
--- @param ... SetTblFn 字段规则函数
--- @return DtoField
function Nest.dto(key, type, ...) end

--- @alias SimpleColumnType 'isExclude' | 'comment' | 'length' | 'nullable' | 'name'

--- 创建数据表字段特征
---
--- @param key SimpleColumnType 特征名
--- @param value number | string | true 字段值
--- @return SetTblFn
function Nest.column(key, value) end

--- 创建字段表类型
---
--- @param type 'int' | 'datetime' | 'varchar' | 'tinyint' 表类型
--- @return SetTblFn
function Nest.cType(type) end

--- @class EntityField
--- @field key string
--- @field type FieldType
--- @field column number

--- 生成Entity字段信息
---
--- @param key string 字段名
--- @param type FieldType 字段类型
--- @param ... SetTblFn 字段数据库类型
--- @return EntityField
function Nest.entity(key, type, ...) end

--- @alias ServiceFieldKey 'get' | 'all' | 'delete' | 'update' | 'add'

--- @class ServiceField
--- @field key ServiceFieldKey
--- @field interceptor true

--- 创建请求API和服务结构体
---
--- @param key ServiceFieldKey 请求方法类型
--- @param noAuth true | nil 是否需要验证
--- @param interceptor true | nil 是否需要过滤数据
--- @return ServiceField
function Nest.service(key, noAuth, interceptor) end

--- @class RenderConfig
--- @field name string
--- @field path? string

--- 创建后端代码
---
--- @param config RenderConfig 模块名
--- @param entity EntityField[] entity数据结构
--- @param dto  DtoField[]  dto数据结构
--- @param apiService ServiceField[] entity数据结构
function Nest.render(config, entity, dto, apiService) end
