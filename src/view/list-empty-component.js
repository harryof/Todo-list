import { AbstractComponent } from '../framework/view/abstract-component.js';

function createPlaceholderTemplate() {
  return `
    <div class="task-item task--empty">
      <p>Нет задач для отображения.</p>
    </div>
  `;
}

export default class PlaceholderComponent extends AbstractComponent {
  get template() {
    return createPlaceholderTemplate();
  }
}
