import {tasks} from '../mock/task.js';

export default class TaskModel{
    #boardtasks = tasks;

    getTasks() {
        return this.#boardtasks;
    }
}