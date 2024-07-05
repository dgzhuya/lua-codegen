import { XiuTemplate } from '@biuxiu/template'
import { resolve } from 'path'

const basePath = resolve(__dirname, '..')
const xiu = new XiuTemplate(basePath)

xiu.install(['up', val => val[0].toUpperCase() + val.slice(1)])

export default xiu
