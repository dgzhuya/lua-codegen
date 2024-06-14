export type ValidatorRule = {
	isOptional?: boolean
	limit?: { max?: number; min?: number; msg: string }
	notEmpty?: string
	isInt?: string
	isNumber?: string
}

export type DTOSchema = {
	key: string
	type: 'string' | 'number' | 'bool'
	rule?: ValidatorRule
}
