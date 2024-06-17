import { ApiServiceField } from '@/types'
import { BaseFormat } from './base'

export class ServiceFormat extends BaseFormat<ApiServiceField> {
	#moudleName: string
	#upperName: string
	#serviceMap: Record<string, boolean> = {}

	constructor(moduleName: string, apiService: ApiServiceField[]) {
		super(apiService)
		this.#moudleName = moduleName
		this.#upperName = moduleName[0].toUpperCase() + moduleName.slice(1)
		this.importInfo = `Body,Controller,Delete,Get,Param,Patch,Post,Query,`
	}

	protected formatOnceStep(): void {
		const { key } = this.getCurSchema()
		if (this.#serviceMap[key]) {
			return
		}
		this.#serviceMap[key] = true

		if (key === 'get') {
			this.content += `
            	query(id: number) {
		            return this.${this.#moudleName}Repository.findOneBy({ id })
	            }\n`
		} else if (key === 'all') {
			this.content += `
                async table(skip?: number, take?: number, search?: string) {
                    if (skip === undefined || take === undefined) return this.${this.#moudleName}Repository.find()

                    let queryBuilder = this.${this.#moudleName}Repository.createQueryBuilder('${this.#moudleName}')
                    if (search) {
                        queryBuilder = queryBuilder.where('${this.#moudleName}.id like :search', { search: \`%\${search}\%\` })
                    }
                    const [list, total] = await queryBuilder.skip(skip).take(take).getManyAndCount()
                    return { list, total }
                }\n`
		} else if (key === 'delete') {
			this.content += `
                delete(id: number) {
                    return this.${this.#moudleName}Repository.softDelete(id)
                }\n`
		} else if (key === 'update') {
			this.content += `
                update(id: number, update${this.#upperName}Dto: Update${this.#upperName}Dto) {
                    return this.${this.#moudleName}Repository.update(id, update${this.#upperName}Dto)
                }\n`
		} else if (key === 'add') {
			this.content += `
                create(create${this.#upperName}Dto: Create${this.#upperName}Dto) {
                    return this.${this.#moudleName}Repository.save(create${this.#upperName}Dto)
                }\n`
		}
	}
}
