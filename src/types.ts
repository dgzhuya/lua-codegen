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
	column: {
		comment: string
		length: number
		nullable: true
	}
}
