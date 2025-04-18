import TaskBoardComponent from '../view/board-task-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import ClearBasketComponent from '../view/clear-button-component.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';
import PlaceholderComponent from '../view/list-empty-component.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  // Отрисовка отдельной задачи
  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  // Отрисовка списка задач по статусу 
  #renderTasksList(status, container) {
    const tasksForStatus = this.#boardTasks.filter(task => task.status === status);
    if (tasksForStatus.length === 0) {
      this.#renderPlaceholder(container);
    } else {
      tasksForStatus.forEach(task => {
        this.#renderTask(task, container);
      });
    }
  }

  // Отрисовка заглушки когда нет задач
  #renderPlaceholder(container) {
    const placeholderComponent = new PlaceholderComponent();
    render(placeholderComponent, container);
  }

  // Отрисовка доски задач
  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach(status => {
      const taskListComponent = new TaskListComponent({
        title: StatusLabel[status],
        statusClass: status,
      });
      render(taskListComponent, this.#tasksBoardComponent.element);

      this.#renderTasksList(status, taskListComponent.element);

      // кнопка очистки после задач
      if (status === Status.BASKET) {
        const clearBasketComponent = new ClearBasketComponent();
        render(clearBasketComponent, taskListComponent.element);
      }
    });
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }
}