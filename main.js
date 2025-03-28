import {render, RenderPosition} from './framework/render.js';
import HeaderComponent from './view/header-component.js';
import AddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/board-task-component.js';

const bodyContainer = document.querySelector('body');
const mainContainer = document.createElement('main');
mainContainer.classList.add('container');
bodyContainer.append(mainContainer);

// Рендерим компоненты
render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new AddTaskComponent(), mainContainer);
render(new TaskBoardComponent(), mainContainer);