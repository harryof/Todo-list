import {createElement} from '../framework/render.js';

function createAddTaskTemplate() {
  return `
    <form class="task-input" id="taskForm">
      <input type="text" id="taskInput" placeholder="Название задачи..." required>
      <button type="submit">+ Добавить</button>
    </form>
  `;
}

export default class AddTaskComponent {
  getTemplate() {
    return createAddTaskTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}