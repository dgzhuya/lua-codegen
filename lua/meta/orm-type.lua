--- @meta ORM
--- @class ORM
ORM = {}

--- @alias ColumnConfig 'isExclude' | 'length' | 'nullable' | 'name' 数据库表配置类型

--- 创建数据表字段特征
---
--- @param key ColumnConfig 特征名
--- @param value number | string | true 字段值
--- @return SetTblFn
function ORM.column(key, value) end

--- 创建字段表类型
---
--- @param type 'int' | 'datetime' | 'varchar' | 'tinyint' 表类型
--- @return SetTblFn
function ORM.cType(type) end

--- @class OrmField 实体字段
--- @field key string 字段名
--- @field type FieldType 字段类型
--- @field comment string 注释

--- 生成ORM字段信息
---
--- @param field BaseField 字段信息
--- @param ... SetTblFn 字段数据库类型
--- @return OrmField
function ORM.new(field, ...) end
