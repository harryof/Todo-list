import { AbstractComponent } from '../framework/view/abstract-component.js';

function createClearBasketTemplate() {
  return `<button class="clear-basket-button">Очистить корзину</button>`;
}

export default class ClearBasketComponent extends AbstractComponent {
  get template() {
    return createClearBasketTemplate();
  }
}