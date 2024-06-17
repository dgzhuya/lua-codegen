import { ApiService } from '@/types'
import { BaseFormat } from './base'

export class ApiFormat extends BaseFormat<ApiService> {
	#hasInterceptor = false
	#moudleName: string
	#upperName: string
	#apiMap: Record<string, boolean> = {}

	constructor(moduleName: string, apiService: ApiService[]) {
		super(apiService)
		this.#moudleName = moduleName
		this.#upperName = moduleName[0].toUpperCase() + moduleName.slice(1)
		this.importInfo = `Body,Controller,Delete,Get,Param,Patch,Post,Query,`
	}

	protected formatOnceStep(): void {
		const { key, interceptor } = this.getCurSchema()

		if (this.#apiMap[key]) {
			return
		}
		this.#apiMap[key] = true

		if (interceptor) {
			this.#hasInterceptor = true
			this.content += '@UseInterceptors(ClassSerializerInterceptor)\n'
		}

		if (key === 'get') {
			this.content += `
				@Get(':id1')
				findOne(@Param('id') id: string) {
					return this.${this.#moudleName}Service.query(+id)
				}\n`
		} else if (key === 'all') {
			this.content += `
				@Get()
				findAll(@Query() pageDto: PageDto) {
					const { skip, take } = PageDto.setSkipTake(pageDto)
					return this.${this.#moudleName}Service.table(skip, take, pageDto.search)
				}\n`
		} else if (key === 'delete') {
			this.content += `
				@Delete(':id')
				remove(@Param('id') id: string) {
					return this.${this.#moudleName}Service.delete(+id)
				}\n`
		} else if (key === 'update') {
			this.content += `
				@Patch(':id')
				update(@Param('id') id: string, @Body() update${this.#upperName}Dto: Update${this.#upperName}Dto) {
					return this.${this.#moudleName}Service.update(+id, new Update${this.#upperName}Dto(update${this.#upperName}Dto))
				}\n`
		} else if (key === 'add') {
			this.content += `
				@Post()
				create(@Body() create${this.#upperName}Dto: Create${this.#upperName}Dto) {
					return this.${this.#moudleName}Service.create(create${this.#upperName}Dto)
				}\n`
		}
	}

	protected formatEnd(): void {
		if (this.#hasInterceptor) {
			this.importInfo += 'UseInterceptors,ClassSerializerInterceptor,'
		}
		this.importInfo = `import { ${this.importInfo.slice(0, this.importInfo.length - 1)} } from '@nestjs/common'`
	}
}
