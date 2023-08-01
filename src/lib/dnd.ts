export function draggable(node: HTMLElement, data: string) {
	let state = data;

	node.draggable = true;
	node.style.cursor = 'grab';

	function handle_dragstart(e: DragEvent) {
		e.dataTransfer?.setData('text/plain', state);
	}

	node.addEventListener('dragstart', handle_dragstart);

	return {
		update(data: string) {
			state = data;
		},
		destroy() {
			node.removeEventListener('dragstart', handle_dragstart);
		}
	};
}

interface DroppableOptions {
	dropzoneClass: string;
	dropEffect?: 'move' | 'none' | 'copy' | 'link';
	dragoverClass: string;
	on_drop: (data: string, e: DragEvent) => void;
}

function default_on_drop(data: string, e: DragEvent) {
	console.log(data);
}

export function dropzone(node: Element, options: DroppableOptions) {
	let state = {
		dropzoneClass: options.dropzoneClass,
		dropEffect: options?.dropEffect || 'move',
		dragoverClass: options.dragoverClass,
		on_drop: options?.on_drop || default_on_drop
	};

	function handle_dragenter(e: DragEvent) {
		e.preventDefault();

		const target = e.target as HTMLElement;
		const dropzoneElement = target.closest(`.${state.dropzoneClass}`);
		if (dropzoneElement) {
			if (!dropzoneElement.classList.contains(state.dragoverClass)) {
				dropzoneElement.classList.add(state.dragoverClass);
			}
		}
	}

	function handle_dragleave(e: DragEvent) {
		e.preventDefault();

		const target = e.target as HTMLElement;

		const dropzoneElement = target.closest(`.${state.dropzoneClass}`);

		if (dropzoneElement) {
			if (dropzoneElement.classList.contains(state.dragoverClass)) {
				dropzoneElement.classList.remove(state.dragoverClass);
			}
		}
	}

	function handle_dragover(e: DragEvent) {
		e.preventDefault();

		const target = e.target as HTMLElement;
		const dropzoneElement = target.closest(`.${state.dropzoneClass}`);
		if (dropzoneElement) {
			if (!dropzoneElement.classList.contains(state.dragoverClass)) {
				dropzoneElement.classList.add(state.dragoverClass);
			}

			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = state.dropEffect;
			}
		}
	}

	function handle_drop(e: DragEvent) {
		e.preventDefault();
		const data = e.dataTransfer?.getData('text/plain');
		const target = e.target as HTMLElement;
		const dropzoneElement = target.closest(`.${state.dropzoneClass}`);
		if (dropzoneElement) {
			if (dropzoneElement.classList.contains(state.dragoverClass)) {
				dropzoneElement.classList.remove(state.dragoverClass);
			}
			if (data) {
				state.on_drop(data, e);
			}
		}
	}

	node.addEventListener('dragenter', handle_dragenter as EventListener);
	node.addEventListener('dragleave', handle_dragleave as EventListener);
	node.addEventListener('dragover', handle_dragover as EventListener);
	node.addEventListener('drop', handle_drop as EventListener);

	return {
		update(options: DroppableOptions) {
			state = {
				dropzoneClass: options.dropzoneClass,
				dropEffect: options?.dropEffect || 'move',
				dragoverClass: options.dragoverClass,
				on_drop: options?.on_drop || default_on_drop
			};
		},
		destroy() {
			node.removeEventListener('dragenter', handle_dragenter as EventListener);
			node.removeEventListener('dragleave', handle_dragleave as EventListener);
			node.removeEventListener('dragover', handle_dragover as EventListener);
			node.removeEventListener('drop', handle_drop as EventListener);
		}
	};
}
