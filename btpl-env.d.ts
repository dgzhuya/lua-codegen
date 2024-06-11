import '@biuxiu/template'

declare module '@biuxiu/template' {
	interface TemplateMap {
		'create-dto': CreateDto
	}

	interface CreateDto {
		name: string
		content: string
	}
}
