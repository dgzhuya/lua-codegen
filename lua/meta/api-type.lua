--- @meta API
--- @class API
API = {}

--- @alias ApiFuncType 'get' | 'all' | 'delete' | 'update' | 'add' api和service的请求方法

--- @class ApiField
--- @field key ApiFuncType
--- @field noAuth true | nil
--- @field interceptor true

--- 创建请求API和服务结构体
---
--- @param key ApiFuncType 请求方法类型
--- @param noAuth true | nil 是否需要验证
--- @param interceptor true | nil 是否需要过滤数据
--- @return ApiField
function API.new(key, noAuth, interceptor) end
