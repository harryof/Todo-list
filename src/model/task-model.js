import { tasks } from "../mock/task.js";
import { generateID } from "../utils.js";

export default class TasksModel {

  #boardTasks = tasks;

  #observers = [];

  get tasks() {
    return this.#boardTasks;
  }

  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }

  updateTaskStatus(taskId, newStatus, beforeId = null) {
    const idx = this.#boardTasks.findIndex(t => t.id === taskId);
    if (idx === -1) return;
    const [task] = this.#boardTasks.splice(idx, 1);
    task.status = newStatus;
    if (beforeId) {
      let insertAt = 0;
      for (const t of this.#boardTasks) {
        if (t.id === beforeId) break;
        insertAt++;
      }
      this.#boardTasks.splice(insertAt, 0, task);
    } else {
      this.#boardTasks.push(task);
    }
    this._notifyObservers();
  }

  addTask(title) {
    const newTask = {
      id: generateID(),
      title,
      status: 'backlog'
    };
    this.#boardTasks.push(newTask);
    this._notifyObservers();
    return newTask;
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter(obs => obs !== observer);
  }

  _notifyObservers() {
    this.#observers.forEach(observer => observer());
  }

  clearBasket() {
    this.#boardTasks = this.#boardTasks.filter(task => task.status !== 'basket');
    this._notifyObservers();
  }
}
