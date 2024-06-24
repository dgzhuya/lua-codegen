export type FieldSchema = {
	key: string
	comment: string
	type: 'string' | 'number' | 'bool'
}

export interface ModuleConfig {
	name: string
	comment: string
	path?: string
}

export interface ModuleRoute {
	path: string
	icon: string
	title: string
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
	length?: number
	nullable?: true
	name?: string
	dataType?: 'int' | 'datetime' | 'varchar' | 'tinyint'
}

export type ApiServiceField = {
	key: 'get' | 'all' | 'delete' | 'update' | 'add'
	interceptor?: true
	noAuth?: true
}
