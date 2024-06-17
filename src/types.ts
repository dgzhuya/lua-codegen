type FieldSchema = {
	key: string
	type: 'string' | 'number' | 'bool'
}

export type DtoField = FieldSchema & {
	isOptional?: boolean
	limit?: { max?: number; min?: number; msg: string }
	notEmpty?: string
	isInt?: string
	isNumber?: string
}

export type EntityField = FieldSchema & {
	isExclude?: true
	comment?: string
	length?: number
	nullable?: true
	name?: string
	dataType?: 'int' | 'datetime' | 'varchar' | 'tinyint'
}

export type ApiService = {
	key: 'get' | 'all' | 'delete' | 'update' | 'add'
	interceptor?: true
}
