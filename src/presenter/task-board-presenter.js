import TaskBoardComponent from '../view/board-task-component.js';
import TaskListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import ClearBasketComponent from '../view/clear-button-component.js';
import { render } from '../framework/render.js';
import PlaceholderComponent from '../view/list-empty-component.js';
import { Status, StatusLabel, UpdateType, UserAction } from '../const.js';
import LoadingViewComponent from '../view/loading-view-component.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #loadingComponent = new LoadingViewComponent(); // Добавляем компонент загрузки
  #isInitialized = false;
  #clearBasketComponent = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

  async init() {
    // Создаем новый индикатор загрузки для каждого вызова
    const loadingComponent = new LoadingViewComponent();
    render(loadingComponent, this.#boardContainer);

    try {
      await this.#tasksModel.init();
      this.#isInitialized = true;
      
      // Удаляем индикатор после успешной загрузки
      loadingComponent.removeElement();
      
      this.#clearBoard();
      this.#renderBoard();
    } catch (error) {
      console.error('Ошибка инициализации:', error);
      
      // Удаляем индикатор при ошибке
      loadingComponent.removeElement();
      
      this.#clearBoard();
      this.#boardContainer.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
    }
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

  // Главная отрисовка доски
  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach(status => {
      const taskListComponent = new TaskListComponent({
        title: StatusLabel[status],
        statusClass: status,
        onTaskDrop: this.#handleTaskDrop.bind(this),
      });

      render(taskListComponent, this.#tasksBoardComponent.element);
      this.#renderTasksList(status, taskListComponent.element);

      if (status === Status.BASKET) {
        this.#clearBasketComponent = new ClearBasketComponent({
          onClick: this.#handleClearBasketClick.bind(this) // Используем новый обработчик
        });
        render(this.#clearBasketComponent, taskListComponent.element);
        this.#updateBasketButtonState();
      }
    });
  
  }
  #updateBasketButtonState() {
    if (this.#clearBasketComponent) {
      const hasBasketTasks = this.#tasksModel.getTasksByStatus(Status.BASKET).length > 0;
      this.#clearBasketComponent.toggleDisabled(!hasBasketTasks);
    }
  }
  #handleModelEvent(event, payload) {
    switch(event) {
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        this.#updateBasketButtonState(); // Обновляем состояние кнопки при изменениях
        break;

      case UpdateType.INIT:
        if (!this.#isInitialized) {
          this.#isInitialized = true;
          this.#clearBoard();
          this.#renderBoard();
        }
        break;
    }
  }

  // Очистка доски
  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }

  // Метод создания новой задачи
  async createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }
    
    try {
      await this.#tasksModel.addTask(taskTitle); // Используем новый метод модели
      document.querySelector('#add-task').value = '';
    } catch(err) {
      console.error('Ошибка при добавлении задачи:', err);
      // Можно добавить отображение ошибки пользователю
    }
  }

  async #handleClearBasketClick() {
    try {
      await this.#tasksModel.clearBasketTasks();
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
      // Можно добавить отображение ошибки пользователю
    }
  }

  // Метод для очистки корзины
  clearBasket() {
    this.#tasksModel.deleteTask(UpdateType.MAJOR, { status: Status.BASKET });
  }

  // Обработчик изменений модели
  #handleModelChange(updateType) {
    if (updateType === UpdateType.INIT && !this.#isInitialized) {
      this.#isInitialized = true;
      this.#clearBoard();
      this.#renderBoard();
      return;
    }
    this.#clearBoard();
    this.#renderBoard();
  }

  // Обработчик перетаскивания задач
  
  
  async #handleTaskDrop(taskId, newStatus, beforeId) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
      // Опционально: обработка beforeId если нужно сохранять позицию
      if (beforeId) {
        // Логика обновления позиции задачи
      }
    } catch(err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      // Можно добавить отображение ошибки пользователю
    }
  }
}