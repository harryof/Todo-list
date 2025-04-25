import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  const { title, status } = task;
  return `
    <div class="task-item task--${status}">
      <p>${title}</p>
    </div>
  `;
}

export default class TaskComponent extends AbstractComponent {
  constructor({ task }) {
    super();
    this._task = task;
  }

  get template() {
    return createTaskComponentTemplate(this._task);
  }
}