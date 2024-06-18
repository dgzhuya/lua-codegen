--- @meta NestJs

--- @class NestJs
NestJs = {}

--- @alias SetTblFn fun(tbl: table)

--- 生成限制规则
---
--- @param msg string 消息提示
--- @param min number | nil  最小值
--- @param max number | nil 最大值
--- @return SetTblFn
function NestJs.createLimitRule(msg, min, max) end

--- @alias SimpleRuleType 'isOptional' | 'notEmpty' | 'isInt' | 'isNumber'

--- 生成简单规则
---
--- @param key SimpleRuleType 规则类型
--- @param msg string | true 消息提示
--- @return SetTblFn
function NestJs.createSimpleRule(key, msg) end

--- @class DtoField
--- @field key string
--- @field type FieldType

--- 生成DTO字段信息
---
--- @param key string 字段名
--- @param type FieldType 字段类型
--- @param ... SetTblFn 字段规则函数
--- @return DtoField
function NestJs.creteDtoField(key, type, ...) end

--- @alias SimpleColumnType 'isExclude' | 'comment' | 'length' | 'nullable' | 'name'

--- 创建数据表字段特征
---
--- @param key SimpleColumnType 特征名
--- @param value number | string | true 字段值
--- @return SetTblFn
function NestJs.createSimpleColumn(key, value) end

--- 创建字段表类型
---
--- @param type 'int' | 'datetime' | 'varchar' | 'tinyint' 表类型
--- @return SetTblFn
function NestJs.creteColumnType(type) end

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
function NestJs.creteEntityField(key, type, ...) end

--- @alias ApiServiceFieldKey 'get' | 'all' | 'delete' | 'update' | 'add'

--- @class ApiServiceField
--- @field key ApiServiceFieldKey
--- @field interceptor true

--- 创建请求API和服务结构体
---
--- @param key ApiServiceFieldKey
--- @param interceptor true | nil
--- @return ApiServiceField
function NestJs.createApiService(key, interceptor) end

--- @class RenderConfig
--- @field name string
--- @field path? string

--- 创建后端代码
---
--- @param config RenderConfig 模块名
--- @param dto  DtoField[]  dto数据结构
--- @param entity EntityField[] entity数据结构
--- @param apiService ApiServiceField[] entity数据结构
function NestJs.renderToCode(config, dto, entity, apiService) end
