import { renderTemplateSync } from '@biuxiu/template'

export function genApiCode(name: string) {
	console.log('name: ', name)
	console.log('source: ', renderTemplateSync('service', { name }))
}

export function genWebCode(name: string, val: any) {
	console.log('name=', name, ',value=', val)
}
