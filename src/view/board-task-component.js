import { AbstractComponent } from '../framework/view/abstract-component.js';

function createBoardTemplate() {
  return `<div class="task-board"></div>`;
}

export default class TaskBoardComponent extends AbstractComponent {
  get template() {
    return createBoardTemplate();
  }
}