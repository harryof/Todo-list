import { createElement } from '../framework/render.js';
import TaskComponent from './task-component.js';
import ClearButtonComponent from './clear-button-component.js'; 

function createTaskListTemplate(list) {
  return `
    <article class="column ${list.type}">
      <h2>${list.title}</h2>
      <ul class="task-list"></ul>
      <div class="button-container"></div> <!-- Добавили контейнер для кнопки -->
    </article>
  `;
}

export default class TaskListComponent {
  constructor(list) {
    this.list = list;
    this.element = null;
    this.clearButtonComponent = list.hasButton ? new ClearButtonComponent() : null;
  }

  getTemplate() {
    return createTaskListTemplate(this.list);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      const taskList = this.element.querySelector('.task-list');
      
      
      this.list.tasks.forEach(task => {
        const taskComponent = new TaskComponent({ task });
        taskList.append(taskComponent.getElement());
      });

      
      if (this.clearButtonComponent) {
        const buttonContainer = this.element.querySelector('.button-container');
        buttonContainer.append(this.clearButtonComponent.getElement());
      }
    }
    return this.element;
  }

  removeElement() {
    if (this.clearButtonComponent) {
      this.clearButtonComponent.removeElement();
    }
    this.element = null;
  }
}