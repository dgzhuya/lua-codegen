import { EntityField } from '@/types'
import { BaseFormat } from './base'

export class EntityFormat extends BaseFormat<EntityField> {
	#columnStr = ''

	constructor(entity: EntityField[]) {
		super(entity)
	}

	protected formatCurSchema(): void {
		const {
			key,
			type,
			isExclude,
			comment,
			nullable,
			dataType,
			name,
			length
		} = this.getCurSchema()
		if (isExclude) {
			if (!this.importInfo) {
				this.importInfo +=
					"import { Exclude } from 'class-transformer'\n"
			}
			this.content += '@Exclude()\n'
		}

		if (name) this.#columnStr += `name: '${name}',`

		if (comment) this.#columnStr += `comment: '${comment}',`

		if (nullable) this.#columnStr += `nullable: true,`

		if (dataType) this.#columnStr += `type: '${dataType}',`

		if (length) this.#columnStr += `length: '${length}',`

		if (this.#columnStr) {
			this.content += `@Column({ ${this.#columnStr.slice(0, this.#columnStr.length - 1)} })\n`
		} else {
			this.content += `@Column()\n`
		}
		this.#columnStr = ''
		this.content += `${key}:${type}\n\n`
	}
}
