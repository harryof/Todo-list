import { AbstractComponent } from '../framework/view/abstract-component.js';

function createFormAddTaskComponentTemplate() {
  return `
    <div class="add-task compact-mode">
      <form class="add-task__form" aria-label="Форма добавления задачи">
        <h2 class="form-title">Новая задача</h2>
        <div class="add-task__input-wrapper">
          <input type="text" name="task-name" id="add-task" placeholder="Новая задача..." required>
          <button class="add-task__button button" type="submit">
            <span>Добавить</span>
          </button>
        </div>
      </form>
    </div>
  `;
}

export default class FormAddTaskComponent extends AbstractComponent {
  get template() {
    return createFormAddTaskComponentTemplate();
  }
}