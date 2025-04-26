import { AbstractComponent } from '../framework/view/abstract-component.js';

function createLoadingTemplate() {
  return `
    <div class="loading">
      <p class="board__no-tasks">Loading...</p>
    </div>
  `;
}

export default class LoadingViewComponent extends AbstractComponent {
  get template() {
    return createLoadingTemplate();
  }
}