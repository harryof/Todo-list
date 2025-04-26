import Observable from '../framework/observable.js';
import { UpdateType, UserAction, Status } from '../const.js';
import { generateId } from '../utils.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks = [];

  constructor({tasksApiService}) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardTasks;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardTasks = tasks;
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#boardTasks = [];
      this._notify(UpdateType.INIT, {error: err});
    }
  }

  async addTask(title) {
    const newTask = {
      title,
      status: Status.BACKLOG,
      id: generateId(),
    };
    
    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardTasks = [createdTask, ...this.#boardTasks];
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    const task = this.#boardTasks.find(task => task.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const previousStatus = task.status; 
    task.status = newStatus;

    try {
      const updatedTask = await this.#tasksApiService.updateTask(task);
      Object.assign(task, updatedTask);
      this._notify(UserAction.UPDATE_TASK, task);
      return task;
    } catch(err) {
      console.error('Ошибка при обновлении статуса задачи на сервер:', err);
      
      task.status = previousStatus;
      throw err;
    }
  }

  async updateTask(updateType, update) {
    const index = this.#boardTasks.findIndex(task => task.id === update.id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }

    try {
      const response = await this.#tasksApiService.updateTask(update);
      this.#boardTasks = [
        ...this.#boardTasks.slice(0, index),
        response,
        ...this.#boardTasks.slice(index + 1)
      ];
      this._notify(updateType, response);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  async deleteTask(taskId) {
    this.#boardTasks = this.#boardTasks.filter(task => task.id !== taskId);
    this._notify(UserAction.DELETE_TASK, { id: taskId });
  }

  async clearBasketTasks() {
    const basketTasks = this.#boardTasks.filter(task => task.status === Status.BASKET);

    try {
      await Promise.all(
        basketTasks.map(task => this.#tasksApiService.deleteTask(task.id))
      );

      this.#boardTasks = this.#boardTasks.filter(task => task.status !== Status.BASKET);
      this._notify(UserAction.DELETE_TASK, { status: Status.BASKET });
    } catch (err) {
      console.error('Ошибка при удалении задач из корзины на сервере:', err);
      throw err;
    }
  }
  hasBasketTasks() {
    return this.#boardTasks.some(task => task.status === Status.BASKET);
  }


  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }
}