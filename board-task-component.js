import {createElement} from '../framework/render.js';
import TaskListComponent from './task-list-component.js';

function createTaskBoardTemplate() {
  return '<section class="columns"></section>';
}

export default class TaskBoardComponent {
  constructor() {
    this.lists = [
      {type: 'backlog', title: 'Бэклог', tasks: ['Выучить JS', 'Выучить React', 'Сделать домашку']},
      {type: 'in-progress', title: 'В процессе', tasks: ['Заплатить кварплату', 'Помыть машину']},
      {type: 'done', title: 'Готово', tasks: ['Позвонить маме', 'Поговорить с другом']},
      {type: 'trash', title: 'Корзина', tasks: ['Сходить в магазин', 'Прочитать Достоевского'], hasButton: true}
    ];
  }

  getTemplate() {
    return createTaskBoardTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      
      this.lists.forEach(list => {
        const listComponent = new TaskListComponent(list);
        this.element.append(listComponent.getElement());
      });
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}