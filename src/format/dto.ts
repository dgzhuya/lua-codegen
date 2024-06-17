import { DtoField } from '@/types'
import { BaseFormat } from './base'

export class DTOFromat extends BaseFormat<DtoField> {
	constructor(dto: DtoField[]) {
		super(dto)
	}

	#formatType() {
		const curSchema = this.getCurSchema()
		this.content += `readonly ${curSchema.key}:${curSchema.type}\n\n`
	}

	#setSimpleRule(key: string, val?: string) {
		if (!this.importInfo.includes(`${key},`)) {
			this.importInfo += `${key},`
		}
		this.content += val ? `@${key}({ message: '${val}' })\n` : `@${key}()\n`
	}

	#max(max: number, msg: string, type: DtoField['type']) {
		if (type === 'number') {
			if (!this.importInfo.includes('Max,')) {
				this.importInfo += 'Max,'
			}
			this.content += `@Max(${max}, { message: '${msg}' })\n`
		} else if (type === 'string') {
			if (!this.importInfo.includes('MaxLength,')) {
				this.importInfo += 'MaxLength,'
			}
			this.content += `@MaxLength(${max}, { message: '${msg}' })\n`
		}
	}

	#min(min: number, msg: string, type: DtoField['type']) {
		if (type === 'number') {
			if (!this.importInfo.includes('Min,')) {
				this.importInfo += 'Min,'
			}
			this.content += `@Min(${min}, { message: '${msg}' })\n`
		} else if (type === 'string') {
			if (!this.importInfo.includes('MinLength,')) {
				this.importInfo += 'MinLength,'
			}
			this.content += `@MinLength(${min}, { message: '${msg}' })\n`
		}
	}

	#limit(max: number, min: number, msg: string, type: DtoField['type']) {
		if (type === 'number') {
			this.#max(max, msg, type)
			this.#min(min, msg, type)
		} else if (type === 'string') {
			if (!this.importInfo.includes('Length,')) {
				this.importInfo += 'Length,'
			}
			this.content += `@Length(${min}, ${max}, { message: '${msg}' })\n`
		}
	}

	#formatRule() {
		const { type, isInt, isOptional, isNumber, notEmpty, limit } =
			this.getCurSchema()

		if (isOptional) this.#setSimpleRule('IsOptional')

		if (notEmpty) this.#setSimpleRule('IsNotEmpty', notEmpty)

		if (isInt) this.#setSimpleRule('IsInt', isInt)

		if (isNumber) this.#setSimpleRule('IsNumber', isNumber)

		if (limit) {
			const { max, min, msg } = limit
			if (max !== undefined && min !== undefined) {
				this.#limit(max, min, msg, type)
			} else if (max !== undefined) {
				this.#max(max, msg, type)
			} else if (min !== undefined) {
				this.#min(min, msg, type)
			}
		}
	}

	protected formatOnceStep() {
		this.#formatRule()
		this.#formatType()
	}

	protected formatEnd() {
		if (this.importInfo) {
			this.importInfo = `import { ${this.importInfo.slice(0, this.importInfo.length - 1)} } from 'class-validator'\n`
		}
	}
}
