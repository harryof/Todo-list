import { AbstractComponent } from '../framework/view/abstract-component.js';



function createClearBasketTemplate(isDisabled = false) {
  return `
    <button class="clear-basket-button" ${isDisabled ? 'disabled' : ''}>
      Очистить корзину
      ${isDisabled ? '<span class="visually-hidden">(недоступно)</span>' : ''}
    </button>
  `;
}

export default class ClearBasketComponent extends AbstractComponent {
  #handleClick = null;
  #isDisabled = false;

  constructor({ onClick, isDisabled = false }) {
    super();
    this.#handleClick = onClick;
    this.#isDisabled = isDisabled;
  }

  get template() {
    return createClearBasketTemplate(this.#isDisabled);
  }

  toggleDisabled(isDisabled) {
    if (this.#isDisabled !== isDisabled) {
      this.#isDisabled = isDisabled;
      const button = this.element.querySelector('.clear-basket-button');
      if (button) {
        button.disabled = isDisabled;
      }
    }
  }

  get element() {
    const element = super.element;
    element.addEventListener('click', this.#handleClick);
    return element;
  }
}
