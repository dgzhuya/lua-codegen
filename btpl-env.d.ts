import '@biuxiu/template'

declare module '@biuxiu/template' {
	interface TemplateMap {
		service: Service
	}

	interface Service {
		name: string
	}
}
