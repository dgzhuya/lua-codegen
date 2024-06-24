--- @meta Base

--- @alias SetTblFn fun(tbl: table)


--- 打印输出
function logger(...) end

--- @alias FieldType 'string' | 'number' | 'bool'

--- @alias BaseField table<string,FieldType,string>

--- 创建字段信息
---
--- @param key string 字段信息
--- @param type FieldType 字段类型
--- @param comment string 字段注解
--- @param scope nil | 'd' | 'm' 字段作用域
--- @return BaseField
--- ps: (nil: 全部; d: 只作用于表单; o: 只用于表格)
function FieldNew(key, type, comment, scope) end

--- @class ModuleConfig
--- @field name string 模块名
--- @field comment string 模块注释
--- @field path? string 生成路径

--- 创建后端代码
---
--- @param config ModuleConfig 模块信息
--- @param entity OrmField[] 实体结构
--- @param dto  DtoField[]  dto结构
--- @param apiService ApiField[] 请求和服务结构
function NestRender(config, entity, dto, apiService) end

--- @class WebRoute 前端路由信息
--- @field path string 路由路径
--- @field title string 路由标题
--- @field icon string 路由图标

--- 创建后端代码
---
--- @param config ModuleConfig 模块信息
--- @param route WebRoute 路由信息
--- @param fields BaseField[] 实体结构
--- @param api ApiFuncType[] 请求和服务结构
function VueRender(config, route, fields, api) end
