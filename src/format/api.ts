import { ApiServiceField } from '../types'
import { BaseFormat } from './base'

export class ApiFormat extends BaseFormat<ApiServiceField> {
	#hasInterceptor = false
	#isNoAuth = false
	#moudleName: string
	#upperName: string
	#apiMap: Record<string, boolean> = {}
	#importCommon = 'Controller,'

	constructor(moduleName: string, apiService: ApiServiceField[]) {
		super(apiService)
		this.#moudleName = moduleName
		this.#upperName = moduleName[0].toUpperCase() + moduleName.slice(1)
	}

	protected formatOnceStep(): void {
		const { key, interceptor, noAuth } = this.getCurSchema()

		if (this.#apiMap[key]) {
			return
		}
		this.#apiMap[key] = true

		if (interceptor) {
			this.#hasInterceptor = true
			this.content += '\n@UseInterceptors(ClassSerializerInterceptor)\n'
		}

		if (noAuth) {
			this.#isNoAuth = true
			this.content += '\n@NoAuthToken()\n'
		}

		if (key === 'get') {
			this.content += `
				@Get(':id')
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
					return this.${this.#moudleName}Service.update(+id, update${this.#upperName}Dto)
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
		if (this.#apiMap['get']) {
			this.#importCommon += 'Get,'
		}

		if (this.#apiMap['delete']) {
			this.#importCommon += 'Delete,'
		}
		if (this.#apiMap['all']) {
			this.#importCommon += 'Query,'
			this.importInfo += `import { PageDto } from '@api/common/dto/page.dto'\n`
		}

		if (this.#apiMap['add']) {
			this.#importCommon += 'Post,'
			this.importInfo += `import { Create${this.#upperName}Dto } from './dto/create-${this.#moudleName}.dto'\n`
		}

		if (this.#apiMap['update']) {
			this.#importCommon += 'Patch,'
			this.importInfo += `import { Update${this.#upperName}Dto } from './dto/update-${this.#moudleName}.dto'\n`
		}
		if (
			this.#apiMap['get'] ||
			this.#apiMap['delete'] ||
			this.#apiMap['update']
		) {
			this.#importCommon += 'Param,'
		}
		if (this.#apiMap['add'] || this.#apiMap['update']) {
			this.#importCommon += 'Body,'
		}

		if (this.#isNoAuth) {
			this.importInfo += `import { NoAuthToken } from '@api/common/utils/passport'\n`
		}

		if (this.#hasInterceptor) {
			this.#importCommon += 'UseInterceptors,ClassSerializerInterceptor,'
		}
		this.importInfo += `import { ${this.#importCommon.slice(0, this.#importCommon.length - 1)} } from '@nestjs/common'\n`
	}
}
