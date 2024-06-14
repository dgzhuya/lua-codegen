--- @meta nodejs

--- @class NodeJs
NodeJs = {}

--- @class WebRoute 前端路由信息
--- @field path string 路由路径
--- @field name string 路由名
--- @field title string 路由标题
--- @field icon string 路由图标


--- @class WebTable 前端表格信息

--- @class WebForm 前端表单信息


--- 接收路由信息，并生成前端代码
---
--- @param route WebRoute 路由信息
--- @param tbl WebTable 表展示数据
--- @param form WebForm 表单展示数据
--- @param name string 模块名,使用`.`分隔上下级模块
function NodeJs.genWebCode(route, tbl, form, name) end

--- 打印输出
function logger(...) end

--- 生成限制规则
---
--- @param max number|false 最大值
--- @param min number|false  最小值
--- @param msg string 消息提示
--- @return table
function NodeJs.createLimitRule(max, min, msg) end

--- 生成简单规则
---
---@param key 'isOptional'|'notEmpty'|'isInt'|'isNumber' 规则类型
---@param msg string|true 消息提示
function NodeJs.createSimpleRule(key, msg) end

--- @class DTORule

--- 生成DTO校验规则
---
---@param ... function 生成规则函数
---@return DTORule
function NodeJs.createDtoRule(...) end

--- @class DTOSchema

--- 生成DTO字段信息
---
---@param key string 字段名
---@param type 'string' | 'number' | 'bool' 字段类型
---@param rule DTORule 字段规则
---@return DTOSchema
function NodeJs.creteDtoField(key, type, rule) end

--- 创建后端代码
---
--- @param name string 模块名
--- @param dto  DTOSchema[]  dto数据结构
function NodeJs.genApiCode(name, dto) end
