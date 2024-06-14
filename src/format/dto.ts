import { DTOSchema, ValidatorRule } from '@/types'

export class DTOFromat {
	#importInfo: string
	#content: string
	#schemas: DTOSchema[]
	#index = 0

	constructor(schemas: DTOSchema[]) {
		this.#schemas = schemas
		this.#importInfo = ''
		this.#content = ''
	}

	#addImportStr() {
		return this.#importInfo
			? `import { ${this.#importInfo.slice(0, this.#importInfo.length - 1)} } from 'class-validator'\n`
			: ''
	}

	#hasNext() {
		return this.#schemas.length > this.#index
	}

	#formatType(curSchema: DTOSchema) {
		this.#content += `readonly ${curSchema.key}:${curSchema.type}\n\n`
	}

	#setSimpleRule(key: string, val?: string) {
		if (!this.#importInfo.includes(`${key},`)) {
			this.#importInfo += `${key},`
		}
		this.#content += val
			? `@${key}({ message: '${val}' })\n`
			: `@${key}()\n`
	}

	#max(max: number, msg: string, type: DTOSchema['type']) {
		if (type === 'number') {
			if (!this.#importInfo.includes('Max,')) {
				this.#importInfo += 'Max,'
			}
			this.#content += `@Max(${max}, { message: '${msg}' })\n`
		} else if (type === 'string') {
			if (!this.#importInfo.includes('MaxLength,')) {
				this.#importInfo += 'MaxLength,'
			}
			this.#content += `@MaxLength(${max}, { message: '${msg}' })\n`
		}
	}

	#min(min: number, msg: string, type: DTOSchema['type']) {
		if (type === 'number') {
			if (!this.#importInfo.includes('Min,')) {
				this.#importInfo += 'Min,'
			}
			this.#content += `@Min(${min}, { message: '${msg}' })\n`
		} else if (type === 'string') {
			if (!this.#importInfo.includes('MinLength,')) {
				this.#importInfo += 'MinLength,'
			}
			this.#content += `@MinLength(${min}, { message: '${msg}' })\n`
		}
	}

	#limit(max: number, min: number, msg: string, type: DTOSchema['type']) {
		if (type === 'number') {
			this.#max(max, msg, type)
			this.#min(min, msg, type)
		} else if (type === 'string') {
			if (!this.#importInfo.includes('Length,')) {
				this.#importInfo += 'Length,'
			}
			this.#content += `@Length(${min}, ${max}, { message: '${msg}' })\n`
		}
	}

	#formatRule(rule: ValidatorRule, type: DTOSchema['type']) {
		if (rule.isOptional) this.#setSimpleRule('IsOptional')

		if (rule.notEmpty) this.#setSimpleRule('IsNotEmpty', rule.notEmpty)

		if (rule.isInt) this.#setSimpleRule('IsInt', rule.isInt)

		if (rule.isNumber) this.#setSimpleRule('IsNumber', rule.isNumber)

		if (rule.limit) {
			const { max, min, msg } = rule.limit
			if (max !== undefined && min !== undefined) {
				this.#limit(max, min, msg, type)
			} else if (max !== undefined) {
				this.#max(max, msg, type)
			} else if (min !== undefined) {
				this.#min(min, msg, type)
			}
		}
	}

	#formatCurSchema() {
		const curSchema = this.#schemas[this.#index]
		if (curSchema.rule) {
			this.#formatRule(curSchema.rule, curSchema.type)
		}
		this.#formatType(curSchema)
	}

	format() {
		while (this.#hasNext()) {
			this.#formatCurSchema()
			this.#index++
		}
		return [this.#addImportStr(), this.#content]
	}
}
