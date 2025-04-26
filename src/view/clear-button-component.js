import { AbstractComponent } from '../framework/view/abstract-component.js';

function createClearBasketTemplate(disabled = false) {
  return `
    <button class="clear-basket-button" ${disabled ? 'disabled' : ''}>
      Очистить корзину
    </button>
  `;
}

export default class ClearBasketComponent extends AbstractComponent {
  #handleClick = null;
  #isDisabled = false;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
  }

  get template() {
    return createClearBasketTemplate(this.#isDisabled);
  }

  // Новый метод для переключения состояния кнопки
  toggleDisabled(isDisabled) {
    if (this.#isDisabled !== isDisabled) {
      this.#isDisabled = isDisabled;
      const button = this.element.querySelector('.clear-basket-button');
      if (button) {
        button.disabled = isDisabled;
      }
    }
  }

  // Оптимизированная версия получения элемента
  get element() {
    const element = super.element;
    element.addEventListener('click', this.#handleClick);
    return element;
  }
}