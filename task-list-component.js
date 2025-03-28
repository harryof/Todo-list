import {createElement} from '../framework/render.js';
import TaskComponent from './task-component.js';

function createTaskListTemplate(list) {
  return `
    <article class="column ${list.type}">
      <h2>${list.title}</h2>
      <ul class="task-list"></ul>
      ${list.hasButton ? '<button class="clear-btn">× Очистить</button>' : ''}
    </article>
  `;
}

export default class TaskListComponent {
  constructor(list) {
    this.list = list;
  }

  getTemplate() {
    return createTaskListTemplate(this.list);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      const taskList = this.element.querySelector('.task-list');
      
      this.list.tasks.forEach(task => {
        const taskComponent = new TaskComponent(task);
        taskList.append(taskComponent.getElement());
      });
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}