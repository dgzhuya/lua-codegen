import { XiuTemplate } from '@biuxiu/template'
import { resolve } from 'path'

const basePath = resolve(__dirname, '..')
const render = new XiuTemplate(basePath)

render.install(() => ({
	name: 'up',
	fn: val => val[0].toUpperCase() + val.slice(1)
}))

export default render
