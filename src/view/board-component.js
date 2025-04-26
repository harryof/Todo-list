import { AbstractComponent } from '../framework/view/abstract-component.js';

function createBoardComponentTemplate() {
  return `<section class="taskboard"></section>`;
}

export default class BoardComponent extends AbstractComponent {
  get template() {
    return createBoardComponentTemplate();
  }
}