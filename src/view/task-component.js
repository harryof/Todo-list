import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  const { title, status } = task;
  return `
    <div class="task-item task--${status}" data-id="${task.id}">
      <p>${title}</p>
    </div>
  `;
}

export default class TaskComponent extends AbstractComponent {
  #dragAttached = false;
  
  constructor({ task }) {
    super();
    this._task = task;
  }

  get template() {
    return createTaskComponentTemplate(this._task);
  }
  get element() {
    const el = super.element;
    if (!this.#dragAttached) {
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (evt) => {
        evt.dataTransfer.setData('text/plain', this._task.id);
      });
      this.#dragAttached = true;
    }
    return el;
  }
}