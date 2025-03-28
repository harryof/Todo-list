import {createElement} from '../framework/render.js';

function createHeaderTemplate() {
  return `
    <header class="header">
      <h1>Список задач</h1>
    </header>
  `;
}

export default class HeaderComponent {
  getTemplate() {
    return createHeaderTemplate();
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