import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskListComponentTemplate(title, statusClass) {
  return `
    <ul class="task-category ${statusClass}">
      <h3 class="category-title">${title}</h3>
    </ul>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor({ title, statusClass }) {
    super();
    this._title = title;
    this._statusClass = statusClass;
  }

  get template() {
    return createTaskListComponentTemplate(this._title, this._statusClass);
  }
}