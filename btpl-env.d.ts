import '@biuxiu/template'

declare module '@biuxiu/template' {
	interface TemplateMap {
		'create-dto': CreateDto
		entity: Entity
		'update-dto': UpdateDto
	}

	interface CreateDto {
		name: string
		content: string
		import_info: string
	}

	interface UpdateDto {
		name: string
	}

	interface Entity {
		name: string
	}
}
