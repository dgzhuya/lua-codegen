import '@biuxiu/template'

declare module '@biuxiu/template' {
	interface TemplateMap {
		'create-dto': CreateDto
		'update-dto': UpdateDto
	}

	interface CreateDto {
		name: string
		content: string
	}

	interface UpdateDto {
		name: string
	}
}
