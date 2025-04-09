import {render, RenderPosition} from './framework/render.js';
import HeaderComponent from './view/header-component.js';
import AddTaskComponent from './view/form-add-task-component.js';
import TaskBoardPresenter from './presenter/task-board-presenter.js';
import TaskModel from './model/task-model.js';

const bodyContainer = document.querySelector('body');
const mainContainer = document.createElement('main');
mainContainer.classList.add('container');
bodyContainer.append(mainContainer);


render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new AddTaskComponent(), mainContainer);


const tasksModel = new TaskModel();
const taskBoardPresenter = new TaskBoardPresenter({
  boardContainer: mainContainer, 
  tasksModel
});
taskBoardPresenter.init();