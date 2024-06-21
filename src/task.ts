type TaskFn = {
	(): Promise<void>
}

const TaskQueue: TaskFn[] = []

export function setTask(fn: TaskFn) {
	TaskQueue.push(fn)
}

export function runTask() {
	const currentTask: TaskFn[] = []
	for (let i = 0; i < TaskQueue.length; i++) {
		const fn = TaskQueue[i]
		currentTask.push(fn)
	}
	return Promise.all(currentTask.map(f => f()))
}
