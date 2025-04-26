import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TasksBoardPresenter from './presenter/task-board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import TasksModel from './model/task-model.js';
import TasksApiService from './task-api-service.js';

const END_POINT = 'https://680bde622ea307e081d29090.mockapi.io'
const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const boardContainer = document.querySelector('.taskboard');

const tasksModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT)
});


const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: boardContainer,
  tasksModel: tasksModel
});

render(new HeaderComponent(), bodyContainer, RenderPosition.AFTERBEGIN);

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskButtonClick
});
render(formAddTaskComponent, formContainer);

tasksBoardPresenter.init();

function handleNewTaskButtonClick() {
  tasksBoardPresenter.createTask();
}