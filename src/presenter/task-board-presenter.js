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

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }
  init() {
    this.#renderBoard();
  }

  // Отрисовка отдельной задачи
  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  // Отрисовка списка задач по статусу
  #renderTasksList(status, container) {
    const tasksForStatus = this.#tasksModel.getTasksByStatus(status);
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
      
      // Если статус корзины, добавляем кнопку очистки после задач
      if (status === Status.BASKET) {
        const clearBasketComponent = new ClearBasketComponent({ onClick: this.clearBasket.bind(this) });
        render(clearBasketComponent, taskListComponent.element);
      }
    });
  }

  // Очистка доски 
  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }

 
  // Метод создания новой задачи через форму
  createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }
    this.#tasksModel.addTask(taskTitle);
    document.querySelector('#add-task').value = '';
  }

  // Метод для очистки корзины
  clearBasket() {
    this.#tasksModel.clearBasket();
  }


  #handleModelChange() {
    this.#clearBoard();
    this.#renderBoard();
  }

}