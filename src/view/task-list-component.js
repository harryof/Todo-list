import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskListComponentTemplate(title, statusClass) {
  return `
    <ul class="task-category ${statusClass}">
      <h3 class="category-title">${title}</h3>
    </ul>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor({ title, statusClass, onTaskDrop }) {
    super();
    this._title = title;
    this._statusClass = statusClass;
    this._onTaskDrop = onTaskDrop;
  }

  get template() {
    return createTaskListComponentTemplate(this._title, this._statusClass);
  }
  #dropHandlers = false;
  get element() {
    const el = super.element;
    if (!this.#dropHandlers) {
      el.addEventListener('dragover', evt => evt.preventDefault());
      el.addEventListener('drop', evt => {
        evt.preventDefault();
        const taskId = evt.dataTransfer.getData('text/plain');
        const items = Array.from(el.querySelectorAll('.task-item'));
        let beforeId = null;
        for (const itemEl of items) {
          const { top, height } = itemEl.getBoundingClientRect();
          if (evt.clientY < top + height / 2) {
            beforeId = itemEl.dataset.id;
            break;
          }
        }
        this._onTaskDrop(taskId, this._statusClass, beforeId);
      });
      this.#dropHandlers = true;
    }
    return el;
  }
}