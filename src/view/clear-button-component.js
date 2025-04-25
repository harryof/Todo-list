import { AbstractComponent } from '../framework/view/abstract-component.js';

function createClearBasketTemplate() {
  return `<button class="clear-basket-button">Очистить корзину</button>`;
}

export default class ClearBasketComponent extends AbstractComponent {
  #handleClick = null;
  #eventAttached = false;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
  }

  get template() {
    return createClearBasketTemplate();
  }

  get element() {
    const el = super.element;
    if (!this.#eventAttached) {
      el.addEventListener('click', this.#handleClick);
      this.#eventAttached = true;
    }
    return el;
  }
}
