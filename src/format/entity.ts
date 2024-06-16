import { EntityField } from '@/types'
import { BaseFormat } from './base'

export class EntityFormat extends BaseFormat<EntityField> {
	protected formatCurSchema(): void {}
}
