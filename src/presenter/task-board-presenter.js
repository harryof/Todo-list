import TaskListComponent from "../view/task-list-component.js";
import TaskBoardComponent from "../view/board-task-component.js";
import { render } from "../framework/render.js";
import { Status, StatusLabel } from "../const.js";

export default class TaskBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #taskBoardComponent = new TaskBoardComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    const allTasks = this.#tasksModel.getTasks();
    render(this.#taskBoardComponent, this.#boardContainer);
  
    Object.values(Status).forEach((status) => {
      const tasksForStatus = allTasks.filter(task => task.status === status);
      
      const listConfig = {
        type: status,
        title: StatusLabel[status],
        tasks: tasksForStatus, 
        hasButton: status === Status.BASKET
      };
  
      const taskListComponent = new TaskListComponent(listConfig);
      render(taskListComponent, this.#taskBoardComponent.getElement());
    });
  }
}