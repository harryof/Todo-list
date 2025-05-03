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
  #loadingComponent = new LoadingViewComponent(); 
  #isInitialized = false;
  #clearBasketComponent = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

  async init() {
    const loadingComponent = new LoadingViewComponent();
    render(loadingComponent, this.#boardContainer);

    try {
      await this.#tasksModel.init();
      this.#isInitialized = true;
      
      loadingComponent.removeElement();
      
      this.#clearBoard();
      this.#renderBoard();
    } catch (error) {
      console.error('Ошибка инициализации:', error);
      
      loadingComponent.removeElement();
      
      this.#clearBoard();
      this.#boardContainer.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

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
  #renderPlaceholder(container) {
    const placeholderComponent = new PlaceholderComponent();
    render(placeholderComponent, container);
  }


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
        // Инициализируем кнопку с правильным состоянием
        const hasBasketTasks = this.#tasksModel.getTasksByStatus(Status.BASKET).length > 0;
        this.#clearBasketComponent = new ClearBasketComponent({
          onClick: this.#handleClearBasketClick.bind(this),
          isDisabled: !hasBasketTasks 
        });
        render(this.#clearBasketComponent, taskListComponent.element);
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
        this.#updateBasketButtonState();
        break;
  
      case UpdateType.INIT:
        if (!this.#isInitialized) {
          this.#isInitialized = true;
          this.#clearBoard();
          this.#renderBoard();
          this.#updateBasketButtonState();
        }
        break;
    }
  }
  


  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }


  async createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }
    
    try {
      await this.#tasksModel.addTask(taskTitle); 
      document.querySelector('#add-task').value = '';
    } catch(err) {
      console.error('Ошибка при добавлении задачи:', err);
    }
  }

  async #handleClearBasketClick() {
    try {
  
      this.#clearBasketComponent.toggleDisabled(true);
      
      await this.#tasksModel.clearBasketTasks();
      
    
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
      // Разблокируем кнопку при ошибке
      this.#updateBasketButtonState();
    }
  }


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

async #handleTaskDrop(taskId, newStatus, beforeId) {
  try {
    await this.#tasksModel.updateTaskStatus(taskId, newStatus);
    
  
    if (newStatus === Status.BASKET || 
        this.#tasksModel.getTask(taskId).status === Status.BASKET) {
      this.#updateBasketButtonState();
    }
    
  } catch(err) {
    console.error('Ошибка при обновлении статуса задачи:', err);
  }
}
}
