export abstract class BaseFormat<T> {
	protected importInfo: string
	protected content: string
	#schemas: T[]
	#index = 0

	constructor(schemas: T[]) {
		this.#schemas = schemas
		this.content = ''
		this.importInfo = ''
	}

	#hasNext() {
		return this.#schemas.length > this.#index
	}

	protected getCurSchema() {
		return this.#schemas[this.#index]
	}

	protected formatOnceStep() {}

	protected formatEnd() {}

	format() {
		while (this.#hasNext()) {
			this.formatOnceStep()
			this.#index++
		}
		this.formatEnd()
		return [this.importInfo, this.content]
	}
}
